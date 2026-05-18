import {Block} from './core/Block';
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/RegisterPage';
import {SettingsContent} from './components/settings/settings-content/SettingsContent';
import {SettingsPasswordContent} from './components/settings/settings-password-content/SettingsPasswordContent';
import {SettingsAvatarContent} from './components/settings/settings-avatar-content/SettingsAvatarContent';
import {ChatInfoContent} from './components/chat/chat-info/ChatInfoContent';
import {Error404Page} from './pages/Error404Page';
import {Error500Page} from './pages/Error500Page';
import {MainLayout} from './components/layout/MainLayout';
import {ChatEmpty} from './components/chat/chat-empty/ChatEmpty';
import {ChatWindow} from './components/chat/chat-window/ChatWindow';
import {ChatHeader} from './components/chat/chat-header/ChatHeader';
import {MessageForm} from './components/form/message/MessageForm';
import {Message} from './components/chat/message/Message';
import {authController} from './controllers/AuthController';
import {chatsController} from './controllers/ChatsController';
import {prepareMessages} from './utils/messages';
import {chats} from './mocks/chats';
import {formatTime} from './helpers/formatTime';

type PageClass = new () => Block;

let appInstance: App | null = null;

export function navigateTo(url: string): void {
    appInstance?.navigateTo(url);
}

function prepareChats(chatList: typeof chats, activeId: number | null) {
    return chatList.map((chat) => {
        const lastMsg = chat.lastMessage;
        return {
            id: chat.id,
            title: chat.title,
            avatarUrl: chat.avatarUrl,
            online: chat.online,
            isActive: chat.id === activeId,
            isPinned: chat.isPinned,
            unreadCount: chat.unreadCount,
            lastMessageTime: lastMsg ? formatTime(lastMsg.time) : '',
            lastMessageText: lastMsg
                ? lastMsg.text.length > 50
                    ? lastMsg.text.slice(0, 50) + '...'
                    : lastMsg.text
                : '',
            lastMessageSender: chat.isGroup && lastMsg ? (lastMsg.senderName ?? '') : '',
        };
    });
}

function getActiveChatId(): number | null {
    const match = window.location.pathname.match(/^\/chat\/(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
}

function parseChatPath(path: string): {chatId: number; info: boolean} | null {
    const match = path.match(/^\/chat\/(\d+)$/);
    if (match) return {chatId: parseInt(match[1], 10), info: false};
    const infoMatch = path.match(/^\/chat\/(\d+)\/info$/);
    if (infoMatch) return {chatId: parseInt(infoMatch[1], 10), info: true};
    return null;
}

export class App {
    private root: HTMLElement | null;
    private currentPage: Block | null = null;

    constructor() {
        this.root = document.getElementById('root');
        appInstance = this;
    }

    public start(): void {
        this.initNavigation();
        window.addEventListener('popstate', () => this.render());
        this.render();
    }

    public render(): void {
        try {
            const path = window.location.pathname;
            const isAuthenticated = authController.isAuthenticated();

            if (!isAuthenticated) {
                if (path === '/register') {
                    this.showPage(RegisterPage);
                } else {
                    this.showPage(LoginPage);
                }
                return;
            }

            if (path === '/login' || path === '/register') {
                navigateTo('/');
                return;
            }

            const chatPath = parseChatPath(path);
            if (chatPath) {
                if (chatPath.info) {
                    this.renderChatInfo(chatPath.chatId);
                } else {
                    this.renderChat(chatPath.chatId);
                }
                return;
            }

            let contentBlock: Block;
            if (path === '/') {
                contentBlock = new ChatEmpty();
            } else if (path === '/settings') {
                contentBlock = new SettingsContent();
            } else if (path === '/settings/password') {
                contentBlock = new SettingsPasswordContent();
            } else if (path === '/settings/avatar') {
                contentBlock = new SettingsAvatarContent();
            } else {
                this.showPage(Error404Page);
                return;
            }

            this.showMainLayout(contentBlock);
        } catch (error) {
            console.error('Error rendering app:', error);
            this.showPage(Error500Page);
        }
    }

    public navigateTo(url: string): void {
        window.history.pushState({}, '', url);
        this.render();
    }

    private renderChat(chatId: number): void {
        const chat = chatsController.getChatById(chatId);
        if (!chat) {
            navigateTo('/');
            return;
        }

        const currentUser = authController.getCurrentUser();
        const currentUserId =
            currentUser && typeof currentUser.id === 'number' ? currentUser.id : 999;

        const preparedMessages = prepareMessages(chat.messages, chat, currentUserId);
        const messageBlocks = preparedMessages.map(
            (msg) =>
                new Message({
                    text: msg.text,
                    time: msg.time,
                    isOutgoing: msg.isOutgoing,
                    isRead: msg.isRead,
                    senderName: msg.senderName,
                    senderAvatar: msg.senderAvatar,
                    showDate: msg.showDate,
                    dateLabel: msg.dateLabel,
                }),
        );

        const messageInput = new MessageForm({
            onSend: (text: string) => {
                chatsController.sendMessage(chatId, text);
                this.render();
            },
        });

        const chatWindow = new ChatWindow({
            chat: chat as unknown as Record<string, unknown>,
            header: new ChatHeader({chat: chat as unknown as Record<string, unknown>}),
            messages: messageBlocks,
            input: messageInput,
        });

        this.showMainLayout(chatWindow);
    }

    private renderChatInfo(chatId: number): void {
        const chat = chatsController.getChatById(chatId);
        if (!chat) {
            navigateTo('/');
            return;
        }

        const members = chat.members ? Object.values(chat.members) : undefined;

        const chatInfoContent = new ChatInfoContent({
            chat: chat as unknown as Record<string, unknown>,
            members,
        });

        this.showMainLayout(chatInfoContent);
    }

    private showPage(PageClass: PageClass): void {
        if (this.currentPage) {
            this.currentPage.destroy();
        }
        if (!this.root) return;
        this.root.innerHTML = '';
        const page = new PageClass();
        this.currentPage = page;
        const content = page.getContent();
        if (content) {
            this.root.appendChild(content);
            page.dispatchComponentDidMount();
        }
    }

    private showMainLayout(content: Block): void {
        if (this.currentPage) {
            this.currentPage.destroy();
        }
        if (!this.root) return;

        const user = authController.getCurrentUser() ?? {};
        const activeChatId = getActiveChatId();

        const layout = new MainLayout({
            userAvatar: String(user.avatarUrl ?? 'https://placehold.co/200/0088cc/white?text=?'),
            userName: String(user.first_name ?? ''),
            userDisplayName: String(user.display_name ?? user.first_name ?? 'Пользователь'),
            userStatus: String(user.status ?? 'онлайн'),
            chats: prepareChats(chats, activeChatId),
            content,
        });

        this.currentPage = layout;
        const layoutElement = layout.getContent();
        if (layoutElement) {
            this.root.innerHTML = '';
            this.root.appendChild(layoutElement);
            layout.dispatchComponentDidMount();
        }
    }

    private initNavigation(): void {
        document.addEventListener('click', (e) => {
            const link = (e.target as HTMLElement).closest('a');
            if (link) {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('http') || href.startsWith('#')) return;
                e.preventDefault();
                this.navigateTo(href);
            }

            const btn = (e.target as HTMLElement).closest('[data-navigate]');
            if (btn) {
                e.preventDefault();
                const url = btn.getAttribute('data-navigate');
                if (url) {
                    this.navigateTo(url);
                }
            }
        });
    }
}

export const app = new App();
