import {Block, BlockOwnProps} from '../../../core/Block';
import {Form} from '../../form/Form';
import {Input} from '../../base/input/Input';
import {Button} from '../../base/button/Button';
import {authController} from '../../../controllers/AuthController';
import {navigateTo} from '../../../App';
import {RegisterFormData} from '../../../types';
import {
    emailValidator,
    loginValidator,
    firstNameValidator,
    secondNameValidator,
    phoneValidator,
    passwordValidator,
} from '../../../utils/validation';

interface RegisterFormProps extends BlockOwnProps {}

export class RegisterForm extends Block<RegisterFormProps> {
    protected template = `
        {{{form}}}
    `;

    constructor(props: RegisterFormProps = {}) {
        const form = new Form<RegisterFormData>({
            id: 'registerForm',
            validate: (data) => {
                const errors: Partial<Record<keyof RegisterFormData, string>> = {};
                if (data.password !== data.password_confirm) {
                    errors.password_confirm = 'Пароли не совпадают';
                }
                return errors;
            },
            onSubmit: (data: RegisterFormData) => {
                console.log(data);
                const success = authController.signUp(data);
                if (success) {
                    navigateTo('/');
                }
            },
            children: [
                new Input({
                    name: 'email',
                    label: 'Почта',
                    type: 'email',
                    placeholder: 'Введите email',
                    required: true,
                    validate: emailValidator,
                }),
                new Input({
                    name: 'login',
                    label: 'Логин',
                    placeholder: 'Введите логин',
                    required: true,
                    validate: loginValidator,
                }),
                new Input({
                    name: 'first_name',
                    label: 'Имя',
                    placeholder: 'Введите имя',
                    required: true,
                    validate: firstNameValidator,
                }),
                new Input({
                    name: 'second_name',
                    label: 'Фамилия',
                    placeholder: 'Введите фамилию',
                    required: true,
                    validate: secondNameValidator,
                }),
                new Input({
                    name: 'phone',
                    label: 'Телефон',
                    type: 'tel',
                    placeholder: 'Введите телефон',
                    required: true,
                    validate: phoneValidator,
                }),
                new Input({
                    name: 'password',
                    label: 'Пароль',
                    type: 'password',
                    placeholder: 'Введите пароль',
                    required: true,
                    validate: passwordValidator,
                }),
                new Input({
                    name: 'password_confirm',
                    label: 'Пароль (ещё раз)',
                    type: 'password',
                    placeholder: 'Повторите пароль',
                    required: true,
                    validate: passwordValidator,
                }),
                new Button({
                    label: 'Зарегистрироваться',
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
