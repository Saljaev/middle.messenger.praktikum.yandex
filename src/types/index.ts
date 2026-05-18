export interface User {
    id: number;
    login: string;
    email: string;
    first_name: string;
    second_name: string;
    display_name?: string;
    phone: string;
    avatar?: string;
}

export interface Chat {
    id: number;
    title: string;
    avatar?: string;
    unread_count: number;
    last_message?: Message;
    created_by?: number;
}

export interface Message {
    id: number;
    chat_id: number;
    user: User;
    content: string;
    time: string;
    is_read: boolean;
}

export interface LoginFormData {
    login: string;
    password: string;
}

export interface RegisterFormData {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    phone: string;
    password: string;
    password_confirm: string;
}

export interface ProfileFormData {
    first_name: string;
    second_name: string;
    display_name: string;
    login: string;
    email: string;
    phone: string;
}

export interface PasswordFormData {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
}
