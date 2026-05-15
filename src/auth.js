import {defaultUsers} from './mocks/users.js';

const AUTH_KEY = 'auth_token';
const USER_KEY = 'current_user';
const USERS_KEY = 'mock_users';

const getMockUsers = () => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [...defaultUsers];
};

const saveMockUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const auth = {
    isAuthenticated() {
        return localStorage.getItem(AUTH_KEY) !== null;
    },

    getCurrentUser() {
        const userData = localStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
    },

    login(login, password) {
        const mockUsers = getMockUsers();
        const user = mockUsers.find(u => u.login === login && u.password === password);

        if (user) {
            const {password, ...userData} = user;
            localStorage.setItem(AUTH_KEY, 'mock-token-' + Date.now());
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
            return {success: true, user: userData};
        }

        return {success: false, error: 'Неверный логин или пароль'};
    },

    register(userData) {
        const mockUsers = getMockUsers();
        const {email, login, first_name, second_name} = userData;

        const existingUser = mockUsers.find(u => u.login === login || u.email === email);
        if (existingUser) {
            return {success: false, error: 'Пользователь с таким логином или email уже существует'};
        }

        const newUser = {
            id: 999, ...userData,
            avatarUrl: `https://placehold.co/200/0088cc/white?text=${first_name[0]}+${second_name[0]}`,
            display_name: auth.generateDisplayName(userData),
            status: 'online'
        };

        mockUsers.push(newUser);
        saveMockUsers(mockUsers);

        const {password, ...userWithoutPassword} = newUser;
        localStorage.setItem(AUTH_KEY, 'mock-token-' + Date.now());
        localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));

        return {success: true, user: userWithoutPassword};
    },

    logout() {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(USER_KEY);
    },

    validatePasswords(password, confirmPassword) {
        return password === confirmPassword;
    },

    updateProfile(updatedData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return {success: false, error: 'Пользователь не авторизован'};
        }

        const mockUsers = getMockUsers();

        const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex === -1) {
            return {success: false, error: 'Пользователь не найден'};
        }

        mockUsers[userIndex] = {
            ...mockUsers[userIndex], ...updatedData
        };

        saveMockUsers(mockUsers);

        const {password, ...userWithoutPassword} = mockUsers[userIndex];
        localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));

        return {success: true, user: userWithoutPassword};
    },

    generateDisplayName(_userData) {
        const animals = ['Wolf', 'Tiger', 'Bear', 'Eagle', 'Fox', 'Lion', 'Dragon', 'Hawk', 'Falcon', 'Panther', 'Frog'];
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        const randomNumber = Math.floor(Math.random() * 1000000);
        return `${randomAnimal}${randomNumber.toString().padStart(6, '0')}`;
    }
};
