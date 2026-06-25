import HTTPTransport from '@/core/HTTPTransport';
import {BaseAPI} from './BaseAPI';
import {
    AddUsersToChatRequest,
    ChatResponse,
    ChatTokenResponse,
    CreateChatRequest,
    DeleteUsersFromChatRequest,
    UserResponse,
} from './types';

const chatsAPI = new HTTPTransport('/chats');

class ChatsAPI extends BaseAPI {
    public getChats(): Promise<ChatResponse[]> {
        return chatsAPI.get('/');
    }

    public createChat(data: CreateChatRequest): Promise<{id: number}> {
        return chatsAPI.post('/', {data});
    }

    public deleteChat(chatId: number): Promise<void> {
        return chatsAPI.delete('/', {data: {chatId}});
    }

    public getChatUsers(chatId: number): Promise<UserResponse[]> {
        return chatsAPI.get(`/${chatId}/users`);
    }

    public addUsersToChat(data: AddUsersToChatRequest): Promise<void> {
        return chatsAPI.put('/users', {data});
    }

    public deleteUsersFromChat(data: DeleteUsersFromChatRequest): Promise<void> {
        return chatsAPI.delete('/users', {data});
    }

    public updateChatAvatar(data: FormData): Promise<ChatResponse> {
        return chatsAPI.put('/avatar', {data});
    }

    public getToken(chatId: number): Promise<ChatTokenResponse> {
        return chatsAPI.post(`/token/${chatId}`);
    }
}

export default new ChatsAPI();
