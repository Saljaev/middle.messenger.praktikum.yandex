import {describe, it, expect} from 'vitest';
import cloneDeep from './cloneDeep';

describe('cloneDeep', () => {
    it('should clone primitive values', () => {
        expect(cloneDeep(1 as any)).toBe(1);
        expect(cloneDeep('str' as any)).toBe('str');
    });

    it('should clone object', () => {
        const obj = {a: 1, b: {c: 2}};
        const cloned = cloneDeep(obj);

        expect(cloned).toEqual(obj);
        expect(cloned).not.toBe(obj);
        expect((cloned as any).b).not.toBe(obj.b);
    });

    it('should clone array', () => {
        const arr = [1, {a: 2}, [3]];
        const cloned = cloneDeep(arr);

        expect(cloned).toEqual(arr);
        expect(cloned).not.toBe(arr);
        expect((cloned as any)[1]).not.toBe(arr[1]);
    });
});
