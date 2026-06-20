import {describe, it, expect} from 'vitest';
import merge from './merge';

describe('merge', () => {
    it('should merge flat objects', () => {
        const lhs = {a: 1};
        const rhs = {b: 2};

        expect(merge(lhs, rhs)).toEqual({a: 1, b: 2});
    });

    it('should merge nested objects recursively', () => {
        const lhs = {a: {b: 1}};
        const rhs = {a: {c: 2}};

        expect(merge(lhs, rhs)).toEqual({a: {b: 1, c: 2}});
    });

    it('should overwrite primitive with object', () => {
        const lhs = {a: 1};
        const rhs = {a: {b: 2}};

        expect(merge(lhs, rhs)).toEqual({a: {b: 2}});
    });
});
