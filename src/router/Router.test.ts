import {describe, it, expect, vi, beforeEach} from 'vitest';
import Router from './Router';
import {Block} from '../core/Block';

class TestBlock extends Block {
    protected template = '<div>Test</div>';
}

const mockIsAuthenticated = vi.fn();

vi.mock('../controllers/AuthController', () => ({
    authController: {
        isAuthenticated: () => mockIsAuthenticated(),
    },
}));

describe('Router', () => {
    beforeEach(() => {
        // @ts-ignore
        Router.__instance = undefined;
        // @ts-ignore
        window.history.pushState({}, '', '/');
    });

    it('should be singleton', () => {
        const router1 = new Router('#root');
        const router2 = new Router('#root');
        expect(router1).toBe(router2);
    });

    it('should throw if getInstance before init', () => {
        // @ts-ignore
        Router.__instance = undefined;
        expect(() => Router.getInstance()).toThrow('Router not initialized');
    });

    it('should register routes via use()', () => {
        const router = new Router('#root');
        router.use('/', TestBlock).use('/about', TestBlock);
        expect(router.getRoute('/')).toBeDefined();
        expect(router.getRoute('/about')).toBeDefined();
    });

    it('should redirect unauthenticated user from private route', () => {
        mockIsAuthenticated.mockReturnValue(false);
        const router = new Router('#root');
        router.use('/', TestBlock).use('/messenger', TestBlock);
        router.go('/messenger');
        expect(window.location.pathname).toBe('/');
    });

    it('should redirect authenticated user from public route', () => {
        mockIsAuthenticated.mockReturnValue(true);
        const router = new Router('#root');
        router.use('/', TestBlock).use('/messenger', TestBlock);
        router.go('/');
        expect(window.location.pathname).toBe('/messenger');
    });

    it('should fallback to 404 if route not found', () => {
        mockIsAuthenticated.mockReturnValue(true);
        const router = new Router('#root');
        router.use('/404', TestBlock);
        router.go('/unknown');
        expect(router.getRoute('/404')).toBeDefined();
    });

    it('should navigate with go()', () => {
        mockIsAuthenticated.mockReturnValue(true);
        const router = new Router('#root');
        router.use('/a', TestBlock).use('/b', TestBlock);
        router.go('/a');
        expect(window.location.pathname).toBe('/a');
        router.go('/b');
        expect(window.location.pathname).toBe('/b');
    });

    it('should support back() and forward()', () => {
        const router = new Router('#root');
        const backSpy = vi.spyOn(window.history, 'back');
        const forwardSpy = vi.spyOn(window.history, 'forward');

        router.back();
        expect(backSpy).toHaveBeenCalled();

        router.forward();
        expect(forwardSpy).toHaveBeenCalled();
    });
});
