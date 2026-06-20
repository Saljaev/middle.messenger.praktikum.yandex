import {describe, it, expect, vi} from 'vitest';
import {Store as StoreClass} from './Store';

describe('Store', () => {
    it('should set value by path and notify subscribers', () => {
        const store = new StoreClass();
        const listener = vi.fn();

        store.subscribe(listener);
        store.set('user.name', 'John');

        expect(store.getState()).toEqual({user: {name: 'John'}});
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should support multiple subscribers', () => {
        const store = new StoreClass();
        const listener1 = vi.fn();
        const listener2 = vi.fn();

        store.subscribe(listener1);
        store.subscribe(listener2);
        store.set('a', 1);

        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should set nested paths', () => {
        const store = new StoreClass();

        store.set('a.b.c', 'value');

        expect(store.getState()).toEqual({a: {b: {c: 'value'}}});
    });
});
