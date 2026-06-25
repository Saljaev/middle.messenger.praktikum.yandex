import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import HTTPTransport from './HTTPTransport';

describe('HTTPTransport', () => {
    const requests: any[] = [];

    beforeEach(() => {
        requests.length = 0;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    class MockXMLHttpRequest {
        open = vi.fn();
        send = vi.fn();
        setRequestHeader = vi.fn();
        withCredentials = false;
        status = 200;
        statusText = 'OK';
        responseText = '{}';
        responseType = '';
        response = {};
        timeout = 0;
        onload: Function | null = null;
        onerror: Function | null = null;
        onabort: Function | null = null;
        ontimeout: Function | null = null;
        abort = vi.fn();
        getResponseHeader = vi.fn().mockReturnValue('application/json');

        constructor() {
            requests.push(this);
        }
    }

    // @ts-ignore
    global.XMLHttpRequest = MockXMLHttpRequest;

    it('should make GET request', async () => {
        const http = new HTTPTransport('/test');
        const promise = http.get('/path');
        const xhr = requests[requests.length - 1];

        xhr.status = 200;
        xhr.responseText = '{"data":"ok"}';
        xhr.onload?.();

        const result = await promise;
        expect(result).toEqual({data: 'ok'});
        expect(xhr.open).toHaveBeenCalledWith('GET', expect.stringContaining('/test/path'));
    });

    it('should make POST request with JSON body', async () => {
        const http = new HTTPTransport('/test');
        const promise = http.post('/path', {data: {name: 'test'}});
        const xhr = requests[requests.length - 1];

        xhr.status = 200;
        xhr.responseText = '{"id":1}';
        xhr.onload?.();

        const result = await promise;
        expect(result).toEqual({id: 1});
        expect(xhr.send).toHaveBeenCalledWith(JSON.stringify({name: 'test'}));
        expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    });

    it('should make PUT request with FormData', async () => {
        const http = new HTTPTransport('/test');
        const formData = new FormData();
        const promise = http.put('/path', {data: formData});
        const xhr = requests[requests.length - 1];

        xhr.status = 200;
        xhr.responseText = '{}';
        xhr.onload?.();

        await promise;
        expect(xhr.send).toHaveBeenCalledWith(formData);
    });

    it('should reject on network error', async () => {
        const http = new HTTPTransport('/test');
        const promise = http.get('/path');
        const xhr = requests[requests.length - 1];

        xhr.onerror?.();

        await expect(promise).rejects.toEqual({reason: 'Network error', request: xhr});
    });

    it('should reject on timeout', async () => {
        const http = new HTTPTransport('/test');
        const promise = http.get('/path', {timeout: 1000});
        const xhr = requests[requests.length - 1];

        xhr.ontimeout?.();

        await expect(promise).rejects.toMatchObject({reason: 'Request timeout', timeout: 1000});
    });

    it('should reject on non-2xx status', async () => {
        const http = new HTTPTransport('/test');
        const promise = http.get('/path');
        const xhr = requests[requests.length - 1];

        xhr.status = 404;
        xhr.statusText = 'Not Found';
        xhr.responseText = '{"reason":"Not found"}';
        xhr.onload?.();

        await expect(promise).rejects.toMatchObject({
            status: 404,
            statusText: 'Not Found',
            response: {reason: 'Not found'},
        });
    });

    it('should append query string for GET with data', async () => {
        const http = new HTTPTransport('/test');
        const promise = http.get('/path', {data: {a: 1, b: 'test'}});
        const xhr = requests[requests.length - 1];

        xhr.status = 200;
        xhr.responseText = '{}';
        xhr.onload?.();

        await promise;
        expect(xhr.open).toHaveBeenCalledWith(
            'GET',
            expect.stringContaining('/test/path?a=1&b=test'),
        );
    });
});
