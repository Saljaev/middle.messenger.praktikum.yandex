import {Block, BlockOwnProps} from '../../../core/Block';
import {Icon} from '../../base/icon/Icon';

interface ChatHeaderProps extends BlockOwnProps {
    chat: Record<string, unknown>;
}

export class ChatHeader extends Block<ChatHeaderProps> {
    constructor(props: ChatHeaderProps) {
        super({
            ...props,
            personAddIcon: new Icon({name: 'person_add'}),
            searchIcon: new Icon({name: 'search'}),
            menuIcon: new Icon({name: 'menu'}),
        });
    }

    protected template = `
        <div class="chat-header">
            <a href="/chat/{{chat.id}}/info" class="chat-header__info">
                <div class="avatar avatar--small">
                    <img src="{{chat.avatarUrl}}" alt="{{chat.title}}" class="avatar__image" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
                </div>
                <div class="chat-header__details">
                    <h2 class="chat-header__title">{{chat.title}}</h2>
                    {{#if chat.membersCount}}
                        <div class="chat-header__status">{{chat.membersCount}} участников</div>
                    {{else}}
                        <div class="chat-header__status">{{chat.status}}</div>
                    {{/if}}
                </div>
            </a>
            <div class="chat-header__actions">
                {{#if chat.isGroup}}
                    <button class="chat-header__action-btn" title="Добавить участников">
                        {{{personAddIcon}}}
                    </button>
                {{/if}}
                <button class="chat-header__action-btn" title="Поиск в чате">
                    {{{searchIcon}}}
                </button>
                <button class="chat-header__action-btn" title="Меню">
                    {{{menuIcon}}}
                </button>
            </div>
        </div>
    `;
}
