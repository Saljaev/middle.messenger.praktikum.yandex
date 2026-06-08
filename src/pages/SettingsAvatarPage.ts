import {Block, BlockOwnProps} from '../core/Block';
import MainLayout from '../components/layout/MainLayout';
import {SettingsAvatarContent} from '../components/settings/settings-avatar-content/SettingsAvatarContent';
import ChatList from '../components/chat/chat-list/ChatList';

interface SettingsAvatarPageProps extends BlockOwnProps {}

export class SettingsAvatarPage extends Block<SettingsAvatarPageProps> {
    protected template = `
        <div>
            {{{layout}}}
        </div>
    `;

    constructor(props: SettingsAvatarPageProps = {}) {
        super({
            ...props,
            layout: new MainLayout({
                chatList: new ChatList({}),
                content: new SettingsAvatarContent(),
            }),
        });
    }
}
