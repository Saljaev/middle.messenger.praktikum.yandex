import {Controller} from '../core/Controller';
import {Block} from '../core/Block';
import {ChatsModel, chatsModel} from '../models/ChatsModel';
import {showError} from '../utils/notifications';
import {UserResponse} from '../api/types';

export class ChatsController extends Controller<ChatsModel, Block> {
    constructor(model: ChatsModel) {
        super(model);
    }

    public async init(): Promise<void> {
        try {
            await this.model.fetchChats();
        } catch {
            // ignore initial fetch errors
        }
    }

    public async getChats() {
        try {
            await this.model.fetchChats();
            return this.model.getChats();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка загрузки чатов';
            showError(message);
            return [];
        }
    }

    public getChatById(id: number) {
        return this.model.getChatById(id);
    }

    public async getChatUsers(chatId: number): Promise<UserResponse[]> {
        try {
            return await this.model.getChatUsers(chatId);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка загрузки участников';
            showError(message);
            return [];
        }
    }

    public selectChat(id: number | null): void {
        this.model.setActiveChat(id);
    }

    public async createChat(title: string): Promise<boolean> {
        try {
            await this.model.createChat(title);
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка создания чата';
            showError(message);
            return false;
        }
    }

    public async deleteChat(chatId: number): Promise<boolean> {
        try {
            await this.model.deleteChat(chatId);
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка удаления чата';
            showError(message);
            return false;
        }
    }

    public async addUserToChat(chatId: number, userId: number): Promise<boolean> {
        try {
            await this.model.addUserToChat(chatId, userId);
            return true;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Ошибка добавления пользователя';
            showError(message);
            return false;
        }
    }

    public async addUsersToChat(chatId: number, userIds: number[]): Promise<boolean> {
        try {
            await this.model.addUsersToChat(chatId, userIds);
            return true;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Ошибка добавления пользователей';
            showError(message);
            return false;
        }
    }

    public async deleteUserFromChat(chatId: number, userId: number): Promise<boolean> {
        try {
            await this.model.deleteUserFromChat(chatId, userId);
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка удаления пользователя';
            showError(message);
            return false;
        }
    }

    public async updateChatAvatar(chatId: number, file: File): Promise<boolean> {
        try {
            await this.model.updateChatAvatar(chatId, file);
            return true;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Ошибка обновления аватара чата';
            showError(message);
            return false;
        }
    }

    public sendMessage(_chatId: number, _text: string): void {
        // WebSocket will be implemented in the next sprint
    }
}

export const chatsController = new ChatsController(chatsModel);
