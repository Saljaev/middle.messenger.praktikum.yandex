import {Block, BlockOwnProps} from '../core/Block';
import {RegisterForm} from '../components/form/register-form/RegisterForm';

interface RegisterPageProps extends BlockOwnProps {}

export class RegisterPage extends Block<RegisterPageProps> {
    protected template = `
        <main class="auth-container">
            <div class="auth-card">
                <h1 class="auth-card__title">Регистрация</h1>
                <div class="auth-card__content">
                    {{{registerForm}}}
                </div>
                <div class="auth-card__footer">
                    <div class="auth-footer">
                        Уже есть аккаунт?
                        <a href="/" class="button button_link link">Войти</a>
                    </div>
                </div>
            </div>
        </main>
    `;

    constructor(props: RegisterPageProps = {}) {
        super({
            ...props,
            registerForm: new RegisterForm(),
        });
    }
}
