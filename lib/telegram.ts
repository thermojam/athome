const TG_USERNAME = process.env.NEXT_PUBLIC_TG_USERNAME!;  // ⚠️ задать в .env.local

export function buildTelegramLink(message: string): string {
    return `https://t.me/${TG_USERNAME}?text=${encodeURIComponent(message)}`;
}
