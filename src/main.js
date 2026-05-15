import './styles/index.scss';
import {renderApp, initNavigation} from './render';

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderApp();
        initNavigation();
    });
} else {
    renderApp();
    initNavigation();
}
