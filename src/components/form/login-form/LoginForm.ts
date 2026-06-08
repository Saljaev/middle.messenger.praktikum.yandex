import {Block, BlockOwnProps} from '../../../core/Block';
import {Form} from '../../form/Form';
import {Input} from '../../base/input/Input';
import {Button} from '../../base/button/Button';
import {authController} from '../../../controllers/AuthController';
import Router from '../../../router/Router';
import {LoginFormData} from '../../../types';
import {chatsController} from "@/controllers/ChatsController";

interface LoginFormProps extends BlockOwnProps {}

export class LoginForm extends Block<LoginFormProps> {
    protected template = `
        {{{form}}}
    `;

    constructor(props: LoginFormProps = {}) {
        const form = new Form<LoginFormData>({
            id: 'loginForm',
            onSubmit: async (data) => {
                const success = await authController.signIn(data.login, data.password);
                if (success) {
                    await chatsController.getChats();
                    Router.getInstance().go('/messenger');
                }
            },
            children: [
                new Input({
                    name: 'login',
                    label: 'Логин',
                    placeholder: 'Введите логин',
                    required: true,
                }),
                new Input({
                    name: 'password',
                    label: 'Пароль',
                    type: 'password',
                    placeholder: 'Введите пароль',
                    required: true,
                }),
                new Button({
                    label: 'Войти',
                    type: 'submit',
                    className: 'button_primary button_full-width',
                }),
            ],
        });

        super({
            ...props,
            form,
        });
    }
}
