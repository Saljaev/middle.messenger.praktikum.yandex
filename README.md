# My Chat

## Оглавление

- [Обзор](#обзор)
- [Реализованные страницы](#реализованные-страницы)
- [Архитектура проекта](#архитектура-проекта)
- [Сборка и запуск](#сборка-и-запуск)
- [Просмотр проекта](#просмотр-проекта)
- [Линтинг](#линтинг)

---

## Обзор
Это мой образовательный проект, в котором я разрабатываю клиентское веб-приложение мессенджера с использованием шаблонизатора Handlebars и препроцессора Sass. Приложение представляет собой SPA (Single Page Application) с клиентской маршрутизацией, mock-авторизацией и полностью компонентной архитектурой.

Основные решения:
- **Vite** — сборка, dev-сервер и превью
- **Handlebars** — шаблонизация с partials и helpers
- **Sass (SCSS)** — модульная стилизация рядом с компонентами
- **Mock-авторизация** — localStorage, пользователь `test`/`123456`

---

## Реализованные страницы

| Страница | Маршрут | Описание |
|----------|---------|----------|
| Авторизация | `/login` | Поля `login`, `password` |
| Регистрация | `/register` | Поля `first_name`, `second_name`, `login`, `email`, `password`, `phone` |
| Список чатов | `/` | Список диалогов, выбор активного чата |
| Окно чата | `/chat/:id` | История сообщений, поле ввода, статусы прочтения |
| Информация о чате | `/chat/:id/info` | Участники группового чата |
| Настройки | `/settings` | Профиль, личная и аккаунтная информация |
| Аватар | `/settings/avatar` | Загрузка аватара |
| Пароль | `/settings/password` | Изменение пароля |
| 404 | любой несуществующий | Страница не найдена |
| 500 | — | Страница ошибки сервера (рендерится при исключениях) |

---

## Архитектура проекта

```
src/
├── components/
│   ├── base/           # avatar, icons (Google Material Symbols)
│   ├── chat/           # sidebar-header, chat-item, chat-window,
│   │                   # chat-header, chat-info, message, message-input
│   ├── form/           # login-form, register-form, settings-form, password-form
│   ├── settings/       # settings-content, avatar-upload, settings-avatar-content,
│   │                   # settings-password-content
│   └── toast/          # toast-уведомления
├── layouts/            # main, login, register, error-404, error-500
├── styles/             # variables, mixins, base, layout, forms, auth, settings
│   └── index.scss      # агрегатор: только @use
├── mocks/              # chats.js, users.js
├── helpers/            # formatTime.js, truncate.js
├── utils/              # notifications.js (toast)
├── auth.js             # mock-авторизация через localStorage
├── render.js           # роутер, рендеринг, регистрация partials/helpers
└── main.js             # точка входа
```

---

## Сборка и запуск

```bash
# Установка зависимостей
npm install

# Dev-сервер на http://localhost:3000
npm run dev

# Сборка для продакшена
npm run build

# Превью собранного проекта на http://localhost:3000
npm run preview

# Сборка + превью
npm start
```

**Конфигурация Vite:**
- Порт: `3000` (`strictPort: true`)
- Алиасы: `@/` → `src/`
- SCSS `loadPaths`: `src/styles` (короткие импорты `@use 'variables'`)
- Handlebars-плагин с `partialDirectory: src/components`

---

## Просмотр проекта
Проект загружен на сайт Netlify и доступен по [ссылке](https://reliable-croissant-aa64ab.netlify.app/)

На сайте представлена версия кода с ветки **deploy**
___

## Линтинг

```bash
# Проверка кода
npm run lint

# Автоисправление
npm run lint:fix
```
