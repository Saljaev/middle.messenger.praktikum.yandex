import {Block, BlockOwnProps} from '../../../core/Block';
import {Form} from '../../form/Form';
import {Input} from '../../base/input/Input';
import {Button} from '../../base/button/Button';
import {authController} from '../../../controllers/AuthController';
import {navigateTo} from '../../../App';
import {PasswordFormData} from '../../../types';
import {passwordValidator} from '../../../utils/validation';

interface SettingsPasswordFormProps extends BlockOwnProps {}

export class SettingsPasswordForm extends Block<SettingsPasswordFormProps> {
    protected template = `
        <div class="settings-window__content">
                {{{form}}}
        </div>
    `;

    constructor(props: SettingsPasswordFormProps = {}) {
        const form = new Form<PasswordFormData>({
            id: 'passwordForm',
            validate: (data) => {
                const errors: Partial<Record<keyof PasswordFormData, string>> = {};
                if (data.new_password !== data.new_password_confirm) {
                    errors.new_password_confirm = 'Пароли не совпадают';
                }
                return errors;
            },
            onSubmit: (data) => {
                console.log(data);
                const success = authController.updatePassword(
                    data.old_password,
                    data.new_password,
                    data.new_password_confirm ?? '',
                );
                if (success) {
                    navigateTo('/settings');
                }
            },
            children: [
                new Input({
                    name: 'old_password',
                    label: 'Старый пароль',
                    type: 'password',
                    required: true,
                }),
                new Input({
                    name: 'new_password',
                    label: 'Новый пароль',
                    type: 'password',
                    required: true,
                    validate: passwordValidator,
                }),
                new Input({
                    name: 'new_password_confirm',
                    label: 'Повторите новый пароль',
                    type: 'password',
                    required: true,
                }),
                new Button({
                    label: 'Сохранить',
                    type: 'submit',
                    className: 'button_primary',
                }),
            ],
        });

        super({
            ...props,
            form,
        });
    }
}
