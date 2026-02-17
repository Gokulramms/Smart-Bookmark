/**
 * Combines class names
 */
export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

/**
 * Validates if a string is a valid HTTP/HTTPS URL
 */
export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

/**
 * Extracts domain name from URL
 */
export function getDomainFromUrl(url: string): string {
    try {
        const parsed = new URL(url);
        return parsed.hostname;
    } catch {
        return '';
    }
}

/**
 * Generates a favicon URL from a domain
 */
export function getFaviconUrl(url: string): string {
    const domain = getDomainFromUrl(url);
    if (!domain) return '';
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

/**
 * Sanitizes user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Truncates text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Formats a date to a relative time string
 */
export function formatRelativeTime(date: string | Date): string {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return then.toLocaleDateString();
}

/**
 * Debounce function for search and input handlers
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
