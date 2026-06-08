import {Model} from '../core/Model';
import {ProfileFormData, RegisterFormData} from '../types';
import AuthAPI from '../api/AuthAPI';
import UserAPI from '../api/UserAPI';
import store from '../core/Store';

interface AuthState {
    user: Record<string, unknown> | null;
    isAuthenticated: boolean;
    [key: string]: unknown;
}

export class AuthModel extends Model<AuthState> {
    constructor() {
        super({
            user: null,
            isAuthenticated: false,
        });
    }

    public async login(login: string, password: string): Promise<boolean> {
        try {
            await AuthAPI.signIn({login, password});
            const user = await AuthAPI.getUser();
            this.setUser(user);
            return true;
        } catch (error) {
            const err = error as {response?: {reason?: string}; reason?: string};
            const message = err.response?.reason || err.reason || 'Ошибка входа';
            throw new Error(message, {cause: error});
        }
    }

    public async register(userData: RegisterFormData): Promise<boolean> {
        try {
            await AuthAPI.signUp({
                first_name: userData.first_name,
                second_name: userData.second_name,
                login: userData.login,
                email: userData.email,
                password: userData.password,
                phone: userData.phone,
            });
            const user = await AuthAPI.getUser();
            this.setUser(user);
            return true;
        } catch (error) {
            const err = error as {response?: {reason?: string}; reason?: string};
            const message = err.response?.reason || err.reason || 'Ошибка регистрации';
            throw new Error(message, {cause: error});
        }
    }

    public async logout(): Promise<void> {
        this.clearUser();
        try {
            await AuthAPI.logout();
        } catch {
            // ignore logout errors
        }
    }

    public async fetchUser(): Promise<boolean> {
        try {
            const user = await AuthAPI.getUser();
            this.setUser(user);
            return true;
        } catch {
            this.clearUser();
            return false;
        }
    }

    public validatePasswords(password: string, confirmPassword: string): boolean {
        return password === confirmPassword;
    }

    public async updateProfile(updatedData: ProfileFormData): Promise<boolean> {
        try {
            const user = await UserAPI.changeProfile(updatedData);
            this.setUser(user);
            return true;
        } catch (error) {
            const err = error as {response?: {reason?: string}; reason?: string};
            const message = err.response?.reason || err.reason || 'Ошибка обновления профиля';
            throw new Error(message, {cause: error});
        }
    }

    public async updatePassword(
        oldPassword: string,
        newPassword: string,
        confirmPassword: string,
    ): Promise<boolean> {
        if (newPassword !== confirmPassword) {
            throw new Error('Пароли не совпадают');
        }
        try {
            await UserAPI.changePassword({oldPassword, newPassword});
            return true;
        } catch (error) {
            const err = error as {response?: {reason?: string}; reason?: string};
            const message = err.response?.reason || err.reason || 'Ошибка смены пароля';
            throw new Error(message, {cause: error});
        }
    }

    public async updateAvatar(data: FormData): Promise<boolean> {
        try {
            const user = await UserAPI.changeAvatar(data);
            this.setUser(user);
            return true;
        } catch (error) {
            const err = error as {response?: {reason?: string}; reason?: string};
            const message = err.response?.reason || err.reason || 'Ошибка загрузки аватара';
            throw new Error(message, {cause: error});
        }
    }

    public generateDisplayName(): string {
        const animals = [
            'Wolf',
            'Tiger',
            'Bear',
            'Eagle',
            'Fox',
            'Lion',
            'Dragon',
            'Hawk',
            'Falcon',
            'Panther',
            'Frog',
        ];
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        const randomNumber = Math.floor(Math.random() * 1000000);
        return `${randomAnimal}${randomNumber.toString().padStart(6, '0')}`;
    }

    public getCurrentUser(): Record<string, unknown> | null {
        return (store.getState().user as Record<string, unknown> | null) ?? this.state.user;
    }

    public isAuthenticated(): boolean {
        return (store.getState().isAuthenticated as boolean) ?? this.state.isAuthenticated;
    }

    private setUser(user: unknown): void {
        const userRecord = user as Record<string, unknown>;
        this.setState({user: userRecord, isAuthenticated: true});
        store.set('user', userRecord);
        store.set('isAuthenticated', true);
    }

    private clearUser(): void {
        this.setState({user: null, isAuthenticated: false});
        store.set('user', null);
        store.set('isAuthenticated', false);
    }
}

export const auth = new AuthModel();
