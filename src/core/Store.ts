import {EventBus} from './EventBus';
import set from '@/utils/set';
import {Indexed} from '@/types';

const STORE_EVENTS = {
    UPDATED: 'updated',
} as const;

type StoreEvent = (typeof STORE_EVENTS)[keyof typeof STORE_EVENTS];

class Store {
    private state: Indexed = {};
    private eventBus: EventBus<StoreEvent>;

    constructor() {
        this.eventBus = new EventBus<StoreEvent>();
    }

    public set(path: string, value: unknown): void {
        set(this.state, path, value);
        this.eventBus.emit(STORE_EVENTS.UPDATED);
    }

    public getState(): Indexed {
        return this.state;
    }

    public subscribe(listener: () => void): void {
        this.eventBus.on(STORE_EVENTS.UPDATED, listener);
    }
}

export default new Store();
export {Store};
