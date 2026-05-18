export interface MockUser {
    id: number;
    login: string;
    password: string;
    email: string;
    first_name: string;
    second_name: string;
    phone: string;
    avatarUrl: string;
    display_name: string;
    status: string;
}

export const defaultUsers: MockUser[] = [
    {
        id: 999,
        login: 'test',
        password: '123456',
        email: 'test@example.com',
        first_name: 'Тест',
        second_name: 'Тестов',
        phone: '+71234567890',
        avatarUrl: 'https://placehold.co/200/0088cc/white?text=T+U',
        display_name: 'test1234',
        status: 'online',
    },
];
