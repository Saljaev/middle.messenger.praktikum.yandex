import {Block, BlockOwnProps} from '../../../core/Block';

interface ButtonProps extends BlockOwnProps {
    label: string;
    type?: string;
    className?: string;
    onClick?: (e: MouseEvent) => void;
}

export class Button extends Block<ButtonProps> {
    protected template = `<button class="button {{className}}" type="{{type}}">{{label}}</button>`;

    constructor(props: ButtonProps) {
        super({
            type: 'button',
            className: '',
            ...props,
        });

        if (props.onClick) {
            this.events = {
                click: props.onClick,
            };
        }
    }
}
