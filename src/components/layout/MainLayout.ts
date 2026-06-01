import {Block, BlockOwnProps} from '../../core/Block';
import {Icon} from '../base/icon/Icon';

interface MainLayoutProps extends BlockOwnProps {
    userAvatar: string;
    userName: string;
    userDisplayName?: string;
    userStatus?: string;
    chats: Array<Record<string, unknown>>;
    content: Block;
}

export class MainLayout extends Block<MainLayoutProps> {
    constructor(props: MainLayoutProps) {
        super({
            ...props,
            settingsIcon: new Icon({name: 'settings'}),
        });
    }

    protected template = `
        <div class="app">
            <aside class="app__sidebar sidebar">
                <div class="sidebar-header">
                    <a href="/settings" class="sidebar-header__user">
                        <img src="{{userAvatar}}" alt="{{userName}}" class="avatar__image" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
                        <div class="sidebar-header__user-info">
                            <span class="sidebar-header__user-display-name">{{userDisplayName}}</span>
                            <span class="sidebar-header__user-status">{{userStatus}}</span>
                        </div>
                    </a>
                    <div class="sidebar-header__actions">
                        <a href="/settings" class="sidebar-header__action-btn" title="Настройки">
                            {{{settingsIcon}}}
                        </a>
                    </div>
                </div>
                <div class="sidebar__search">
                    <input type="text" class="sidebar__search-input" placeholder="Поиск...">
                </div>
                <nav class="sidebar__chat-list">
                    {{#each chats}}
                    <a href="/chat/{{this.id}}" class="chat-item {{#if this.isActive}}chat-item--active{{/if}} {{#if this.unreadCount}}chat-item--unread{{/if}}">
                        <div class="chat-item__avatar">
                            <img src="{{this.avatarUrl}}" alt="{{this.title}}" class="avatar__image" style="width:48px;height:48px;border-radius:50%;object-fit:cover;">
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
            </aside>
            <main class="app__content">
                {{{content}}}
            </main>
        </div>
    `;
}
