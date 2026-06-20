import {Block, BlockOwnProps} from '../core/Block';
import MainLayout from '../components/layout/MainLayout';
import {ChatWindow} from '../components/chat/chat-window/ChatWindow';
import {ChatHeader} from '../components/chat/chat-header/ChatHeader';
import {MessageForm} from '../components/form/message/MessageForm';
import ChatList from '../components/chat/chat-list/ChatList';
import {getActiveChatId, getApiChatById, getAvatarUrl} from '../utils/chats';
import {chatsController} from '../controllers/ChatsController';
import {UserResponse, WSMessage} from '../api/types';
import {Message} from '../components/chat/message/Message';
import {formatTime, formatDateLabel} from '../helpers/formatTime';
import {MessageDateDivider} from '../components/chat/message-date-divider/MessageDateDivider';
import {authController} from '../controllers/AuthController';
import {connect} from '../utils/connect';
import {Indexed} from '../types';

interface ChatPageProps extends BlockOwnProps {
    messages?: WSMessage[];
    chatData?: Record<string, unknown>;
    layout?: Block;
    chatUsers?: UserResponse[];
}

function mapMessagesToBlocks(
    messages: WSMessage[],
    currentUserId: number,
    chatUsers: UserResponse[],
): Block[] {
    const users = Array.isArray(chatUsers) ? chatUsers : [];
    const result: Block[] = [];

    messages.forEach((msg, index) => {
        if (index > 0) {
            const prevMsg = messages[index - 1];
            const prevDate = new Date(prevMsg.time).toDateString();
            const currDate = new Date(msg.time).toDateString();
            if (prevDate !== currDate) {
                result.push(new MessageDateDivider({date: formatDateLabel(prevMsg.time)}));
            }
        }

        const isOutgoing = String(msg.user_id) === String(currentUserId);
        const sender = users.find((u) => String(u.id) === String(msg.user_id));
        const senderName =
            !isOutgoing && sender ? `${sender.first_name} ${sender.second_name}` : '';
        const senderAvatar = !isOutgoing && sender ? getAvatarUrl(sender.avatar) : '';

        result.push(
            new Message({
                text: msg.content,
                time: formatTime(msg.time, 'time'),
                isOutgoing,
                isRead: true,
                senderName,
                senderAvatar,
            }),
        );
    });

    return result;
}

class ChatPageBase extends Block<ChatPageProps> {
    protected template = `
        <div>
            {{{layout}}}
        </div>
    `;

    constructor(props: ChatPageProps = {}) {
        const chatId = getActiveChatId() ?? 0;
        const apiChat = getApiChatById(chatId);
        const currentUser = authController.getCurrentUser();
        const currentUserId = Number(currentUser?.id ?? 0);

        let chatData: Record<string, unknown> | undefined;
        if (apiChat) {
            chatData = {
                id: apiChat.id,
                title: apiChat.title,
                avatarUrl: getAvatarUrl(apiChat.avatar),
                status: 'онлайн',
                isGroup: false,
            };
        }

        const messages = props.messages ?? [];
        const chatUsers = props.chatUsers ?? [];
        const messageBlocks = mapMessagesToBlocks(messages, currentUserId, chatUsers);

        let content: Block;

        if (!chatData) {
            content = new ChatWindow({});
        } else {
            const messageInput = new MessageForm({
                onSend: (text: string) => {
                    chatsController.sendMessage(chatId, text);
                },
            });

            content = new ChatWindow({
                chat: chatData,
                header: new ChatHeader({chat: chatData}),
                messages: messageBlocks,
                input: messageInput,
            });
        }

        super({
            ...props,
            layout: new MainLayout({
                chatList: new ChatList({}),
                content,
            }),
            chatData,
        });

        if (chatId > 0) {
            chatsController.connectChat(chatId);
        }
    }

    public setProps(nextProps: Partial<ChatPageProps>): void {
        const chatId = getActiveChatId() ?? 0;
        const shouldRebuild =
            (nextProps.messages !== undefined || nextProps.chatUsers !== undefined) &&
            chatId > 0 &&
            this.props.chatData;

        if (shouldRebuild) {
            const currentUser = authController.getCurrentUser();
            const currentUserId = Number(currentUser?.id ?? 0);
            const messages = nextProps.messages ?? this.props.messages ?? [];
            const chatUsers = nextProps.chatUsers ?? this.props.chatUsers ?? [];
            const messageBlocks = mapMessagesToBlocks(messages, currentUserId, chatUsers);
            const messageInput = new MessageForm({
                onSend: (text: string) => {
                    chatsController.sendMessage(chatId, text);
                },
            });
            const chatData = this.props.chatData as Record<string, unknown>;
            const content = new ChatWindow({
                chat: chatData,
                header: new ChatHeader({chat: chatData}),
                messages: messageBlocks,
                input: messageInput,
            });
            nextProps.layout = new MainLayout({
                chatList: new ChatList({}),
                content,
            });
        }
        super.setProps(nextProps);
    }

    public destroy(): void {
        chatsController.disconnectChat();
        super.destroy();
    }
}

export const ChatPage = connect<ChatPageProps>((state: Indexed) => {
    const chatId = getActiveChatId() ?? 0;
    const messages = ((state.messages as Record<number, WSMessage[]>) ?? {})[chatId] ?? [];
    const chatUsers = ((state.chatUsers as Record<number, UserResponse[]>) ?? {})[chatId] ?? [];
    return {messages, chatUsers};
})(ChatPageBase);
