import HTTPTransport from '@/core/HTTPTransport';
import {BaseAPI} from './BaseAPI';
import {SignInRequest, SignUpRequest, SignUpResponse, UserResponse} from './types';

const authAPI = new HTTPTransport('https://ya-praktikum.tech/api/v2/auth');

class AuthAPI extends BaseAPI {
    public signIn(data: SignInRequest): Promise<void> {
        return authAPI.post<SignInRequest, void>('/signin', data);
    }

    public signUp(data: SignUpRequest): Promise<SignUpResponse> {
        return authAPI.post<SignUpRequest, SignUpResponse>('/signup', data);
    }

    public logout(): Promise<void> {
        return authAPI.post<void, void>('/logout');
    }

    public getUser(): Promise<UserResponse> {
        return authAPI.get<UserResponse>('/user');
    }
}

export default new AuthAPI();
