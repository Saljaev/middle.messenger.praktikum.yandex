import {Block, BlockOwnProps} from '../core/Block';
import MainLayout from '../components/layout/MainLayout';
import ChatList from '../components/chat/chat-list/ChatList';
import {ChatWindow} from '../components/chat/chat-window/ChatWindow';

interface MessengerPageProps extends BlockOwnProps {}

export class MessengerPage extends Block<MessengerPageProps> {
    protected template = `
        <div>
            {{{layout}}}
        </div>
    `;

    constructor(props: MessengerPageProps = {}) {
        super({
            ...props,
            layout: new MainLayout({
                chatList: new ChatList({}),
                content: new ChatWindow({}),
            }),
        });
    }
}
