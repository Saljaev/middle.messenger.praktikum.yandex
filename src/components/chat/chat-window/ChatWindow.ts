import {Block, BlockOwnProps} from '../../../core/Block';
// import {Icon} from '../../base/icon/Icon';

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
                <div class="chat-window__empty-icon">💬</div>
                <h2 class="chat-window__empty-title">Выберите чат</h2>
                <p class="chat-window__empty-text">Начните общение, выбрав чат из списка</p>
                </div>
            {{/if}}
        </div>
    `;

    constructor(props: ChatWindowProps) {
        super({
            ...props,
            // chatIcon: new Icon({name: 'chat', className: 'chat-window__empty-icon'}),
        });
    }
}
