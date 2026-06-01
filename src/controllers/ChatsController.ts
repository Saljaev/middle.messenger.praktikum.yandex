import {Controller} from '../core/Controller';
import {Block} from '../core/Block';
import {ChatsModel, chatsModel} from '../models/ChatsModel';
import {authController} from './AuthController';

export class ChatsController extends Controller<ChatsModel, Block> {
    constructor(model: ChatsModel) {
        super(model);
    }

    public init(): void {}

    public getChats() {
        return this.model.getChats();
    }

    public getChatById(id: number) {
        return this.model.getChatById(id);
    }

    public selectChat(id: number | null): void {
        this.model.setActiveChat(id);
    }

    public sendMessage(chatId: number, text: string): void {
        const user = authController.getCurrentUser();
        const senderId = user && typeof user.id === 'number' ? user.id : 999;
        this.model.sendMessage(chatId, text, senderId);
    }
}

export const chatsController = new ChatsController(chatsModel);
