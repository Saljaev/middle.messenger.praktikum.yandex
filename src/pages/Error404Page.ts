import {Block, BlockOwnProps} from '../core/Block';

interface Error404Props extends BlockOwnProps {}

export class Error404Page extends Block<Error404Props> {
    protected template = `
        <main class="error-page">
            <h1 class="error-page__code">404</h1>
            <h2 class="error-page__title">Страница не найдена</h2>
            <p class="error-page__text">К сожалению, запрашиваемая страница не существует.</p>
            <a href="/" class="button button_primary">На главную</a>
        </main>
    `;
}
