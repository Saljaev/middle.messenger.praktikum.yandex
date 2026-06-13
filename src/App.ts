import Router from './router/Router';
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/RegisterPage';
import {MessengerPage} from './pages/MessengerPage';
import {ChatPage} from './pages/ChatPage';
import {ChatInfoPage} from './pages/ChatInfoPage';
import {SettingsPage} from './pages/SettingsPage';
import {SettingsPasswordPage} from './pages/SettingsPasswordPage';
import {SettingsAvatarPage} from './pages/SettingsAvatarPage';
import {Error404Page} from './pages/Error404Page';
import {Error500Page} from './pages/Error500Page';
import {authController} from './controllers/AuthController';
import {chatsController} from './controllers/ChatsController';

export const router = new Router('#root');

export class App {
    public async start(): Promise<void> {
        this.initNavigation();
        this.initRoutes();
        await authController.fetchUser();
        await chatsController.init();
        router.start();
    }

    private initRoutes(): void {
        router
            .use('/', LoginPage)
            .use('/sign-up', RegisterPage)
            .use('/messenger', MessengerPage)
            .use('/settings', SettingsPage)
            .use('/settings/password', SettingsPasswordPage)
            .use('/settings/avatar', SettingsAvatarPage)
            .use('/chat/:id', ChatPage)
            .use('/chat/:id/info', ChatInfoPage)
            .use('/404', Error404Page)
            .use('/500', Error500Page);
    }

    private initNavigation(): void {
        document.addEventListener('click', (e) => {
            const link = (e.target as HTMLElement).closest('a');
            if (link) {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('http') || href.startsWith('#')) return;
                e.preventDefault();
                router.go(href);
            }

            const btn = (e.target as HTMLElement).closest('[data-navigate]');
            if (btn) {
                e.preventDefault();
                const url = btn.getAttribute('data-navigate');
                if (url) {
                    router.go(url);
                }
            }
        });
    }
}

export const app = new App();
