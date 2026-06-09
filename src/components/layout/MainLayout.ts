import {Block, BlockOwnProps} from '../../core/Block';
import {Icon} from '../base/icon/Icon';
import {Modal} from '../base/modal/Modal';
import {CreateChatForm} from '../form/create-chat-form/CreateChatForm';
import {connect} from '../../utils/connect';
import {Indexed} from '../../types';
import {getAvatarUrl} from '../../utils/chats';
import {PLACEHOLDER_AVATAR_URL} from '@api/const';

interface MainLayoutProps extends BlockOwnProps {
    userAvatar?: string;
    userName?: string;
    userDisplayName?: string;
    userStatus?: string;
    chatList: Block;
    content: Block;
}

class MainLayout extends Block<MainLayoutProps> {
    private modal: Modal;

    constructor(props: MainLayoutProps) {
        let modal: Modal;

        const createChatForm = new CreateChatForm({
            onSuccess: () => {
                modal.close();
            },
        });

        modal = new Modal({
            content: createChatForm,
        });

        super({
            ...props,
            settingsIcon: new Icon({name: 'settings'}),
            addChatIcon: new Icon({name: 'chat'}),
            modal,
        });

        this.modal = modal;
        this.events = {
            click: this.handleClick.bind(this),
        };
    }

    private handleClick(e: Event): void {
        const target = (e.target as HTMLElement).closest('[data-action="create-chat"]');
        if (target) {
            e.preventDefault();
            this.modal.open();
        }
    }

    protected template = `
        <div class="app">
            <aside class="app__sidebar sidebar">
                <div class="sidebar-header">
                    <a href="/settings" class="sidebar-header__user">
                        <img src="{{userAvatar}}" alt="{{userName}}" class="avatar__image" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" onerror="this.src='${PLACEHOLDER_AVATAR_URL}'">
                        <div class="sidebar-header__user-info">
                            <span class="sidebar-header__user-display-name">{{userDisplayName}}</span>
                            <span class="sidebar-header__user-status">{{userStatus}}</span>
                        </div>
                    </a>
                    <div class="sidebar-header__actions">
                        <button class="sidebar-header__action-btn" data-action="create-chat" title="Создать чат">
                            {{{addChatIcon}}}
                        </button>
                        <a href="/settings" class="sidebar-header__action-btn" title="Настройки">
                            {{{settingsIcon}}}
                        </a>
                    </div>
                </div>
                <div class="sidebar__search">
                    <input type="text" class="sidebar__search-input" placeholder="Поиск...">
                </div>
                {{{chatList}}}
            </aside>
            <main class="app__content">
                {{{content}}}
            </main>
            {{{modal}}}
        </div>
    `;
}

export default connect<MainLayoutProps>((state: Indexed) => {
    const user = (state.user as Record<string, unknown> | null) ?? {};
    const avatarUrl = getAvatarUrl(user.avatar as string | null);
    return {
        userAvatar: String(avatarUrl),
        userName: String(user.first_name ?? ''),
        userDisplayName: String(user.display_name ?? user.first_name ?? 'Пользователь'),
        userStatus: 'онлайн',
    };
})(MainLayout);
