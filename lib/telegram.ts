function readUsername(): string {
    const raw = process.env.NEXT_PUBLIC_TG_USERNAME?.trim();
    if (!raw) throw new Error('NEXT_PUBLIC_TG_USERNAME is required');
    return raw;
}

export function buildTelegramLink(message: string): string {
    return `https://t.me/${readUsername()}?text=${encodeURIComponent(message)}`;
}
