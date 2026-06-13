import HTTPTransport from '@/core/HTTPTransport';
import {BaseAPI} from './BaseAPI';
import {SignInRequest, SignUpRequest, SignUpResponse, UserResponse} from './types';

const authAPI = new HTTPTransport('/auth');

class AuthAPI extends BaseAPI {
    public signIn(data: SignInRequest): Promise<void> {
        return authAPI.post('/signin', {data});
    }

    public signUp(data: SignUpRequest): Promise<SignUpResponse> {
        return authAPI.post('/signup', {data});
    }

    public logout(): Promise<void> {
        return authAPI.post('/logout');
    }

    public getUser(): Promise<UserResponse> {
        return authAPI.get('/user');
    }
}

export default new AuthAPI();
