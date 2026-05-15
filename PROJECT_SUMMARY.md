# Telegram-like Chat Application (Handlebars)

## Overview
A Telegram-inspired chat application built with Vanilla JavaScript, Handlebars templating, and SCSS. Features a two-column layout with chat list on the left and chat window on the right.

## Features
- **Telegram-like UI**: Two-column layout with sidebar and main chat area
- **Handlebars Components**: Modular, reusable templates
- **Custom Helpers**: Text truncation and time formatting
- **Mock Data**: Ready for testing with sample chats and messages
- **Responsive Design**: Works on desktop screens

## Project Structure

```
src/
├── components/           # Handlebars components
│   ├── avatar/          # Avatar component
│   ├── chat-header/     # Chat window header
│   ├── chat-item/       # Individual chat in sidebar
│   ├── chat-window/     # Main chat area
│   ├── message/         # Chat message bubble
│   ├── message-input/   # Message input form
│   └── sidebar-header/  # Sidebar header with user info
├── helpers/             # Handlebars helpers
│   ├── formatTime.js   # Time formatting utility
│   └── truncate.js     # Text truncation utility
├── layouts/             # Layout templates
│   └── main.hbs        # Main app layout
├── mocks/               # Mock data for testing
│   ├── chats.js        # Sample chat data
│   └── user.js         # Current user data
├── styles/             # SCSS styles
│   └── index.scss      # All styles in one file
├── main.js             # App entry point
└── render.js           # Template rendering logic

index.html              # Main HTML file
vite.config.js         # Vite configuration
package.json           # Dependencies and scripts
```

## Components

### 1. Avatar (`components/avatar/avatar.hbs`)
- Displays user's avatar image
- Supports different sizes: tiny, small, medium, large, xlarge

```hbs
{{> avatar url="..." name="..." size="medium"}}
```

### 2. Chat Item (`components/chat-item/chat-item.hbs`)
- Shows chat preview in sidebar
- Displays: avatar, name, last message, time, unread count
- Shows online status, pinned indicator
- Truncates long messages

```hbs
{{> chat-item chat=this}}
```

### 3. Sidebar Header (`components/sidebar-header/sidebar-header.hbs`)
- User profile section with avatar and name
- "New chat" button
- Settings link
- Shows online status

### 4. Chat Header (`components/chat-header/chat-header.hbs`)
- Displays current chat name and status
- Shows member count for group chats
- Action buttons: add members, search, menu

### 5. Message (`components/message/message.hbs`)
- Individual message bubble
- Supports incoming/outgoing messages
- Shows read status (✓/✓✓)
- Displays sender name in group chats
- Formatted timestamps

```hbs
{{> message type="outgoing" text="..." time="..." isRead=true}}
```

### 6. Message Input (`components/message-input/message-input.hbs`)
- Text input field with placeholder
- Send button
- Attachment button
- Emoji button

### 7. Chat Window (`components/chat-window/chat-window.hbs`)
- Main chat area
- Displays message history
- Shows empty state when no chat selected
- Contains message input at bottom

## Custom Helpers

### Truncate
Truncates text to specified length:
```js
{{truncate text 45}}
```

### Format Time
Formats timestamps for display:
```js
{{formatTime timestamp}}
```
Examples:
- "Только что"
- "5 мин назад"
- "2 часа назад"
- "Вчера" / "12 янв"

## Mock Data

### Chats (`mocks/chats.js`)
Sample data includes:
- Direct chat with Alice (unread messages)
- Group chat "Team Project" with 5 members
- Direct chat with Maxim (read messages)

Each chat contains:
- Basic info (id, name, avatar)
- Online status
- Last message preview
- Message history

### Current User (`mocks/user.js`)
Sample user profile:
- Name: Ivan Ivanov
- Login: ivan
- Avatar, status, etc.

## Styles

SCSS variables defined for easy customization:
- Colors (primary, grays)
- Spacing (8px grid)
- Typography
- Component sizes (sidebar width: 420px)

Design features:
- Telegram-inspired color scheme (#0088cc)
- Rounded message bubbles
- Shadow effects
- Smooth hover transitions
- Custom scrollbars
- Status indicators (online, read)

## Build & Run

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **Vite**: Build tool and dev server
- **Handlebars**: Template engine
- **SCSS**: CSS preprocessor
- **Vanilla JS**: No frameworks

## Future Enhancements

- [ ] Login/Registration pages
- [ ] Settings page
- [ ] File uploads
- [ ] Emoji picker
- [ ] Voice messages
- [ ] Search functionality
- [ ] Mobile responsiveness
- [ ] Real API integration
- [ ] WebSocket for real-time updates

## Notes

- Ready for API integration (structure in place)
- WebSocket client can be added for real-time messaging
- All data currently mocked for demonstration
- Components are modular and reusable
