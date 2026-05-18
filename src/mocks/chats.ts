export interface MockMessage {
    id?: number;
    senderId: number;
    senderName?: string;
    text: string;
    time: string;
    isRead: boolean;
}

export interface MockChat {
    id: number;
    title: string;
    avatarUrl: string;
    online?: boolean;
    status?: string;
    unreadCount?: number;
    isPinned?: boolean;
    isGroup?: boolean;
    membersCount?: number;
    members?: Record<number, {name: string; avatarUrl: string}>;
    lastMessage?: MockMessage;
    messages: MockMessage[];
}

export const chats: MockChat[] = [
    {
        id: 1,
        title: 'Алиса',
        avatarUrl: 'https://placehold.co/200/007bff/white?text=A',
        online: true,
        status: 'онлайн',
        unreadCount: 1,
        isPinned: true,
        lastMessage: {
            senderId: 1,
            senderName: 'Алиса',
            text: 'Привет! Как дела? Что нового?',
            time: new Date(Date.now() - 5 * 60000).toISOString(),
            isRead: false,
        },
        messages: [
            {
                id: 1,
                senderId: 1,
                text: 'Привет! Как дела?',
                time: new Date(Date.now() - 60 * 60000).toISOString(),
                isRead: true,
            },
            {
                id: 2,
                senderId: 999,
                text: 'Привет! Все отлично, спасибо! А у тебя?',
                time: new Date(Date.now() - 45 * 60000).toISOString(),
                isRead: true,
            },
            {
                id: 3,
                senderId: 1,
                text: 'Привет! Как дела? Что нового?',
                time: new Date(Date.now() - 5 * 60000).toISOString(),
                isRead: false,
            },
        ],
    },
    {
        id: 2,
        title: 'Команда проекта',
        avatarUrl: 'https://placehold.co/200/28a745/white?text=Team',
        online: false,
        status: '3 участников',
        isGroup: true,
        membersCount: 3,
        members: {
            1: {name: 'Алиса', avatarUrl: 'https://placehold.co/200/ff6b6b/white?text=A'},
            2: {name: 'Боб', avatarUrl: 'https://placehold.co/200/4ecdc4/white?text=B'},
            3: {name: 'Катя', avatarUrl: 'https://placehold.co/200/a8e6cf/white?text=K'},
        },
        unreadCount: 2,
        lastMessage: {
            id: 2,
            senderId: 1,
            senderName: 'Алиса',
            text: 'Привет, на нашей стороне - в процессе',
            time: new Date(Date.now() - 170 * 60000).toISOString(),
            isRead: false,
        },
        messages: [
            {
                id: 1,
                senderId: 3,
                senderName: 'Катя',
                text: 'Всем привет, какой статус по проекту?',
                time: new Date(Date.now() - 180 * 60000).toISOString(),
                isRead: false,
            },
            {
                id: 2,
                senderId: 1,
                senderName: 'Алиса',
                text: 'Привет, на нашей стороне - в процессе',
                time: new Date(Date.now() - 170 * 60000).toISOString(),
                isRead: false,
            },
        ],
    },
    {
        id: 3,
        title: 'Максим',
        avatarUrl: 'https://placehold.co/200/dc3545/white?text=M+A',
        online: false,
        status: 'был 2 часа назад',
        lastMessage: {
            senderId: 999,
            text: 'Договорились, до встречи!',
            time: new Date(Date.now() - 48 * 60 * 60000).toISOString(),
            isRead: true,
        },
        messages: [
            {
                senderId: 999,
                text: 'Договорились, до встречи!',
                time: new Date(Date.now() - 48 * 60 * 60000).toISOString(),
                isRead: true,
            },
            {
                senderId: 999,
                text: 'Привет, всё в силе?',
                time: new Date(Date.now() - 24 * 48 * 40000).toISOString(),
                isRead: false,
            },
        ],
    },
];
