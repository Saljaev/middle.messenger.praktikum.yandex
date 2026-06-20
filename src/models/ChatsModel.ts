import {Model} from '../core/Model';
import ChatsAPI from '../api/ChatsAPI';
import store from '../core/Store';
import {ChatResponse, UserResponse, WSMessage} from '../api/types';

interface ChatsState {
    chats: ChatResponse[];
    activeChatId: number | null;
    messages: Record<number, WSMessage[]>;
    chatUsers: Record<number, UserResponse[]>;
    [key: string]: unknown;
}

export class ChatsModel extends Model<ChatsState> {
    constructor() {
        super({
            chats: [],
            activeChatId: null,
            messages: {},
            chatUsers: {},
        });
    }

    public async fetchChats(): Promise<void> {
        try {
            const chats = await ChatsAPI.getChats();
            this.setState({chats});
            store.set('chats', chats);
        } catch (error) {
            const err = error as {response?: {reason?: string}; reason?: string};
            const message = err.response?.reason || err.reason || 'Ошибка загрузки чатов';
            throw new Error(message, {cause: error});
        }
    }

    public getChats(): ChatResponse[] {
        return (store.getState().chats as ChatResponse[]) ?? this.state.chats;
    }

    public getChatById(id: number): ChatResponse | undefined {
        return this.getChats().find((c) => c.id === id);
    }

    public setActiveChat(id: number | null): void {
        this.setState({activeChatId: id});
        store.set('activeChatId', id);
    }

    public getActiveChatId(): number | null {
        return (store.getState().activeChatId as number | null) ?? this.state.activeChatId;
    }

    public getMessages(chatId: number): WSMessage[] {
        return (store.getState().messages as Record<number, WSMessage[]>)?.[chatId] ?? [];
    }

    public setMessages(chatId: number, messages: WSMessage[]): void {
        const current = (store.getState().messages as Record<number, WSMessage[]>) ?? {};
        const updated = {...current, [chatId]: messages};
        this.setState({messages: updated});
        store.set('messages', updated);
    }

    public addMessages(chatId: number, messages: WSMessage[]): void {
        const current = this.getMessages(chatId);
        const updated = [...current, ...messages];
        this.setMessages(chatId, updated);
    }

    public addMessage(chatId: number, message: WSMessage): void {
        const current = this.getMessages(chatId);
        const updated = [message, ...current];
        this.setMessages(chatId, updated);
    }

    public updateChatLastMessage(chatId: number, message: WSMessage, user?: UserResponse): void {
        const chats = this.getChats();
        const index = chats.findIndex((c) => c.id === chatId);
        if (index === -1) {
            return;
        }

        const chat = chats[index];
        const prevUser = chat.last_message?.user;
        const prevUserId = prevUser ? Number(prevUser.id) : null;
        const msgUserId = Number(message.user_id);

        let lastMessageUser: UserResponse;
        if (user) {
            lastMessageUser = user;
        } else if (prevUser && prevUserId === msgUserId) {
            lastMessageUser = prevUser;
        } else {
            lastMessageUser = {
                id: msgUserId,
                first_name: '',
                second_name: '',
                display_name: null,
                login: '',
                email: '',
                phone: '',
                avatar: null,
            };
        }

        const updatedChats = [...chats];
        updatedChats[index] = {
            ...chat,
            last_message: {
                user: lastMessageUser,
                time: message.time,
                content: message.content,
            },
        };
        this.setState({chats: updatedChats});
        store.set('chats', updatedChats);
    }

    public resetUnreadCount(chatId: number): void {
        const chats = this.getChats();
        const index = chats.findIndex((c) => c.id === chatId);
        if (index === -1) {
            return;
        }

        const chat = chats[index];
        if (chat.unread_count === 0) {
            return;
        }

        const updatedChats = [...chats];
        updatedChats[index] = {...chat, unread_count: 0};
        this.setState({chats: updatedChats});
        store.set('chats', updatedChats);
    }

    public setChatUsers(chatId: number, users: UserResponse[]): void {
        const current = (store.getState().chatUsers as Record<number, UserResponse[]>) ?? {};
        const updated = {...current, [chatId]: users};
        this.setState({chatUsers: updated});
        store.set('chatUsers', updated);
    }

    public getChatUsers(chatId: number): UserResponse[] {
        return (store.getState().chatUsers as Record<number, UserResponse[]>)?.[chatId] ?? [];
    }

    public clearMessages(chatId: number): void {
        const current = (store.getState().messages as Record<number, WSMessage[]>) ?? {};
        const updated = {...current};
        delete updated[chatId];
        this.setState({messages: updated});
        store.set('messages', updated);
    }

    public async createChat(title: string): Promise<void> {
        try {
            await ChatsAPI.createChat({title});
            await this.fetchChats();
        } catch (error) {
            const err = error as {response?: {reason?: string}; reason?: string};
            const message = err.response?.reason || err.reason || 'Ошибка создания чата';
            throw new Error(message, {cause: error});
        }
    }

    public async deleteChat(chatId: number): Promise<void> {
        try {
            await ChatsAPI.deleteChat(chatId);
            await this.fetchChats();
        } catch (error) {
            const err = error as {response?: {reason?: string}; reason?: string};
            const message = err.response?.reason || err.reason || 'Ошибка удаления чата';
            throw new Error(message, {cause: error});
        }
    }

    public async fetchChatUsers(chatId: number): Promise<UserResponse[]> {
        try {
            return await ChatsAPI.getChatUsers(chatId);
        } catch (error) {
            const err = error as {response?: {reason?: string}; reason?: string};
            const message = err.response?.reason || err.reason || 'Ошибка загрузки участников';
            throw new Error(message, {cause: error});
        }
    }

    public async addUserToChat(chatId: number, userId: number): Promise<void> {
        try {
            await ChatsAPI.addUsersToChat({users: [userId], chatId});
        } catch (error) {
            const err = error as {response?: {reason?: string}; reason?: string};
            const message = err.response?.reason || err.reason || 'Ошибка добавления пользователя';
            throw new Error(message, {cause: error});
        }
    }

    public async addUsersToChat(chatId: number, userIds: number[]): Promise<void> {
        try {
            await ChatsAPI.addUsersToChat({users: userIds, chatId});
        } catch (error) {
            const err = error as {response?: {reason?: string}; reason?: string};
            const message = err.response?.reason || err.reason || 'Ошибка добавления пользователей';
            throw new Error(message, {cause: error});
        }
    }

    public async deleteUserFromChat(chatId: number, userId: number): Promise<void> {
        try {
            await ChatsAPI.deleteUsersFromChat({users: [userId], chatId});
        } catch (error) {
            const err = error as {response?: {reason?: string}; reason?: string};
            const message = err.response?.reason || err.reason || 'Ошибка удаления пользователя';
            throw new Error(message, {cause: error});
        }
    }

    public async updateChatAvatar(chatId: number, file: File): Promise<void> {
        const formData = new FormData();
        formData.append('chatId', String(chatId));
        formData.append('avatar', file);
        try {
            await ChatsAPI.updateChatAvatar(formData);
            await this.fetchChats();
        } catch (error) {
            const err = error as {response?: {reason?: string}; reason?: string};
            const message = err.response?.reason || err.reason || 'Ошибка обновления аватара чата';
            throw new Error(message, {cause: error});
        }
    }
}

export const chatsModel = new ChatsModel();
