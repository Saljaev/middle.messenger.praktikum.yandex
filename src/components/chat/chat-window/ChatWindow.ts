import {Block, BlockOwnProps} from '../../../core/Block';
import {Icon} from '../../base/icon/Icon';

interface ChatWindowProps extends BlockOwnProps {
    chat?: Record<string, unknown>;
    header?: Block;
    messages?: Block[];
    input?: Block;
}

export class ChatWindow extends Block<ChatWindowProps> {
    protected template = `
        <div class="chat-window">
            {{#if chat}}
                {{{header}}}
                <div class="chat-window__messages">
                    {{{messages}}}
                </div>
                {{{input}}}
            {{else}}
                <div class="chat-window__empty">
                    {{{chatIcon}}}
                    <h2 class="chat-window__empty-title">Добро пожаловать</h2>
                    <p class="chat-window__empty-text">Выберите чат чтобы начать общение</p>
                </div>
            {{/if}}
        </div>
    `;

    constructor(props: ChatWindowProps) {
        super({
            ...props,
            chatIcon: new Icon({name: 'chat', className: 'chat-window__empty-icon'}),
        });
    }
}
