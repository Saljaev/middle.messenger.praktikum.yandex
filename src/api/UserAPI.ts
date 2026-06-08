import HTTPTransport from '@/core/HTTPTransport';
import {BaseAPI} from './BaseAPI';
import {ChangePasswordRequest, UserResponse} from './types';
import {ProfileFormData} from '@/types';

const userAPI = new HTTPTransport('https://ya-praktikum.tech/api/v2/user');

class UserAPI extends BaseAPI {
    public changeProfile(data: ProfileFormData): Promise<UserResponse> {
        return userAPI.put<ProfileFormData, UserResponse>('/profile', data);
    }

    public changeAvatar(data: FormData): Promise<UserResponse> {
        return userAPI.put<FormData, UserResponse>('/profile/avatar', data);
    }

    public changePassword(data: ChangePasswordRequest): Promise<void> {
        return userAPI.put<ChangePasswordRequest, void>('/password', data);
    }

    public searchUser(login: string): Promise<UserResponse[]> {
        return userAPI.post<{login: string}, UserResponse[]>('/search', {login});
    }
}

export default new UserAPI();
