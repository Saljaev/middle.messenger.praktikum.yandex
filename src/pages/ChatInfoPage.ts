import {Block, BlockOwnProps} from '../core/Block';
import MainLayout from '../components/layout/MainLayout';
import {ChatInfoContent} from '../components/chat/chat-info/ChatInfoContent';
import {Modal} from '../components/base/modal/Modal';
import {AddMemberForm} from '../components/form/add-member-form/AddMemberForm';
import ChatList from '../components/chat/chat-list/ChatList';
import {authController} from '../controllers/AuthController';
import {chatsController} from '../controllers/ChatsController';
import {getApiChatById} from '../utils/chats';

interface ChatInfoPageProps extends BlockOwnProps {}

export class ChatInfoPage extends Block<ChatInfoPageProps> {
    private modal: Modal;

    protected template = `
        <div>
            {{{layout}}}
            {{{modal}}}
        </div>
    `;

    constructor(props: ChatInfoPageProps = {}) {
        let modal: Modal;
        const match = window.location.pathname.match(/^\/chat\/(\d+)\/info$/);
        const chatId = match ? parseInt(match[1], 10) : 0;
        const apiChat = getApiChatById(chatId);
        const user = authController.getCurrentUser() ?? {};

        const currentUserId = user.id as number | undefined;
        const isAdmin =
            currentUserId != null && apiChat != null && currentUserId === apiChat.created_by;

        let chatData: Record<string, unknown> | undefined;
        if (apiChat) {
            chatData = {
                id: apiChat.id,
                title: apiChat.title,
                avatarUrl: apiChat.avatar
                    ? `https://ya-praktikum.tech/api/v2/resources${apiChat.avatar}`
                    : 'https://placehold.co/200/0088cc/white?text=?',
                status: 'онлайн',
            };
        }

        modal = new Modal({
            content: new AddMemberForm({
                chatId,
                onSuccess: () => {
                    this.modal.close();
                    loadMembers();
                },
            }),
        });

        const content = new ChatInfoContent({
            chat: chatData as unknown as Record<string, unknown>,
            isAdmin,
            onAddMember: () => {
                this.modal.open();
            },
            onRemoveMember: async (userId: number) => {
                const success = await chatsController.deleteUserFromChat(chatId, userId);
                if (success) {
                    loadMembers();
                }
            },
        });

        const loadMembers = async () => {
            const users = await chatsController.getChatUsers(chatId);
            const members = users.map((u) => ({
                id: u.id,
                avatarUrl: u.avatar
                    ? `https://ya-praktikum.tech/api/v2/resources${u.avatar}`
                    : 'https://placehold.co/200/0088cc/white?text=?',
                name: u.display_name || `${u.first_name} ${u.second_name}`,
            }));
            content.setProps({members});
        };

        loadMembers();

        super({
            ...props,
            layout: new MainLayout({
                chatList: new ChatList({}),
                content,
            }),
            modal: modal,
        });

        this.modal = modal;
    }
}
