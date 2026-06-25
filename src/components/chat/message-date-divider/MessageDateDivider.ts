import {Block, BlockOwnProps} from '../../../core/Block';

interface MessageDateDividerProps extends BlockOwnProps {
    date: string;
}

export class MessageDateDivider extends Block<MessageDateDividerProps> {
    protected template = `
        <div class="message-date-divider">
            <span class="message-date-divider__label">{{date}}</span>
        </div>
    `;

    constructor(props: MessageDateDividerProps) {
        super(props);
    }
}
