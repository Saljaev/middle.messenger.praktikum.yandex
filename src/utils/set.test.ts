import {describe, it, expect} from 'vitest';
import set from './set';

describe('set', () => {
    it('should set value by path', () => {
        const obj = {};
        set(obj, 'a.b.c', 'value');

        expect(obj).toEqual({a: {b: {c: 'value'}}});
    });

    it('should overwrite existing value', () => {
        const obj = {a: {b: 1}};
        set(obj, 'a.b', 2);

        expect(obj).toEqual({a: {b: 2}});
    });

    it('should throw if path is not string', () => {
        expect(() => set({}, 1 as any, 'value')).toThrow('path must be string');
    });

    it('should return original object if not object type', () => {
        expect(set(null, 'a', 1)).toBeNull();
    });
});
