import {Block, BlockOwnProps} from '../../../core/Block';
import {Input} from '../../base/input/Input';
import {Icon} from '../../base/icon/Icon';
import {authController} from '../../../controllers/AuthController';
import Router from '../../../router/Router';
import {ProfileFormData} from '../../../types';
import {
    firstNameValidator,
    secondNameValidator,
    loginValidator,
    emailValidator,
    phoneValidator,
} from '../../../utils/validation';

interface SettingsFormProps extends BlockOwnProps {}

export class SettingsForm extends Block<SettingsFormProps> {
    protected template = `
        <form class="settings-form" id="settingsForm">
            <div class="settings-form__section settings-form__section--personal">
                <h2 class="settings-form__section-title">Личная информация</h2>
                <div class="settings-profile">
                    <a href="/settings/avatar" class="settings-profile__avatar" title="Нажмите чтобы изменить аватар">
                        <img src="{{avatarUrl}}" alt="{{firstName}}" class="avatar__image" style="width:64px;height:64px;border-radius:50%;object-fit:cover;" onerror="this.src='https://placehold.co/200/0088cc/white?text=?'">
                        <div class="settings-profile__avatar-overlay">
                            {{{editAvatarIcon}}}
                        </div>
                    </a>
                </div>
                {{{firstNameInput}}}
                {{{secondNameInput}}}
            </div>
            <div class="settings-form__section">
                <h2 class="settings-form__section-title">Данные аккаунта</h2>
                <div class="form__group">
                    <label for="display_name" class="form__label">Отображаемое имя</label>
                    <div class="display-name-field">
                        <input type="text" id="display_name" name="display_name" class="input" value="{{displayName}}" readonly>
                        <button type="button" class="button button_icon" title="Сгенерировать новое имя" data-action="generate">
                            {{{editDisplayIcon}}}
                        </button>
                    </div>
                </div>
                {{{loginInput}}}
                {{{emailInput}}}
                {{{phoneInput}}}
            </div>
            <div class="settings-form__section settings-form__section--security">
                <h2 class="settings-form__section-title">Безопасность</h2>
                <div class="settings-form__link">
                    <a class="settings-link" href="/settings/password">
                        Изменить пароль
                        {{{arrowIcon}}}
                    </a>
                </div>
            </div>
            <footer class="settings-form__footer">
                <button type="submit" class="settings-link settings-link--primary" data-action="save">Сохранить изменения</button>
                <button type="button" class="settings-link settings-link--danger" data-action="logout">Выйти из аккаунта</button>
            </footer>
        </form>
    `;

    constructor(props: SettingsFormProps = {}) {
        const user = authController.getCurrentUser() ?? {};

        const firstNameInput = new Input({
            name: 'first_name',
            label: 'Имя',
            value: String(user.first_name ?? ''),
            required: true,
            validate: firstNameValidator,
        });

        const secondNameInput = new Input({
            name: 'second_name',
            label: 'Фамилия',
            value: String(user.second_name ?? ''),
            required: true,
            validate: secondNameValidator,
        });

        const loginInput = new Input({
            name: 'login',
            label: 'Логин',
            value: String(user.login ?? ''),
            required: true,
            validate: loginValidator,
        });

        const emailInput = new Input({
            name: 'email',
            label: 'Почта',
            type: 'email',
            value: String(user.email ?? ''),
            required: true,
            validate: emailValidator,
        });

        const phoneInput = new Input({
            name: 'phone',
            label: 'Телефон',
            type: 'tel',
            value: String(user.phone ?? ''),
            required: true,
            validate: phoneValidator,
        });

        super({
            ...props,
            avatarUrl: String(
                user.avatar
                    ? `https://ya-praktikum.tech/api/v2/resources${user.avatar}`
                    : 'https://placehold.co/200/0088cc/white?text=?',
            ),
            firstName: String(user.first_name ?? ''),
            displayName: String(user.display_name ?? ''),
            firstNameInput,
            secondNameInput,
            loginInput,
            emailInput,
            phoneInput,
            editAvatarIcon: new Icon({name: 'edit'}),
            editDisplayIcon: new Icon({name: 'edit'}),
            arrowIcon: new Icon({name: 'arrow_back', style: 'transform:rotate(180deg)'}),
        });

        this.events = {
            click: this.handleClick.bind(this),
            submit: this.handleSubmit.bind(this),
        };
    }

    private handleClick(e: Event): void {
        const target = (e.target as HTMLElement).closest('[data-action]');
        if (!target) return;
        const action = target.getAttribute('data-action');
        if (action === 'logout') {
            this.handleLogout();
        } else if (action === 'generate') {
            this.handleGenerateDisplayName();
        }
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries()) as unknown as ProfileFormData;

        let hasErrors = false;
        this.children.forEach((child) => {
            if (child instanceof Input) {
                const error = child.validateInput();
                if (error) {
                    hasErrors = true;
                }
            }
        });

        if (hasErrors) {
            return;
        }

        await authController.updateProfile(data);
    }

    private async handleLogout(): Promise<void> {
        if (confirm('Вы уверены, что хотите выйти?')) {
            await authController.logout();
            Router.getInstance().go('/');
        }
    }

    private handleGenerateDisplayName(): void {
        const newName = authController.generateDisplayName();
        const displayNameInput = this.element?.querySelector(
            '#display_name',
        ) as HTMLInputElement | null;
        if (displayNameInput) {
            displayNameInput.value = newName;
        }
    }
}
