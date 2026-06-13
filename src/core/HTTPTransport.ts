import queryStringify from '@/utils/queryString';
import {API_BASE_URL} from '@api/const';

type HTTPMethodName = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface HTTPOptions<TData = unknown> {
    method?: HTTPMethodName;
    data?: TData;
    headers?: Record<string, string>;
    timeout?: number;
    responseType?: XMLHttpRequestResponseType;
}

type HTTPMethod = <R = unknown>(url: string, options?: Omit<HTTPOptions, 'method'>) => Promise<R>;

class HTTPTransport {
    private baseUrl: string;

    constructor(path: string = '') {
        this.baseUrl = path.startsWith('http') ? path : API_BASE_URL + path;
    }

    get: HTTPMethod = (url, options = {}) => {
        return this.request(url, {...options, method: 'GET'}, options.timeout);
    };

    post: HTTPMethod = (url, options = {}) => {
        return this.request(url, {...options, method: 'POST'}, options.timeout);
    };

    put: HTTPMethod = (url, options = {}) => {
        return this.request(url, {...options, method: 'PUT'}, options.timeout);
    };

    delete: HTTPMethod = (url, options = {}) => {
        return this.request(url, {...options, method: 'DELETE'}, options.timeout);
    };

    request = <TResponse>(
        url: string,
        options: HTTPOptions = {},
        timeout = 5000,
    ): Promise<TResponse> => {
        const {headers = {}, method, data, responseType} = options;

        return new Promise((resolve, reject) => {
            if (!method) {
                reject(new Error('HTTP method is required'));
                return;
            }

            const xhr = new XMLHttpRequest();
            const isGet = method === 'GET';

            let fullUrl = this.baseUrl.replace(/\/$/, '') + url;
            if (isGet && data && typeof data === 'object' && !(data instanceof FormData)) {
                const query = queryStringify(data);
                fullUrl += query ? `?${query}` : '';
            }

            xhr.open(method, fullUrl);
            xhr.withCredentials = true;

            if (responseType) {
                xhr.responseType = responseType;
            }

            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    let response: unknown;

                    if (xhr.responseType) {
                        response = xhr.response;
                    } else {
                        try {
                            const contentType = xhr.getResponseHeader('Content-Type');
                            if (contentType && contentType.includes('application/json')) {
                                response = JSON.parse(xhr.responseText);
                            } else {
                                response = xhr.responseText;
                            }
                        } catch {
                            response = xhr.responseText;
                        }
                    }

                    resolve(response as TResponse);
                } else {
                    let errorResponse: unknown;
                    try {
                        errorResponse = JSON.parse(xhr.responseText);
                    } catch {
                        errorResponse = xhr.responseText;
                    }
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                        response: errorResponse,
                        request: xhr,
                    });
                }
            };

            xhr.onabort = () =>
                reject({
                    reason: 'Request aborted',
                    request: xhr,
                });

            xhr.onerror = () =>
                reject({
                    reason: 'Network error',
                    request: xhr,
                });

            xhr.timeout = timeout;

            xhr.ontimeout = () =>
                reject({
                    reason: 'Request timeout',
                    timeout,
                    request: xhr,
                });

            if (isGet || !data) {
                xhr.send();
            } else if (data instanceof FormData) {
                xhr.send(data);
            } else if (typeof data === 'object') {
                if (!headers['Content-Type']) {
                    xhr.setRequestHeader('Content-Type', 'application/json');
                }
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send(data as XMLHttpRequestBodyInit);
            }
        });
    };
}

export default HTTPTransport;
