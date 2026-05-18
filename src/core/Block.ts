import Handlebars from 'handlebars';
import {EventBus} from './EventBus';

type EventMap = Partial<{
    [K in keyof HTMLElementEventMap]: (evt: HTMLElementEventMap[K]) => void;
}>;

const BLOCK_EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
} as const;

type BlockEvent = (typeof BLOCK_EVENTS)[keyof typeof BLOCK_EVENTS];

export interface BlockChildren {
    component: Block<Record<string, unknown>>;
    embed(node: DocumentFragment): void;
}

export interface BlockOwnProps {
    [key: string]: unknown;
    __children?: BlockChildren[];
    __refs?: Record<string, Element>;
}

export abstract class Block<Props extends BlockOwnProps = BlockOwnProps> {
    static EVENTS = BLOCK_EVENTS;

    protected abstract template: string;

    public id = Math.floor(100000 + Math.random() * 900000).toString();

    protected props: Props;

    private _element: HTMLElement | null = null;

    protected events: EventMap = {};

    protected refs: Record<string, Element> = {};

    protected children: Block<Record<string, unknown>>[] = [];

    private _compiledTemplate: ReturnType<typeof Handlebars.compile> | null = null;

    private eventBus: () => EventBus<BlockEvent>;

    constructor(props: Props = {} as Props) {
        const eventBus = new EventBus<BlockEvent>();
        this.eventBus = () => eventBus;
        this.props = props;

        this._registerEvents(eventBus);
        setTimeout(() => eventBus.emit(Block.EVENTS.INIT), 0);
    }

    private _registerEvents(eventBus: EventBus<BlockEvent>): void {
        eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, (...args: unknown[]) =>
            this._componentDidUpdate(args[0] as Props, args[1] as Props),
        );
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    private _init(): void {
        this.init();
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    protected init(): void {}

    private _componentDidMount(): void {
        this.componentDidMount();
    }

    protected componentDidMount(): void {}

    public dispatchComponentDidMount(): void {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
        this.children.forEach((child) => child.dispatchComponentDidMount());
    }

    private _componentDidUpdate(oldProps: Props, newProps: Props): void {
        const response = this.componentDidUpdate(oldProps, newProps);
        if (!response) {
            return;
        }
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    protected componentDidUpdate(_oldProps: Props, _newProps: Props): boolean {
        return true;
    }

    public setProps(nextProps: Partial<Props>): void {
        if (!nextProps) {
            return;
        }

        const prevProps = {...this.props};

        Object.assign(this.props, nextProps);

        if (this._shallowEqual(prevProps, this.props)) {
            return;
        }

        this.eventBus().emit(Block.EVENTS.FLOW_CDU, prevProps, this.props);
    }

    private _shallowEqual(objA: Record<string, unknown>, objB: Record<string, unknown>): boolean {
        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        for (const key of keysA) {
            if (objA[key] !== objB[key]) {
                return false;
            }
        }

        return true;
    }

    public get element(): HTMLElement | null {
        return this._element;
    }

    private _render(): void {
        const oldElement = this._element;
        this.unmountComponent();
        const fragment = this.compile();

        if (fragment) {
            if (oldElement) {
                oldElement.replaceWith(fragment);
            }
            this._element = fragment;
            this.mountComponent();
        }
    }

    public render(): void {
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    private compile(): HTMLElement | null {
        if (!this._compiledTemplate) {
            this._compiledTemplate = Handlebars.compile(this.template);
        }

        this.children = [];
        const blockChildren = new Map<string, Block>();
        const templateProps: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(this.props)) {
            if (value instanceof Block) {
                blockChildren.set(key, value);
                templateProps[key] = `<div data-block-placeholder="${key}"></div>`;
            } else if (
                Array.isArray(value) &&
                value.length > 0 &&
                (value as unknown[]).every((item) => item instanceof Block)
            ) {
                const placeholders: string[] = [];
                (value as Block[]).forEach((child, index) => {
                    const childKey = `${key}_${index}`;
                    blockChildren.set(childKey, child);
                    placeholders.push(`<div data-block-placeholder="${childKey}"></div>`);
                });
                templateProps[key] = placeholders.join('');
            } else {
                templateProps[key] = value;
            }
        }

        const html = this._compiledTemplate(templateProps);
        const templateElement = document.createElement('template');
        templateElement.innerHTML = html;
        const fragment = templateElement.content;

        blockChildren.forEach((child, key) => {
            const placeholder = fragment.querySelector(`[data-block-placeholder="${key}"]`);
            if (placeholder) {
                this.children.push(child);
                const content = child.getContent();
                if (content) {
                    placeholder.replaceWith(content);
                } else {
                    placeholder.remove();
                }
            }
        });

        if (this.props.__children) {
            this.children = this.props.__children.map((child) => child.component);
            this.props.__children.forEach((child) => {
                child.embed(fragment);
            });
        }

        const defaultRefs = this.props.__refs ?? {};
        this.refs = Array.from(fragment.querySelectorAll('[ref]')).reduce(
            (list, element) => {
                const key = element.getAttribute('ref') as string;
                list[key] = element as HTMLElement;
                element.removeAttribute('ref');
                return list;
            },
            {...defaultRefs} as Record<string, Element>,
        );

        return templateElement.content.firstElementChild as HTMLElement | null;
    }

    public getContent(): HTMLElement | null {
        if (!this._element) {
            this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
        }
        return this._element;
    }

    private mountComponent(): void {
        this.attachListeners();
        this.componentDidMount();
    }

    private unmountComponent(): void {
        if (this._element) {
            [...this.children].reverse().forEach((child) => child.unmountComponent());
            this.componentWillUnmount();
            this.removeListeners();
            this._element = null;
        }
    }

    protected componentWillUnmount(): void {}

    public destroy(): void {
        this.unmountComponent();
    }

    private attachListeners(): void {
        for (const eventName of Object.keys(this.events) as Array<keyof typeof this.events>) {
            const callback = this.events[eventName];
            if (typeof callback === 'function' && this._element) {
                this._element.addEventListener(eventName, callback as (e: Event) => void);
            }
        }
    }

    private removeListeners(): void {
        for (const eventName of Object.keys(this.events) as Array<keyof typeof this.events>) {
            const callback = this.events[eventName];
            if (typeof callback === 'function' && this._element) {
                this._element.removeEventListener(eventName, callback as (e: Event) => void);
            }
        }
    }
}
