import {Block, BlockOwnProps} from '../core/Block';
import MainLayout from '../components/layout/MainLayout';
import {SettingsPasswordContent} from '../components/settings/settings-password-content/SettingsPasswordContent';
import ChatList from '../components/chat/chat-list/ChatList';

interface SettingsPasswordPageProps extends BlockOwnProps {}

export class SettingsPasswordPage extends Block<SettingsPasswordPageProps> {
    protected template = `
        <div>
            {{{layout}}}
        </div>
    `;

    constructor(props: SettingsPasswordPageProps = {}) {
        super({
            ...props,
            layout: new MainLayout({
                chatList: new ChatList({}),
                content: new SettingsPasswordContent(),
            }),
        });
    }
}
