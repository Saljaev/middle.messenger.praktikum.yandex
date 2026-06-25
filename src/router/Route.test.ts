import {describe, it, expect, vi, beforeEach} from 'vitest';
import Route from './Route';
import {Block} from '../core/Block';

class TestBlock extends Block {
    protected template = '<div>Test</div>';
    render = vi.fn();
    destroy = vi.fn();
    getContent = vi.fn().mockReturnValue(document.createElement('div'));
    dispatchComponentDidMount = vi.fn();
}

describe('Route', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="root"></div>';
    });

    it('should match exact path', () => {
        const route = new Route('/test', TestBlock, {rootQuery: '#root'});
        expect(route.match('/test')).toBe(true);
        expect(route.match('/other')).toBe(false);
    });

    it('should match param path', () => {
        const route = new Route('/chat/:id', TestBlock, {rootQuery: '#root'});
        expect(route.match('/chat/123')).toBe(true);
        expect(route.match('/chat/abc')).toBe(true);
        expect(route.match('/chat')).toBe(false);
    });

    it('should navigate and render on match', () => {
        const route = new Route('/test', TestBlock, {rootQuery: '#root'});
        const renderSpy = vi.spyOn(route as any, 'render').mockImplementation(() => {});

        route.navigate('/test');
        expect(renderSpy).toHaveBeenCalled();

        route.navigate('/other');
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should leave and destroy block', () => {
        const route = new Route('/test', TestBlock, {rootQuery: '#root'});
        // @ts-ignore
        route._block = new TestBlock();
        const destroySpy = vi.spyOn((route as any)._block, 'destroy');

        route.leave();
        expect(destroySpy).toHaveBeenCalled();
    });
});
