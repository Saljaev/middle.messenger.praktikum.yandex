import {describe, it, expect} from 'vitest';
import isEqual from './isEqual';

describe('isEqual', () => {
    it('should return true for identical primitives', () => {
        expect(isEqual(1 as any, 1 as any)).toBe(true);
        expect(isEqual('a' as any, 'a' as any)).toBe(true);
    });

    it('should return false for different primitives', () => {
        expect(isEqual(1 as any, 2 as any)).toBe(false);
    });

    it('should return true for equal objects', () => {
        expect(isEqual({a: 1}, {a: 1})).toBe(true);
    });

    it('should return false for different objects', () => {
        expect(isEqual({a: 1}, {a: 2})).toBe(false);
    });

    it('should return true for equal arrays', () => {
        expect(isEqual([1, 2], [1, 2])).toBe(true);
    });

    it('should return false for different arrays', () => {
        expect(isEqual([1, 2], [1, 3])).toBe(false);
    });

    it('should return false for null vs object', () => {
        expect(isEqual(null as any, {a: 1})).toBe(false);
    });
});
