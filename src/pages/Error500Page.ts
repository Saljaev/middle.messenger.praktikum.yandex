import {Block, BlockOwnProps} from '../core/Block';

interface Error500Props extends BlockOwnProps {}

export class Error500Page extends Block<Error500Props> {
    protected template = `
        <main class="error-page">
            <h1 class="error-page__code">500</h1>
            <h2 class="error-page__title">Ошибка сервера</h2>
            <p class="error-page__text">Произошла внутренняя ошибка сервера. Пожалуйста, попробуйте позже.</p>
            <a href="/" class="button button_primary">На главную</a>
        </main>
    `;
}
