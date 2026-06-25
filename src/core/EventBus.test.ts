import {describe, it, expect, vi} from 'vitest';
import {EventBus} from './EventBus';

describe('EventBus', () => {
    it('should subscribe and emit events', () => {
        const bus = new EventBus();
        const listener = vi.fn();

        bus.on('test', listener);
        bus.emit('test', 1, 2);

        expect(listener).toHaveBeenCalledWith(1, 2);
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should support multiple listeners for the same event', () => {
        const bus = new EventBus();
        const listener1 = vi.fn();
        const listener2 = vi.fn();

        bus.on('test', listener1);
        bus.on('test', listener2);
        bus.emit('test', 'data');

        expect(listener1).toHaveBeenCalledWith('data');
        expect(listener2).toHaveBeenCalledWith('data');
    });

    it('should unsubscribe listener', () => {
        const bus = new EventBus();
        const listener = vi.fn();

        bus.on('test', listener);
        bus.off('test', listener);
        bus.emit('test');

        expect(listener).not.toHaveBeenCalled();
    });

    it('should throw when unsubscribing from non-existent event', () => {
        const bus = new EventBus();
        const listener = vi.fn();

        expect(() => bus.off('unknown', listener)).toThrow('Нет события: unknown');
    });

    it('should do nothing when emitting non-existent event', () => {
        const bus = new EventBus();

        expect(() => bus.emit('unknown')).not.toThrow();
    });
});
