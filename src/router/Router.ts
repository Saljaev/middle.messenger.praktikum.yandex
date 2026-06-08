import Route from './Route';
import {Block, BlockOwnProps} from '../core/Block';
import {authController} from '../controllers/AuthController';
import {isPublicRoute} from '../utils/routes';

class Router {
    private static __instance: Router;
    private routes: Route[] = [];
    private history = window.history;
    private _currentRoute: Route | null = null;
    private _rootQuery: string = '';

    public static getInstance(): Router {
        if (!Router.__instance) {
            throw new Error('Router not initialized');
        }
        return Router.__instance;
    }

    constructor(rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this.routes = [];
        this._rootQuery = rootQuery;
        this._currentRoute = null;

        Router.__instance = this;
    }

    use(pathname: string, block: new (props?: BlockOwnProps) => Block): this {
        const route = new Route(pathname, block, {rootQuery: this._rootQuery});

        this.routes.push(route);

        return this;
    }

    start(): void {
        window.onpopstate = () => {
            this._onRoute(window.location.pathname);
        };

        this._onRoute(window.location.pathname);
    }

    private _onRoute(pathname: string): void {
        const isAuth = authController.isAuthenticated();

        if (!isAuth && !isPublicRoute(pathname)) {
            this.go('/');
            return;
        }

        if (isAuth && isPublicRoute(pathname)) {
            this.go('/messenger');
            return;
        }

        let route = this.getRoute(pathname);

        if (!route) {
            route = this.getRoute('/404');
        }

        if (!route) {
            return;
        }

        if (this._currentRoute) {
            this._currentRoute.leave();
        }

        this._currentRoute = route;
        route.render();
    }

    go(pathname: string): void {
        this.history.pushState({}, '', pathname);
        this._onRoute(pathname);
    }

    back(): void {
        this.history.back();
    }

    forward(): void {
        this.history.forward();
    }

    getRoute(pathname: string): Route | undefined {
        return this.routes.find((route) => route.match(pathname));
    }
}

export default Router;
