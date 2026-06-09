import HTTPTransport from '@/core/HTTPTransport';
import {BaseAPI} from './BaseAPI';
import {ChangePasswordRequest, UserResponse} from './types';
import {ProfileFormData} from '@/types';

const userAPI = new HTTPTransport('/user');

class UserAPI extends BaseAPI {
    public changeProfile(data: ProfileFormData): Promise<UserResponse> {
        return userAPI.put('/profile', {data});
    }

    public changeAvatar(data: FormData): Promise<UserResponse> {
        return userAPI.put('/profile/avatar', {data});
    }

    public changePassword(data: ChangePasswordRequest): Promise<void> {
        return userAPI.put('/password', {data});
    }

    public searchUser(login: string): Promise<UserResponse[]> {
        return userAPI.post('/search', {data: {login}});
    }
}

export default new UserAPI();
