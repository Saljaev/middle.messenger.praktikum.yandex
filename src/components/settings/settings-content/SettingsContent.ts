import {Block, BlockOwnProps} from '../../../core/Block';
import {SettingsForm} from '../../form/settings-form/SettingsForm';
import {Icon} from '../../base/icon/Icon';

interface SettingsContentProps extends BlockOwnProps {}

export class SettingsContent extends Block<SettingsContentProps> {
    protected template = `
        <main class="settings-window">
            <header class="settings-window__header">
                <a href="/" class="settings-window__back-btn">
                    {{{backIcon}}}
                </a>
                <h1 class="settings-window__title">Настройки профиля</h1>
            </header>
            <div class="settings-window__content">
                {{{settingsForm}}}
            </div>
        </main>
    `;

    constructor(props: SettingsContentProps = {}) {
        super({
            ...props,
            settingsForm: new SettingsForm(),
            backIcon: new Icon({name: 'arrow_back'}),
        });
    }
}
