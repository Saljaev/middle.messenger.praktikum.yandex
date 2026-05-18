export type Listener = (...args: unknown[]) => void;

export class EventBus<E extends string = string> {
    private listeners: Record<E, Listener[]> = {} as Record<E, Listener[]>;

    on(event: E, callback: Listener): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: E, callback: Listener): void {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
        this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
    }

    emit(event: E, ...args: unknown[]): void {
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event].forEach((listener) => {
            listener(...args);
        });
    }
}
