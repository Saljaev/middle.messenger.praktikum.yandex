import {Controller} from '../core/Controller';
import {Block} from '../core/Block';
import {AuthModel, auth} from '../models/AuthModel';
import {showError, showSuccess} from '../utils/notifications';
import {ProfileFormData, RegisterFormData} from '../types';

export class AuthController extends Controller<AuthModel, Block> {
    constructor(model: AuthModel) {
        super(model);
    }

    public init(): void {}

    public async signIn(login: string, password: string): Promise<boolean> {
        try {
            await this.model.login(login, password);
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка входа';
            showError(message);
            return false;
        }
    }

    public async signUp(userData: RegisterFormData): Promise<boolean> {
        if (!this.model.validatePasswords(userData.password, userData.password_confirm)) {
            showError('Пароли не совпадают');
            return false;
        }

        try {
            await this.model.register(userData);
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка регистрации';
            showError(message);
            return false;
        }
    }

    public async logout(): Promise<void> {
        await this.model.logout();
    }

    public isAuthenticated(): boolean {
        return this.model.isAuthenticated();
    }

    public getCurrentUser(): Record<string, unknown> | null {
        return this.model.getCurrentUser();
    }

    public async updateProfile(data: ProfileFormData): Promise<boolean> {
        try {
            await this.model.updateProfile(data);
            showSuccess('Настройки сохранены');
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка обновления профиля';
            showError(message);
            return false;
        }
    }

    public async updatePassword(
        oldPassword: string,
        newPassword: string,
        confirmPassword: string,
    ): Promise<boolean> {
        try {
            await this.model.updatePassword(oldPassword, newPassword, confirmPassword);
            showSuccess('Пароль успешно изменен');
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка смены пароля';
            showError(message);
            return false;
        }
    }

    public async updateAvatar(data: FormData): Promise<boolean> {
        try {
            await this.model.updateAvatar(data);
            showSuccess('Аватар успешно загружен');
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка загрузки аватара';
            showError(message);
            return false;
        }
    }

    public generateDisplayName(): string {
        return this.model.generateDisplayName();
    }

    public async fetchUser(): Promise<boolean> {
        try {
            return await this.model.fetchUser();
        } catch {
            return false;
        }
    }
}

export const authController = new AuthController(auth);
