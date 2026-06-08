import HTTPTransport from '@/core/HTTPTransport';
import {BaseAPI} from './BaseAPI';
import {
    AddUsersToChatRequest,
    ChatResponse,
    CreateChatRequest,
    DeleteUsersFromChatRequest,
    UserResponse,
} from './types';

const chatsAPI = new HTTPTransport('https://ya-praktikum.tech/api/v2/chats');

class ChatsAPI extends BaseAPI {
    public getChats(): Promise<ChatResponse[]> {
        return chatsAPI.get<ChatResponse[]>('/');
    }

    public createChat(data: CreateChatRequest): Promise<{id: number}> {
        return chatsAPI.post<CreateChatRequest, {id: number}>('/', data);
    }

    public deleteChat(chatId: number): Promise<void> {
        return chatsAPI.delete<void>('/', {data: {chatId}});
    }

    public getChatUsers(chatId: number): Promise<UserResponse[]> {
        return chatsAPI.get<UserResponse[]>(`/${chatId}/users`);
    }

    public addUsersToChat(data: AddUsersToChatRequest): Promise<void> {
        return chatsAPI.put<AddUsersToChatRequest, void>('/users', data);
    }

    public deleteUsersFromChat(data: DeleteUsersFromChatRequest): Promise<void> {
        return chatsAPI.delete<void>('/users', {data});
    }
}

export default new ChatsAPI();
