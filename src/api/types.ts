export interface SignInRequest {
    login: string;
    password: string;
}

export interface SignUpRequest {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
}

export interface SignUpResponse {
    id: number;
}

export interface UserResponse {
    id: number;
    first_name: string;
    second_name: string;
    display_name: string | null;
    login: string;
    email: string;
    phone: string;
    avatar: string | null;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface ChatResponse {
    id: number;
    title: string;
    avatar: string | null;
    created_by: number;
    unread_count: number;
    last_message: {
        user: UserResponse;
        time: string;
        content: string;
    } | null;
}

export interface CreateChatRequest {
    title: string;
}

export interface AddUsersToChatRequest {
    users: number[];
    chatId: number;
}

export interface DeleteUsersFromChatRequest {
    users: number[];
    chatId: number;
}

export interface APIError {
    reason: string;
}
