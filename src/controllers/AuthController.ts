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

    public signIn(login: string, password: string): boolean {
        const result = this.model.login(login, password);
        if (!result.success && result.error) {
            showError(result.error);
            return false;
        }
        return true;
    }

    public signUp(userData: RegisterFormData): boolean {
        if (!this.model.validatePasswords(userData.password, userData.password_confirm)) {
            showError('Пароли не совпадают');
            return false;
        }

        const result = this.model.register(userData);
        if (!result.success && result.error) {
            showError(result.error);
            return false;
        }
        return true;
    }

    public logout(): void {
        this.model.logout();
    }

    public isAuthenticated(): boolean {
        return this.model.isAuthenticated();
    }

    public getCurrentUser(): Record<string, unknown> | null {
        return this.model.getCurrentUser();
    }

    public updateProfile(data: ProfileFormData): boolean {
        const result = this.model.updateProfile(data);
        if (!result.success && result.error) {
            showError(result.error);
            return false;
        }
        showSuccess('Настройки сохранены');
        return true;
    }

    public updatePassword(
        oldPassword: string,
        newPassword: string,
        confirmPassword: string,
    ): boolean {
        const result = this.model.updatePassword(oldPassword, newPassword, confirmPassword);
        if (!result.success && result.error) {
            showError(result.error);
            return false;
        }
        showSuccess('Пароль успешно изменен');
        return true;
    }

    public generateDisplayName(): string {
        return this.model.generateDisplayName();
    }
}

export const authController = new AuthController(auth);
