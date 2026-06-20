import {describe, it, expect, vi} from 'vitest';
import {Block} from './Block';

class TestBlock extends Block {
    protected template = `
        <div class="test-block" ref="root">
            <span ref="text">{{text}}</span>
        </div>
    `;
}

class ChildBlock extends Block {
    protected template = '<span class="child">child</span>';
}

describe('Block', () => {
    it('should create element with props', () => {
        const block = new TestBlock({text: 'hello'});
        const element = block.getContent();

        expect(element).toBeInstanceOf(HTMLElement);
        expect(element?.querySelector('span')?.textContent).toBe('hello');
    });

    it('should set props and trigger re-render', () => {
        const block = new TestBlock({text: 'hello'});
        block.getContent();

        block.setProps({text: 'world'});
        const element = block.getContent();

        expect(element?.querySelector('span')?.textContent).toBe('world');
    });

    it('should not re-render if props shallow equal', () => {
        const block = new TestBlock({text: 'hello'});
        const renderSpy = vi.spyOn(block as any, 'render');

        block.setProps({text: 'hello'});
        expect(renderSpy).not.toHaveBeenCalled();
    });

    it('should have refs', () => {
        const block = new TestBlock({text: 'hello'});
        block.getContent();

        expect((block as any).refs['root']).toBeInstanceOf(HTMLDivElement);
        expect((block as any).refs['text']).toBeInstanceOf(HTMLSpanElement);
    });

    it('should render child blocks', () => {
        class ParentBlock extends Block {
            protected template = '<div>{{{child}}}</div>';
        }

        const child = new ChildBlock();
        const parent = new ParentBlock({child});
        const element = parent.getContent();

        expect(element?.querySelector('.child')).toBeInstanceOf(HTMLSpanElement);
    });

    it('should attach and remove event listeners', () => {
        const clickHandler = vi.fn();

        class EventBlock extends Block {
            protected template = '<button ref="btn">Click</button>';
            protected events = {click: clickHandler};
        }

        const block = new EventBlock();
        const element = block.getContent();
        element?.click();

        expect(clickHandler).toHaveBeenCalled();
    });

    it('should call lifecycle methods', async () => {
        vi.useFakeTimers();
        const initSpy = vi.fn();
        const mountSpy = vi.fn();
        const unmountSpy = vi.fn();

        class LifecycleBlock extends Block {
            protected template = '<div></div>';
            protected init() {
                initSpy();
            }
            protected componentDidMount() {
                mountSpy();
            }
            protected componentWillUnmount() {
                unmountSpy();
            }
        }

        const block = new LifecycleBlock();
        await vi.runAllTimersAsync();
        block.getContent();
        block.dispatchComponentDidMount();
        block.destroy();

        expect(initSpy).toHaveBeenCalled();
        expect(mountSpy).toHaveBeenCalled();
        expect(unmountSpy).toHaveBeenCalled();
        vi.useRealTimers();
    });
});
