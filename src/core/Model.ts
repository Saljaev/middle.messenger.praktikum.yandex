import {EventBus} from './EventBus';

export abstract class Model<S extends Record<string, unknown>> {
    protected state: S;

    private eventBus: EventBus;

    constructor(initialState: S) {
        this.state = {...initialState};
        this.eventBus = new EventBus();
    }

    public getState(): S {
        return {...this.state};
    }

    public setState(newState: Partial<S>): void {
        const prevState = {...this.state};
        this.state = {...this.state, ...newState};
        this.emit('changed', prevState, this.state);
    }

    public on(event: string, callback: (...args: unknown[]) => void): void {
        this.eventBus.on(event, callback);
    }

    public off(event: string, callback: (...args: unknown[]) => void): void {
        this.eventBus.off(event, callback);
    }

    protected emit(event: string, ...args: unknown[]): void {
        this.eventBus.emit(event, ...args);
    }
}
