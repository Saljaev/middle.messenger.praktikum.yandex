import {Model} from '../core/Model';
import {defaultUsers} from '../mocks/users';
import {ProfileFormData, RegisterFormData} from '../types';

interface AuthState {
    user: Record<string, unknown> | null;
    isAuthenticated: boolean;
    [key: string]: unknown;
}

interface AuthResult {
    success: boolean;
    user?: Record<string, unknown>;
    error?: string;
}

const AUTH_KEY = 'auth_token';
const USER_KEY = 'current_user';
const USERS_KEY = 'mock_users';

type MockUserRecord = Record<string, unknown>;

function getMockUsers(): MockUserRecord[] {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [...(defaultUsers as unknown as MockUserRecord[])];
}

function saveMockUsers(users: MockUserRecord[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export class AuthModel extends Model<AuthState> {
    constructor() {
        const userData = localStorage.getItem(USER_KEY);
        const isAuth = localStorage.getItem(AUTH_KEY) !== null;
        super({
            user: userData ? JSON.parse(userData) : null,
            isAuthenticated: isAuth,
        });
    }

    login(login: string, password: string): AuthResult {
        const mockUsers = getMockUsers();
        const user = mockUsers.find((u) => u.login === login && u.password === password);

        if (user) {
            const userData = {...user};
            delete userData['password'];
            localStorage.setItem(AUTH_KEY, 'mock-token-' + Date.now());
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
            this.setState({user: userData, isAuthenticated: true});
            return {success: true, user: userData};
        }

        return {success: false, error: 'Неверный логин или пароль'};
    }

    register(userData: RegisterFormData): AuthResult {
        const mockUsers = getMockUsers();
        const email = String(userData.email);
        const login = String(userData.login);
        const first_name = String(userData.first_name);
        const second_name = String(userData.second_name);

        const existingUser = mockUsers.find((u) => u.login === login || u.email === email);
        if (existingUser) {
            return {
                success: false,
                error: 'Пользователь с таким логином или email уже существует',
            };
        }

        const newUser: Record<string, unknown> = {
            id: 999,
            ...userData,
            avatarUrl: `https://placehold.co/200/0088cc/white?text=${first_name[0]}+${second_name[0]}`,
            display_name: this.generateDisplayName(),
            status: 'online',
        };

        mockUsers.push(newUser);
        saveMockUsers(mockUsers);

        const userWithoutPassword = {...newUser};
        delete userWithoutPassword['password'];
        localStorage.setItem(AUTH_KEY, 'mock-token-' + Date.now());
        localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
        this.setState({user: userWithoutPassword, isAuthenticated: true});

        return {success: true, user: userWithoutPassword};
    }

    logout(): void {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(USER_KEY);
        this.setState({user: null, isAuthenticated: false});
    }

    validatePasswords(password: string, confirmPassword: string): boolean {
        return password === confirmPassword;
    }

    updateProfile(updatedData: ProfileFormData): AuthResult {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return {success: false, error: 'Пользователь не авторизован'};
        }

        const mockUsers = getMockUsers();
        const userIndex = mockUsers.findIndex((u) => u.id === currentUser.id);
        if (userIndex === -1) {
            return {success: false, error: 'Пользователь не найден'};
        }

        mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            ...updatedData,
        };
        saveMockUsers(mockUsers);

        const {password: _pwd, ...userWithoutPassword} = mockUsers[userIndex];
        localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
        this.setState({user: userWithoutPassword});

        const sidebarName = document.querySelector('.sidebar-header__user-display-name');
        if (sidebarName && sidebarName.textContent !== updatedData.display_name) {
            sidebarName.textContent = updatedData.display_name;
        }

        return {success: true, user: userWithoutPassword};
    }

    updatePassword(_oldPassword: string, newPassword: string, confirmPassword: string): AuthResult {
        if (newPassword !== confirmPassword) {
            return {success: false, error: 'Пароли не совпадают'};
        }
        if (newPassword.length < 6) {
            return {success: false, error: 'Пароль должен содержать минимум 6 символов'};
        }
        return {success: true};
    }

    generateDisplayName(): string {
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

    getCurrentUser(): Record<string, unknown> | null {
        return this.state.user;
    }

    isAuthenticated(): boolean {
        return this.state.isAuthenticated;
    }
}

export const auth = new AuthModel();
