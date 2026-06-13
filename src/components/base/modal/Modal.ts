import {Block, BlockOwnProps} from '../../../core/Block';

interface ModalProps extends BlockOwnProps {
    content: Block;
    isOpen?: boolean;
}

export class Modal extends Block<ModalProps> {
    constructor(props: ModalProps) {
        super({
            ...props,
            isOpen: props.isOpen ?? false,
        });
    }

    protected template = `
        <div class="modal {{#if isOpen}}modal--open{{/if}}" ref="overlay">
            <div class="modal__content" ref="content">
                {{{content}}}
            </div>
        </div>
    `;

    public open(): void {
        this.setProps({isOpen: true});
    }

    public close(): void {
        this.setProps({isOpen: false});
    }

    protected init(): void {
        this.events = {
            click: (e: Event) => {
                const target = e.target as HTMLElement;
                if (target === this.refs['overlay']) {
                    this.close();
                }
            },
        };
    }
}
