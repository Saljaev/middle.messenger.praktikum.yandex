# My Chat

## Оглавление

- [Обзор](#обзор)
- [Реализованные страницы](#реализованные-страницы)
- [Архитектура проекта](#архитектура-проекта)
- [Сборка и запуск](#сборка-и-запуск)
- [Просмотр проекта](#просмотр-проекта)
- [Линтинг](#линтинг)
- [Update Notes](#update-notes)

---

## Обзор
Это мой образовательный проект, в котором я разрабатываю клиентское веб-приложение мессенджера с использованием шаблонизатора Handlebars и препроцессора Sass. Приложение представляет собой SPA (Single Page Application) с клиентской маршрутизацией, mock-авторизацией и полностью компонентной архитектурой.

Основные решения:
- **TypeScript**
- **Vite** — сборка, dev-сервер и превью
- **Handlebars** — шаблонизация с partials и helpers
- **Sass (SCSS)** — модульная стилизация
- **MVC** — разделение на Model, View (Block), Controller

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
│   ├── base/           # Button, Input, Icon (атомарные компоненты)
│   ├── chat/           # ChatWindow, ChatHeader, Message, MessageForm,
│   │                   # ChatInfoContent, ChatEmpty, MainLayout
│   ├── form/           # Form, LoginForm, RegisterForm, SettingsForm,
│   │                   # SettingsPasswordForm, SettingsAvatarForm, MessageForm
│   └── settings/       # SettingsContent, SettingsPasswordContent,
│                       # SettingsAvatarContent
├── controllers/        # AuthController, ChatsController (MVC)
├── core/               # Block, EventBus, Model, Controller
├── helpers/            # formatTime
├── mocks/              # chats.ts, users.ts
├── models/             # AuthModel, ChatsModel (MVC)
├── pages/              # LoginPage, RegisterPage, Error404Page, Error500Page
├── styles/             # variables, mixins, base, layout, forms, auth, settings
│   └── index.scss      # агрегатор стилей
├── types/              # глобальные типы и интерфейсы форм
├── utils/              # validation, notifications, messages
├── App.ts              # роутер, рендеринг страниц
└── main.ts             # точка входа
```

---

## Сборка и запуск

Рекомендуется использовать версию NodeJS не ниже `22.15.17`

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
# Проверка JS/TS
npm run lint

# Автоисправление JS/TS
npm run lint:fix

# Проверка стилей (SCSS)
npm run lint:css

# Автоисправление стилей
npm run lint:css:fix

# Проверка форматирования (Prettier)
npm run format

# Автоисправление форматирования
npm run format:fix

# Проверка всего сразу (lint + css + format)
npm run check:all

# Автоисправление всего сразу
npm run check:all:fix

# Проверка типов TypeScript
npm run type-check
```

---

## Update Notes

### Sprint_2
- Смигрированы многие компоненты с чистого JS на TS. Предыдущие компоненты с шаблонизатором написаны с использованием **Block**
- Добавлена валидация форм
- Добавлены линтеры и форматтеры
- Добавлены следующие команды в **package.json**:
  - `type-check`
  - `lint`
  - `lint:css`
  - `format`
  - `check:all`

### Sprint_3
- Добавлен компонент роутер
- Интегрировано реальное API
- Добавлен глобальный store с connector
- Убраны моковые данные (чаты, пользователи)
- При интеграции с API были полностью изменена:
  - Форма регистрации
  - Форма авторизации
  - Форма настройки аккаунта, вместе с формой загрузкой аватарки и изменением пароля
  - Список сообщений
  - Информация о чате, с возможностью добавления и удаления пользователей
