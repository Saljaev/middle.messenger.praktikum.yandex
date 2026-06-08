import {Model} from '../core/Model';
import ChatsAPI from '../api/ChatsAPI';
import store from '../core/Store';
import {ChatResponse, UserResponse} from '../api/types';

interface ChatsState {
    chats: ChatResponse[];
    activeChatId: number | null;
    [key: string]: unknown;
}

export class ChatsModel extends Model<ChatsState> {
    constructor() {
        super({
            chats: [],
            activeChatId: null,
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

    public async getChatUsers(chatId: number): Promise<UserResponse[]> {
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
}

export const chatsModel = new ChatsModel();
