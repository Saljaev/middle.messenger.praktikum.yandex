import queryStringify from '@/utils/queryString';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface HTTPOptions<TData = unknown> {
    method?: HTTPMethod;
    data?: TData;
    headers?: Record<string, string>;
    timeout?: number;
    responseType?: XMLHttpRequestResponseType;
}

class HTTPTransport {
    private baseUrl: string;

    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl;
    }

    get = <TResponse>(
        url: string,
        options: Omit<HTTPOptions, 'method' | 'data'> & {data?: Record<string, unknown>} = {},
    ): Promise<TResponse> => {
        return this.request<TResponse>(url, {...options, method: 'GET'}, options.timeout);
    };

    post = <TRequest, TResponse>(
        url: string,
        data?: TRequest | FormData,
        options: Omit<HTTPOptions, 'method' | 'data'> = {},
    ): Promise<TResponse> => {
        return this.request<TResponse>(url, {...options, method: 'POST', data}, options.timeout);
    };

    put = <TRequest, TResponse>(
        url: string,
        data?: TRequest | FormData,
        options: Omit<HTTPOptions, 'method' | 'data'> = {},
    ): Promise<TResponse> => {
        return this.request<TResponse>(url, {...options, method: 'PUT', data}, options.timeout);
    };

    delete = <TResponse>(
        url: string,
        options: Omit<HTTPOptions, 'method'> = {},
    ): Promise<TResponse> => {
        return this.request<TResponse>(url, {...options, method: 'DELETE'}, options.timeout);
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

            let fullUrl = this.baseUrl + url;
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
