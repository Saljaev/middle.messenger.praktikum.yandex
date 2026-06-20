import {describe, it, expect} from 'vitest';
import queryStringify from './queryString';

describe('queryStringify', () => {
    it('should stringify simple object', () => {
        const result = queryStringify({a: 1, b: 'test'});
        expect(result).toBe('a=1&b=test');
    });

    it('should stringify nested object', () => {
        const result = queryStringify({a: {b: 1}});
        expect(result).toBe('a[b]=1');
    });

    it('should stringify arrays', () => {
        const result = queryStringify({a: [1, 2]});
        expect(result).toBe('a[0]=1&a[1]=2');
    });

    it('should throw on non-object input', () => {
        expect(() => queryStringify(null as any)).toThrow('input must be an object');
        expect(() => queryStringify([1, 2] as any)).toThrow('input must be an object');
    });
});
