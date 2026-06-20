import {describe, it, expect, vi} from 'vitest';
import {getAvatarUrl, parseChatPath, getActiveChatId, prepareChats} from './chats';

vi.mock('../models/ChatsModel', () => ({
    chatsModel: {
        getChatById: vi.fn(),
        getChats: vi.fn(() => []),
    },
}));

describe('chats utils', () => {
    describe('getAvatarUrl', () => {
        it('should return full URL for avatar', () => {
            const result = getAvatarUrl('/avatar.jpg');
            expect(result).toContain('/resources/avatar.jpg');
        });

        it('should return placeholder for null', () => {
            const result = getAvatarUrl(null);
            expect(result).not.toContain('/resources/');
            expect(result.length).toBeGreaterThan(0);
        });
    });

    describe('parseChatPath', () => {
        it('should parse chat path', () => {
            expect(parseChatPath('/chat/123')).toEqual({chatId: 123, info: false});
        });

        it('should parse chat info path', () => {
            expect(parseChatPath('/chat/123/info')).toEqual({chatId: 123, info: true});
        });

        it('should return null for invalid path', () => {
            expect(parseChatPath('/messenger')).toBeNull();
        });
    });

    describe('getActiveChatId', () => {
        it('should extract chat id from window location', () => {
            Object.defineProperty(window, 'location', {
                value: {pathname: '/chat/42'},
                writable: true,
            });
            expect(getActiveChatId()).toBe(42);
        });

        it('should return null for non-chat path', () => {
            Object.defineProperty(window, 'location', {
                value: {pathname: '/messenger'},
                writable: true,
            });
            expect(getActiveChatId()).toBeNull();
        });
    });

    describe('prepareChats', () => {
        it('should prepare chats with defaults', () => {
            const chatList = [
                {
                    id: 1,
                    title: 'Test',
                    avatar: null,
                    unread_count: 2,
                    last_message: null,
                },
            ] as any;

            const result = prepareChats(chatList, 1);
            expect(result[0].isActive).toBe(true);
            expect(result[0].unreadCount).toBe(2);
        });
    });
});
