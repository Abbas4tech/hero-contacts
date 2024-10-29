export function timeSince(dateString: string, prefix = 'Updated'): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600)
        return `${Math.floor(seconds / 60)} min${seconds < 120 ? '' : 's'} ago`;
    if (seconds < 86400)
        return `${Math.floor(seconds / 3600)} hr${
            seconds < 7200 ? '' : 's'
        } ago`;
    if (seconds < 172800) return `${prefix} yesterday`;
    if (seconds < 604800)
        return `${prefix} ${Math.floor(seconds / 86400)} day${
            seconds < 172800 * 2 ? '' : 's'
        } ago`;

    return `${prefix} on ${date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
    })}`;
}
