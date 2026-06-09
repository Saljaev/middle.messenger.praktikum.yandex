import {ChatResponse} from '../api/types';
import {chatsModel} from '../models/ChatsModel';
import {formatTime} from '../helpers/formatTime';
import {API_BASE_URL, PLACEHOLDER_AVATAR_URL} from '@api/const';

export const getAvatarUrl = (avatar: string | null): string =>
    avatar ? `${API_BASE_URL}/resources${avatar}` : PLACEHOLDER_AVATAR_URL;

export interface PreparedChat {
    id: number;
    title: string;
    avatarUrl: string;
    online?: boolean;
    isActive: boolean;
    isPinned?: boolean;
    unreadCount?: number;
    lastMessageTime: string;
    lastMessageText: string;
    lastMessageSender: string;
}

export function prepareChats(chatList: ChatResponse[], activeId: number | null): PreparedChat[] {
    return chatList.map((chat) => {
        const lastMsg = chat.last_message;
        const avatarUrl = getAvatarUrl(chat.avatar);
        const title = chat.title || '';
        const unreadCount = chat.unread_count ?? 0;

        let lastMsgText = '';
        if (lastMsg) {
            const msg = lastMsg as Record<string, unknown>;
            lastMsgText = String(msg.text ?? msg.content ?? '');
        }
        const lastMessageText =
            lastMsgText.length > 50 ? lastMsgText.slice(0, 50) + '...' : lastMsgText;

        const user = lastMsg ? (lastMsg as Record<string, unknown>).user : null;
        const lastMessageSender = user
            ? `${(user as Record<string, unknown>).first_name ?? ''} ${(user as Record<string, unknown>).second_name ?? ''}`
            : '';

        return {
            id: chat.id,
            title,
            avatarUrl,
            isActive: chat.id === activeId,
            unreadCount,
            lastMessageTime: lastMsg
                ? formatTime(String((lastMsg as Record<string, unknown>).time))
                : '',
            lastMessageText,
            lastMessageSender,
        };
    });
}

export function getActiveChatId(): number | null {
    const match = window.location.pathname.match(/^\/chat\/(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
}

export function parseChatPath(path: string): {chatId: number; info: boolean} | null {
    const match = path.match(/^\/chat\/(\d+)$/);
    if (match) return {chatId: parseInt(match[1], 10), info: false};
    const infoMatch = path.match(/^\/chat\/(\d+)\/info$/);
    if (infoMatch) return {chatId: parseInt(infoMatch[1], 10), info: true};
    return null;
}

export function getApiChatById(id: number): ChatResponse | undefined {
    return chatsModel.getChatById(id);
}

export function getApiChats(): ChatResponse[] {
    return chatsModel.getChats();
}
