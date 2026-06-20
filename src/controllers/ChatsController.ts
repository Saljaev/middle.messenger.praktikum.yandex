import {Controller} from '../core/Controller';
import {Block} from '../core/Block';
import {ChatsModel, chatsModel} from '../models/ChatsModel';
import {showError} from '../utils/notifications';
import {UserResponse, WSMessage} from '../api/types';

function toUserResponse(user: Record<string, unknown> | null): UserResponse | undefined {
    if (!user) return undefined;
    return user as unknown as UserResponse;
}
import {WSTransport} from '../core/WSTransport';
import ChatsAPI from '../api/ChatsAPI';
import {WS_BASE_URL} from '../api/const';
import {authController} from './AuthController';

export class ChatsController extends Controller<ChatsModel, Block> {
    private _wsTransport: WSTransport | null = null;

    constructor(model: ChatsModel) {
        super(model);
    }

    public async init(): Promise<void> {
        try {
            await this.model.fetchChats();
        } catch {
            // ignore initial fetch errors
        }
    }

    public async getChats() {
        try {
            await this.model.fetchChats();
            return this.model.getChats();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка загрузки чатов';
            showError(message);
            return [];
        }
    }

    public getChatById(id: number) {
        return this.model.getChatById(id);
    }

    public async getChatUsers(chatId: number): Promise<UserResponse[]> {
        try {
            return await this.model.getChatUsers(chatId);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка загрузки участников';
            showError(message);
            return [];
        }
    }

    public selectChat(id: number | null): void {
        this.model.setActiveChat(id);
    }

    public async createChat(title: string): Promise<boolean> {
        try {
            await this.model.createChat(title);
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка создания чата';
            showError(message);
            return false;
        }
    }

    public async deleteChat(chatId: number): Promise<boolean> {
        try {
            await this.model.deleteChat(chatId);
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка удаления чата';
            showError(message);
            return false;
        }
    }

    public async addUserToChat(chatId: number, userId: number): Promise<boolean> {
        try {
            await this.model.addUserToChat(chatId, userId);
            return true;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Ошибка добавления пользователя';
            showError(message);
            return false;
        }
    }

    public async addUsersToChat(chatId: number, userIds: number[]): Promise<boolean> {
        try {
            await this.model.addUsersToChat(chatId, userIds);
            return true;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Ошибка добавления пользователей';
            showError(message);
            return false;
        }
    }

    public async deleteUserFromChat(chatId: number, userId: number): Promise<boolean> {
        try {
            await this.model.deleteUserFromChat(chatId, userId);
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка удаления пользователя';
            showError(message);
            return false;
        }
    }

    public async updateChatAvatar(chatId: number, file: File): Promise<boolean> {
        try {
            await this.model.updateChatAvatar(chatId, file);
            return true;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Ошибка обновления аватара чата';
            showError(message);
            return false;
        }
    }

    public async connectChat(chatId: number): Promise<void> {
        console.log(`[WS] connectChat called for chat ${chatId}`);
        this.disconnectChat();

        const user = authController.getCurrentUser();
        const userId = user?.id;

        if (!userId) {
            showError('Не удалось определить пользователя');
            return;
        }

        try {
            const {token} = await ChatsAPI.getToken(chatId);
            const wsUrl = `${WS_BASE_URL}/${userId}/${chatId}/${token}`;
            console.log(`[WS] connecting to ${wsUrl}`);
            this._wsTransport = new WSTransport(wsUrl);

            this._wsTransport.on('open', () => {
                console.log('[WS] open');
                this._wsTransport?.send({type: 'get old', content: '0'});
            });

            this._wsTransport.on('message', (data: unknown) => {
                this._handleMessage(chatId, data);
            });

            this._wsTransport.on('error', (event: ErrorEvent) => {
                console.log('[WS] error', event);
                showError('Ошибка соединения с чатом');
            });

            this._wsTransport.on('close', (event: CloseEvent) => {
                console.log('[WS] close', event.code, event.reason);
                this._wsTransport = null;
            });

            await this._wsTransport.connect();
            console.log('[WS] connected');
            this.model.resetUnreadCount(chatId);

            this.model
                .fetchChatUsers(chatId)
                .then((users) => {
                    console.log('[WS] chat users loaded:', users.length);
                    this.model.setChatUsers(chatId, users);
                })
                .catch((err) => {
                    console.error('[WS] fetchChatUsers error:', err);
                });
        } catch (error) {
            this._wsTransport = null;
            const message = error instanceof Error ? error.message : 'Ошибка подключения к чату';
            console.error('[WS] connect failed:', message);
            showError(message);
        }
    }

    public disconnectChat(): void {
        if (this._wsTransport) {
            console.log('[WS] disconnectChat');
            this._wsTransport.close();
            this._wsTransport = null;
        }
    }

    public sendMessage(_chatId: number, text: string): void {
        if (!this._wsTransport) {
            console.warn('[WS] sendMessage: no transport');
            showError('Нет соединения с чатом');
            return;
        }

        try {
            console.log('[WS] sendMessage:', text);
            this._wsTransport.send({type: 'message', content: text});
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Ошибка отправки сообщения';
            console.error('[WS] sendMessage error:', message);
            showError(message);
        }
    }

    private _handleMessage(chatId: number, data: unknown): void {
        if (Array.isArray(data)) {
            console.log('[WS] received old messages:', (data as WSMessage[]).length);
            const messages = data as WSMessage[];
            this.model.setMessages(chatId, messages);
        } else if (typeof data === 'object' && data !== null) {
            const msg = data as WSMessage;
            if (msg.type === 'ping') {
                console.log('[WS] received ping, sending pong');
                try {
                    this._wsTransport?.send({type: 'pong'});
                } catch {
                    // ignore send errors when socket is closed
                }
                return;
            }
            if (msg.type === 'pong' || msg.type === 'user connected') {
                return;
            }
            if (msg.type === 'message' || msg.type === 'file') {
                console.log('[WS] received new message');
                this.model.addMessage(chatId, msg);
                const currentUser = authController.getCurrentUser();
                const isOutgoing = currentUser
                    ? String(currentUser.id) === String(msg.user_id)
                    : false;
                let sender: UserResponse | undefined;
                if (!isOutgoing) {
                    const chatUsers = this.model.getChatUsers(chatId);
                    sender = chatUsers.find((u) => String(u.id) === String(msg.user_id));
                }
                this.model.updateChatLastMessage(
                    chatId,
                    msg,
                    isOutgoing ? toUserResponse(currentUser) : sender,
                );
            }
        }
    }
}

export const chatsController = new ChatsController(chatsModel);
