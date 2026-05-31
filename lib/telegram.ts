const FALLBACK_USERNAME = 'placeholder';

function readUsername(): string {
    const raw = process.env.NEXT_PUBLIC_TG_USERNAME;
    return raw && raw.length > 0 ? raw : FALLBACK_USERNAME;
}

export function buildTelegramLink(message: string): string {
    return `https://t.me/${readUsername()}?text=${encodeURIComponent(message)}`;
}
