export function formatTime(
    time: string | number | Date,
    mode: 'relative' | 'time' = 'relative',
): string {
    if (!time) return '';

    const date = new Date(time);

    if (mode === 'time') {
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    const now = new Date();

    const isSameDay = (d1: Date, d2: Date): boolean =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    const isYesterday = (d1: Date, d2: Date): boolean => {
        const yesterday = new Date(d2);
        yesterday.setDate(yesterday.getDate() - 1);
        return isSameDay(d1, yesterday);
    };

    const isDayBeforeYesterday = (d1: Date, d2: Date): boolean => {
        const dayBefore = new Date(d2);
        dayBefore.setDate(dayBefore.getDate() - 2);
        return isSameDay(d1, dayBefore);
    };

    if (isSameDay(date, now)) {
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    if (isYesterday(date, now)) {
        return 'Вчера';
    }

    if (isDayBeforeYesterday(date, now)) {
        return 'Позавчера';
    }

    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
    });
}
