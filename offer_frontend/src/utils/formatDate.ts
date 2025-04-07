export const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
};
