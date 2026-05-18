import {Block, BlockOwnProps} from '../../../core/Block';
import {SettingsAvatarForm} from '../../form/settings-avatar-form/SettingsAvatarForm';
import {Icon} from '../../base/icon/Icon';

interface SettingsAvatarContentProps extends BlockOwnProps {}

export class SettingsAvatarContent extends Block<SettingsAvatarContentProps> {
    protected template = `
        <main class="settings-window">
            <header class="settings-window__header">
                <a href="/settings" class="settings-window__back-btn">
                    {{{backIcon}}}
                </a>
                <h1 class="settings-window__title">Изменить аватар</h1>
            </header>
            <div class="settings-window__content">
                {{{settingsAvatarForm}}}
            </div>
        </main>
    `;

    constructor(props: SettingsAvatarContentProps = {}) {
        super({
            ...props,
            settingsAvatarForm: new SettingsAvatarForm(),
            backIcon: new Icon({name: 'arrow_back'}),
        });
    }
}
