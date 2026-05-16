import Handlebars from 'handlebars';
import mainLayout from './layouts/main.hbs?raw';
import loginLayout from './layouts/login.hbs?raw';
import registerLayout from './layouts/register.hbs?raw';
import error404Layout from './layouts/error-404.hbs?raw';
import error500Layout from './layouts/error-500.hbs?raw';

import avatarPartial from './components/base/avatar/avatar.hbs?raw';
import backIconPartial from './components/base/icons/back/back-icon.hbs?raw';
import settingsIconPartial from './components/base/icons/settings/settings-icon.hbs?raw';
import chatIconPartial from './components/base/icons/chat/chat-icon.hbs?raw';
import editIconPartial from './components/base/icons/edit/edit-icon.hbs?raw';
import uploadIconPartial from './components/base/icons/upload/upload-icon.hbs?raw';
import personAddIconPartial from './components/base/icons/person_add/person-add-icon.hbs?raw';
import searchIconPartial from './components/base/icons/search/search-icon.hbs?raw';
import menuIconPartial from './components/base/icons/menu/menu-icon.hbs?raw';
import checkIconPartial from './components/base/icons/check/check-icon.hbs?raw';
import checkReadIconPartial from './components/base/icons/check_read/check-read-icon.hbs?raw';
import attachFileIconPartial from './components/base/icons/attach_file/attach-file-icon.hbs?raw';
import sentimentSatisfiedIconPartial
    from './components/base/icons/sentiment_satisfied/sentiment-satisfied-icon.hbs?raw';
import sendIconPartial from './components/base/icons/send/send-icon.hbs?raw';
import pushPinIconPartial from './components/base/icons/push_pin/push-pin-icon.hbs?raw';

import sidebarHeaderPartial from './components/chat/sidebar-header/sidebar-header.hbs?raw';

import loginFormPartial from './components/form/login-form/login-form.hbs?raw';
import registerFormPartial from './components/form/register-form/register-form.hbs?raw';
import settingsFormPartial from './components/form/settings-form/settings-form.hbs?raw';
import passwordFormPartial from './components/form/password-form/password-form.hbs?raw';

import chatHeaderPartial from './components/chat/chat-header/chat-header.hbs?raw';
import chatItemPartial from './components/chat/chat-item/chat-item.hbs?raw';
import chatWindowPartial from './components/chat/chat-window/chat-window.hbs?raw';
import chatContentPartial from './components/chat/chat-content/chat-content.hbs?raw';
import messagePartial from './components/chat/message/message.hbs?raw';
import messageInputPartial from './components/chat/message-input/message-input.hbs?raw';
import chatInfoPartial from './components/chat/chat-info/chat-info.hbs?raw';

import avatarUploadPartial from './components/settings/avatar-upload/avatar-upload.hbs?raw';
import settingsContentPartial from './components/settings/settings-content/settings-content.hbs?raw';
import settingsAvatarContentPartial
    from './components/settings/settings-avatar-content/settings-avatar-content.hbs?raw';
import settingsPasswordContentPartial
    from './components/settings/settings-password-content/settings-password-content.hbs?raw';

import toastPartial from './components/toast/toast.hbs?raw';

import {chats} from './mocks/chats.js';
import {truncate} from './helpers/truncate.js';
import {formatTime} from './helpers/formatTime.js';
import {auth} from './auth.js';
import {showError, showSuccess} from './utils/notifications.js';

Handlebars.registerHelper('truncate', truncate);
Handlebars.registerHelper('formatTime', formatTime);
Handlebars.registerHelper('gt', function (a, b, options) {
    return a > b ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});
Handlebars.registerHelper('lookup', function (obj, key, prop) {
    return obj && obj[key] && obj[key][prop] ? obj[key][prop] : '';
});

Handlebars.registerPartial('login-form', loginFormPartial);
Handlebars.registerPartial('register-form', registerFormPartial);
Handlebars.registerPartial('settings-form', settingsFormPartial);
Handlebars.registerPartial('avatar-upload', avatarUploadPartial);
Handlebars.registerPartial('password-form', passwordFormPartial);
Handlebars.registerPartial('avatar', avatarPartial);
Handlebars.registerPartial('chat-header', chatHeaderPartial);
Handlebars.registerPartial('chat-item', chatItemPartial);
Handlebars.registerPartial('chat-window', chatWindowPartial);
Handlebars.registerPartial('message', messagePartial);
Handlebars.registerPartial('message-input', messageInputPartial);
Handlebars.registerPartial('sidebar-header', sidebarHeaderPartial);
Handlebars.registerPartial('back-icon', backIconPartial);
Handlebars.registerPartial('settings-icon', settingsIconPartial);
Handlebars.registerPartial('chat-icon', chatIconPartial);
Handlebars.registerPartial('edit-icon', editIconPartial);
Handlebars.registerPartial('upload-icon', uploadIconPartial);
Handlebars.registerPartial('person-add-icon', personAddIconPartial);
Handlebars.registerPartial('search-icon', searchIconPartial);
Handlebars.registerPartial('menu-icon', menuIconPartial);
Handlebars.registerPartial('check-icon', checkIconPartial);
Handlebars.registerPartial('check-read-icon', checkReadIconPartial);
Handlebars.registerPartial('attach-file-icon', attachFileIconPartial);
Handlebars.registerPartial('sentiment-satisfied-icon', sentimentSatisfiedIconPartial);
Handlebars.registerPartial('send-icon', sendIconPartial);
Handlebars.registerPartial('push-pin-icon', pushPinIconPartial);
Handlebars.registerPartial('chat-content', chatContentPartial);
Handlebars.registerPartial('chat-info', chatInfoPartial);
Handlebars.registerPartial('settings-content', settingsContentPartial);
Handlebars.registerPartial('settings-avatar-content', settingsAvatarContentPartial);
Handlebars.registerPartial('settings-password-content', settingsPasswordContentPartial);
Handlebars.registerPartial('toast', toastPartial);

function prepareMessages(messages) {
    if (!messages || messages.length === 0) return [];

    const sorted = [...messages].sort((a, b) => new Date(a.time) - new Date(b.time));
    const result = [];
    let lastDate = null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    sorted.forEach((msg) => {
        const msgDate = new Date(msg.time);
        const dateKey = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());

        if (!lastDate || dateKey.getTime() !== lastDate.getTime()) {
            lastDate = dateKey;
            let label;
            if (dateKey.getTime() === today.getTime()) {
                label = 'Сегодня';
            } else if (dateKey.getTime() === yesterday.getTime()) {
                label = 'Вчера';
            } else {
                label = msgDate.toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'});
            }
            result.push({...msg, showDate: true, dateLabel: label});
        } else {
            result.push({...msg, showDate: false});
        }
    });

    return result;
}

function checkUserData() {
    const currentUser = auth.getCurrentUser();
    if (currentUser && !currentUser.display_name) {
        const displayName = auth.generateDisplayName(currentUser);
        auth.updateProfile({display_name: displayName});
    }
}

function renderMainApp(activeChatId = null) {
    checkUserData();
    const currentUser = auth.getCurrentUser();
    const activeChat = activeChatId ? chats.find(c => c.id === activeChatId) : null;
    const messages = activeChat ? prepareMessages(activeChat.messages) : [];
    const template = Handlebars.compile(mainLayout);
    const contentTemplate = Handlebars.compile('{{> chat-content}}');
    const content = contentTemplate({chats, currentUser, chat: activeChat, messages});
    document.getElementById('root').innerHTML = template({chats, currentUser, content, activeChatId});
}

function renderChatInfoPage(chatId) {
    checkUserData();
    const currentUser = auth.getCurrentUser();
    const activeChat = chats.find(c => c.id === chatId);

    if (!activeChat) {
        navigateTo('/');
        return;
    }

    const template = Handlebars.compile(mainLayout);
    const contentTemplate = Handlebars.compile('{{> chat-info chat=chat currentUser=currentUser}}');
    const content = contentTemplate({chat: activeChat, currentUser});
    document.getElementById('root').innerHTML = template({chats, currentUser, content, activeChatId: chatId});
}

function render404Page() {
    const template = Handlebars.compile(error404Layout);
    document.getElementById('root').innerHTML = template({});
}

function render500Page() {
    const template = Handlebars.compile(error500Layout);
    document.getElementById('root').innerHTML = template({});
}

function renderLoginPage() {
    const template = Handlebars.compile(loginLayout);
    document.getElementById('root').innerHTML = template({});

    setTimeout(() => {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', handleLogin);
        }

        const registerLink = document.querySelector('a[href="/register"]');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('/register');
            });
        }
    }, 0);
}

function renderRegisterPage() {
    const template = Handlebars.compile(registerLayout);
    document.getElementById('root').innerHTML = template({});

    setTimeout(() => {
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', handleRegister);
            const passwordConfirm = form.querySelector('#password_confirm');
            if (passwordConfirm) {
                passwordConfirm.addEventListener('input', validatePasswords);
            }
        }

        const loginLink = document.querySelector('a[href="/login"]');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('/login');
            });
        }
    }, 0);
}

function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const login = form.login.value;
    const password = form.password.value;

    const result = auth.login(login, password);

    if (result.success) {
        navigateTo('/');
    } else {
        showError(result.error);
    }
}

function handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());

    if (!auth.validatePasswords(userData.password, userData.password_confirm)) {
        const errorElement = document.getElementById('passwordError');
        if (errorElement) {
            errorElement.textContent = 'Пароли не совпадают';
        }
        return;
    }

    const result = auth.register(userData);

    if (result.success) {
        navigateTo('/');
    } else {
        showError(result.error);
    }
}

function validatePasswords() {
    const form = document.getElementById('registerForm');
    const password = form.password.value;
    const confirmPassword = form.password_confirm.value;
    const errorElement = document.getElementById('passwordError');

    if (confirmPassword && password !== confirmPassword) {
        errorElement.textContent = 'Пароли не совпадают';
    } else {
        errorElement.textContent = '';
    }
}

function renderSettingsPage() {
    const currentUser = auth.getCurrentUser();
    const template = Handlebars.compile(mainLayout);
    const contentTemplate = Handlebars.compile('{{> settings-content}}');
    const content = contentTemplate({currentUser});
    document.getElementById('root').innerHTML = template({chats, currentUser, content, activeChatId: null});

    setTimeout(() => {
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', handleSettingsUpdate);
        }

        const accountForm = document.getElementById('accountForm');
        if (accountForm) {
            accountForm.addEventListener('submit', handleSettingsUpdate);
        }

        const saveLink = document.getElementById('saveSettings');
        if (saveLink) {
            saveLink.addEventListener('click', (e) => {
                e.preventDefault();
                handleSettingsUpdate(e);
            });
        }

        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Вы уверены, что хотите выйти?')) {
                    auth.logout();
                    navigateTo('/login');
                }
            });
        }

        const generateBtn = document.getElementById('generateDisplayName');
        if (generateBtn) {
            generateBtn.addEventListener('click', handleGenerateDisplayName);
        }
    }, 0);
}

function renderSettingsAvatarPage() {
    const currentUser = auth.getCurrentUser();
    const template = Handlebars.compile(mainLayout);
    const contentTemplate = Handlebars.compile('{{> settings-avatar-content}}');
    const content = contentTemplate({currentUser});
    document.getElementById('root').innerHTML = template({chats, currentUser, content, activeChatId: null});

    setTimeout(() => {
        const form = document.getElementById('avatarUploadForm');
        if (form) {
            form.addEventListener('submit', handleAvatarUpload);
        }
    }, 0);
}

function renderSettingsPasswordPage() {
    const currentUser = auth.getCurrentUser();
    const template = Handlebars.compile(mainLayout);
    const contentTemplate = Handlebars.compile('{{> settings-password-content}}');
    const content = contentTemplate({currentUser});
    document.getElementById('root').innerHTML = template({chats, currentUser, content, activeChatId: null});

    setTimeout(() => {
        const form = document.getElementById('passwordForm');
        if (form) {
            form.addEventListener('submit', handlePasswordChange);

            const newPasswordConfirm = form.querySelector('#new_password_confirm');
            if (newPasswordConfirm) {
                newPasswordConfirm.addEventListener('input', validateNewPasswords);
            }
        }
    }, 0);
}

function handleSettingsUpdate(e) {
    e.preventDefault();

    const settingsForm = document.getElementById('settingsForm');
    const accountForm = document.getElementById('accountForm');

    const formData = new FormData(settingsForm);
    const accountData = new FormData(accountForm);

    const updatedData = {
        ...Object.fromEntries(formData.entries()),
        ...Object.fromEntries(accountData.entries())
    };

    const result = auth.updateProfile(updatedData);

    if (result.success) {
        showSuccess('Настройки сохранены');
        renderMainApp();
    } else {
        showError(result.error);
    }
}

function handleGenerateDisplayName() {
    const currentUser = auth.getCurrentUser();
    const newDisplayName = auth.generateDisplayName(currentUser);

    const displayNameInput = document.getElementById('display_name');
    if (displayNameInput) {
        displayNameInput.value = newDisplayName;
        displayNameInput.removeAttribute('readonly');
        displayNameInput.setAttribute('readonly', 'true');
    }
}

function handleAvatarUpload(e) {
    e.preventDefault();
    showSuccess('Аватар успешно загружен');
    window.history.back();
}

function handlePasswordChange(e) {
    e.preventDefault();
    const form = e.target;
    const newPassword = form.new_password.value;
    const confirmPassword = form.new_password_confirm.value;

    if (newPassword !== confirmPassword) {
        showError('Пароли не совпадают');
        return;
    }

    if (newPassword.length < 6) {
        showError('Пароль должен содержать минимум 6 символов');
        return;
    }

    showSuccess('Пароль успешно изменен');
    window.history.back();
}

function validateNewPasswords() {
    const form = document.getElementById('passwordForm');
    if (!form) return;

    const newPassword = form.new_password.value;
    const confirmPassword = form.new_password_confirm.value;
    const errorElement = document.getElementById('passwordError');

    if (confirmPassword && newPassword !== confirmPassword) {
        errorElement.textContent = 'Пароли не совпадают';
    } else {
        errorElement.textContent = '';
    }
}

function getCurrentPath() {
    return window.location.pathname;
}

function parseChatPath(path) {
    const match = path.match(/^\/chat\/(\d+)$/);
    if (match) return {chatId: parseInt(match[1], 10), info: false};
    const infoMatch = path.match(/^\/chat\/(\d+)\/info$/);
    if (infoMatch) return {chatId: parseInt(infoMatch[1], 10), info: true};
    return null;
}

export function navigateTo(url) {
    window.history.pushState({}, '', url);
    renderApp();
}

function handleLinkClick(e) {
    const link = e.target.closest('a');
    if (link) {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#')) return;

        e.preventDefault();
        navigateTo(href);
        return;
    }

    const btn = e.target.closest('[data-navigate]');
    if (btn) {
        e.preventDefault();
        navigateTo(btn.getAttribute('data-navigate'));
    }
}

export function initNavigation() {
    document.addEventListener('click', handleLinkClick);
    window.addEventListener('popstate', () => renderApp());
}

export function renderApp() {
    try {
        const path = getCurrentPath();
        const isAuthenticated = auth.isAuthenticated();

        if (!isAuthenticated) {
            if (path === '/register') {
                renderRegisterPage();
            } else {
                renderLoginPage();
            }
        } else {
            const chatPath = parseChatPath(path);
            if (chatPath) {
                if (chatPath.info) {
                    renderChatInfoPage(chatPath.chatId);
                } else {
                    renderMainApp(chatPath.chatId);
                }
            } else if (path === '/') {
                renderMainApp();
            } else if (path === '/settings') {
                renderSettingsPage();
            } else if (path === '/settings/avatar') {
                renderSettingsAvatarPage();
            } else if (path === '/settings/password') {
                renderSettingsPasswordPage();
            } else if (path === '/login' || path === '/register') {
                navigateTo('/');
            } else {
                render404Page();
            }
        }
    } catch (error) {
        console.error('Error rendering app:', error);
        render500Page();
    }
}
