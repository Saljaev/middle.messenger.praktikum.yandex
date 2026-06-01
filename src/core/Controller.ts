import {Block} from './Block';
import {Model} from './Model';

export abstract class Controller<
    M extends Model<Record<string, unknown>> = Model<Record<string, unknown>>,
    V extends Block = Block,
> {
    protected model: M;

    protected view: V | null = null;

    constructor(model: M) {
        this.model = model;
    }

    public setView(view: V): void {
        this.view = view;
    }

    public getView(): V | null {
        return this.view;
    }

    public abstract init(): void;
}
