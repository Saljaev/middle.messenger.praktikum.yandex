import {Block, BlockOwnProps} from '../../../core/Block';

interface IconProps extends BlockOwnProps {
    name: string;
    className?: string;
    style?: string;
}

export class Icon extends Block<IconProps> {
    protected template = `
        <span class="material-symbols-outlined {{className}}" style="{{style}}">{{name}}</span>
    `;

    constructor(props: IconProps) {
        super({
            className: '',
            style: '',
            ...props,
        });
    }
}
