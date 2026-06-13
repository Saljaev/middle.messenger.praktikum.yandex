import {Block, BlockOwnProps} from '../core/Block';
import MainLayout from '../components/layout/MainLayout';
import {ChatWindow} from '../components/chat/chat-window/ChatWindow';
import {ChatHeader} from '../components/chat/chat-header/ChatHeader';
import {MessageForm} from '../components/form/message/MessageForm';
import ChatList from '../components/chat/chat-list/ChatList';
import {getActiveChatId, getApiChatById, getAvatarUrl} from '../utils/chats';
import Router from '../router/Router';
import {chatsController} from '../controllers/ChatsController';

interface ChatPageProps extends BlockOwnProps {}

export class ChatPage extends Block<ChatPageProps> {
    protected template = `
        <div>
            {{{layout}}}
        </div>
    `;

    constructor(props: ChatPageProps = {}) {
        const chatId = getActiveChatId() ?? 0;
        const apiChat = getApiChatById(chatId);

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

        let content: Block;

        if (!chatData) {
            content = new ChatWindow({});
        } else {
            const messageInput = new MessageForm({
                onSend: (text: string) => {
                    chatsController.sendMessage(chatId, text);
                    Router.getInstance().go(window.location.pathname);
                },
            });

            content = new ChatWindow({
                chat: chatData,
                header: new ChatHeader({chat: chatData}),
                messages: [],
                input: messageInput,
            });
        }

        super({
            ...props,
            layout: new MainLayout({
                chatList: new ChatList({}),
                content,
            }),
        });
    }
}
