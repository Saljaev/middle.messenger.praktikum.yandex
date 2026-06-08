import {Block, BlockOwnProps} from '@/core/Block';
import {connect} from '@/utils/connect';
import {ChatResponse} from '@/api/types';
import {getActiveChatId, prepareChats} from '@/utils/chats';
import {Indexed} from '@/types';

interface ChatListProps extends BlockOwnProps {
    chats?: Array<Record<string, unknown>>;
}

class ChatList extends Block<ChatListProps> {
    protected template = `
        <nav class="sidebar__chat-list">
            {{#each chats}}
            <a href="/chat/{{this.id}}" class="chat-item {{#if this.isActive}}chat-item--active{{/if}} {{#if this.unreadCount}}chat-item--unread{{/if}}">
                <div class="chat-item__avatar">
                    <img src="{{this.avatarUrl}}" alt="{{this.title}}" class="avatar__image" style="width:48px;height:48px;border-radius:50%;object-fit:cover;" onerror="this.src='https://placehold.co/200/0088cc/white?text=?'">
                    {{#if this.online}}
                    <span class="chat-item__online-status"></span>
                    {{/if}}
                </div>
                <div class="chat-item__content">
                    <div class="chat-item__header">
                        <h3 class="chat-item__title">{{this.title}}</h3>
                        <div class="chat-item__meta">
                            {{#if this.isPinned}}
                            <span class="chat-item__pin">{{{pushPinIcon}}}</span>
                            {{/if}}
                            {{#if this.lastMessageTime}}
                            <span class="chat-item__time">{{this.lastMessageTime}}</span>
                            {{/if}}
                        </div>
                    </div>
                    <div class="chat-item__message">
                        {{#if this.lastMessageSender}}
                        <span class="chat-item__sender">{{this.lastMessageSender}}:</span>
                        {{/if}}
                        <span class="chat-item__text">{{this.lastMessageText}}</span>
                        {{#if this.unreadCount}}
                        <span class="chat-item__badge">{{this.unreadCount}}</span>
                        {{/if}}
                    </div>
                </div>
            </a>
            {{/each}}
        </nav>
    `;
}

export default connect<ChatListProps>((state: Indexed) => {
    const chats = (state.chats as ChatResponse[]) || [];
    const activeId = getActiveChatId();
    const preparedChats = prepareChats(chats, activeId);
    return {
        chats: preparedChats as unknown as Record<string, unknown>[],
    };
})(ChatList);
