import {Block, BlockOwnProps} from '../../../core/Block';
import {SettingsPasswordForm} from '../../form/settings-password-form/SettingsPasswordForm';
import {Icon} from '../../base/icon/Icon';

interface SettingsPasswordContentProps extends BlockOwnProps {}

export class SettingsPasswordContent extends Block<SettingsPasswordContentProps> {
    protected template = `
        <main class="settings-window">
            <header class="settings-window__header">
                <a href="/settings" class="settings-window__back-btn">
                    {{{backIcon}}}
                </a>
                <h1 class="settings-window__title">Изменить пароль</h1>
            </header>
            {{{settingsPasswordForm}}}
        </main>
    `;

    constructor(props: SettingsPasswordContentProps = {}) {
        super({
            ...props,
            settingsPasswordForm: new SettingsPasswordForm(),
            backIcon: new Icon({name: 'arrow_back'}),
        });
    }
}
