import {Block, BlockOwnProps} from '../core/Block';
import {LoginForm} from '../components/form/login-form/LoginForm';

interface LoginPageProps extends BlockOwnProps {}

export class LoginPage extends Block<LoginPageProps> {
    protected template = `
        <main class="auth-container">
            <div class="auth-card">
                <h1 class="auth-card__title">Авторизация</h1>
                <div class="auth-card__content">
                    {{{loginForm}}}
                </div>
                <div class="auth-card__footer">
                    <div class="auth-footer">
                        Нет аккаунта?
                        <a href="/register" class="button button_link link">Зарегистрироваться</a>
                    </div>
                </div>
            </div>
        </main>
    `;

    constructor(props: LoginPageProps = {}) {
        super({
            ...props,
            loginForm: new LoginForm(),
        });
    }
}
