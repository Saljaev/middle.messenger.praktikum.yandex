import {MockMessage, MockChat} from '../mocks/chats';
import {formatTime} from '../helpers/formatTime';

export interface PreparedMessage {
    text: string;
    time: string;
    isOutgoing: boolean;
    isRead: boolean;
    senderName: string;
    senderAvatar: string;
    showDate: boolean;
    dateLabel: string;
}

export function prepareMessages(
    messages: MockMessage[],
    chat: MockChat,
    currentUserId: number,
): PreparedMessage[] {
    if (!messages || messages.length === 0) {
        return [];
    }

    const sorted = [...messages].sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    );

    const result: PreparedMessage[] = [];
    let lastDate: Date | null = null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    sorted.forEach((msg) => {
        const msgDate = new Date(msg.time);
        const dateKey = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());

        let showDate = false;
        let dateLabel = '';

        if (!lastDate || dateKey.getTime() !== lastDate.getTime()) {
            lastDate = dateKey;
            showDate = true;

            if (dateKey.getTime() === today.getTime()) {
                dateLabel = 'Сегодня';
            } else if (dateKey.getTime() === yesterday.getTime()) {
                dateLabel = 'Вчера';
            } else {
                dateLabel = msgDate.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                });
            }
        }

        const isOutgoing = msg.senderId === currentUserId;
        const member = chat.members?.[msg.senderId];
        const senderName = isOutgoing ? '' : (msg.senderName ?? member?.name ?? '');
        const senderAvatar = isOutgoing ? '' : (member?.avatarUrl ?? '');

        result.push({
            text: msg.text,
            time: formatTime(msg.time, 'time'),
            isOutgoing,
            isRead: msg.isRead,
            senderName,
            senderAvatar,
            showDate,
            dateLabel,
        });
    });

    return result;
}
