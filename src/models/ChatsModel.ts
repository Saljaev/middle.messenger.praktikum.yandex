import {Model} from '../core/Model';
import {chats, MockChat, MockMessage} from '../mocks/chats';

interface ChatsState {
    chats: MockChat[];
    activeChatId: number | null;
    [key: string]: unknown;
}

export class ChatsModel extends Model<ChatsState> {
    constructor() {
        super({
            chats: [...chats],
            activeChatId: null,
        });
    }

    public getChats(): MockChat[] {
        return this.state.chats;
    }

    public getChatById(id: number): MockChat | undefined {
        return this.state.chats.find((c) => c.id === id);
    }

    public setActiveChat(id: number | null): void {
        this.setState({activeChatId: id});
    }

    public getActiveChatId(): number | null {
        return this.state.activeChatId;
    }

    public sendMessage(chatId: number, text: string, senderId: number): MockMessage {
        const newMessage: MockMessage = {
            id: Date.now(),
            senderId,
            text,
            time: new Date().toISOString(),
            isRead: false,
        };

        const chat = this.state.chats.find((c) => c.id === chatId);
        if (chat) {
            chat.messages.push(newMessage);
            chat.lastMessage = newMessage;
            this.setState({chats: [...this.state.chats]});
        }

        return newMessage;
    }
}

export const chatsModel = new ChatsModel();
