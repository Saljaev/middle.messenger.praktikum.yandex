import {Block, BlockOwnProps} from '../core/Block';
import MainLayout from '../components/layout/MainLayout';
import {SettingsContent} from '../components/settings/settings-content/SettingsContent';
import ChatList from '../components/chat/chat-list/ChatList';

interface SettingsPageProps extends BlockOwnProps {}

export class SettingsPage extends Block<SettingsPageProps> {
    protected template = `
        <div>
            {{{layout}}}
        </div>
    `;

    constructor(props: SettingsPageProps = {}) {
        super({
            ...props,
            layout: new MainLayout({
                chatList: new ChatList({}),
                content: new SettingsContent(),
            }),
        });
    }
}
