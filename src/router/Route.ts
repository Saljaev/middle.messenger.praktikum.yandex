import {Block, BlockOwnProps} from '../core/Block';

export default class Route {
    private _pathname: string;
    private _blockClass: new (props?: BlockOwnProps) => Block;
    private _block: Block | null = null;
    private _props: {rootQuery: string};

    constructor(
        pathname: string,
        view: new (props?: BlockOwnProps) => Block,
        props: {rootQuery: string},
    ) {
        this._pathname = pathname;
        this._blockClass = view;
        this._props = props;
    }

    navigate(pathname: string): void {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    leave(): void {
        if (this._block) {
            this._block.destroy();
            this._block = null;
        }
    }

    match(pathname: string): boolean {
        if (pathname === this._pathname) {
            return true;
        }

        const pattern = this._pathname.replace(/:\w+/g, '([^/]+)');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(pathname);
    }

    render(): void {
        if (this._block) {
            this._block.destroy();
        }

        this._block = new this._blockClass();
        this._block.render();

        const root = document.querySelector(this._props.rootQuery);
        if (!root) {
            console.warn(`Root element "${this._props.rootQuery}" not found`);
            return;
        }

        root.innerHTML = '';
        const content = this._block.getContent();
        if (content) {
            root.appendChild(content);
            this._block.dispatchComponentDidMount();
        }
    }
}
