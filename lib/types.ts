export type ProfileKey = 'health' | 'body' | 'energy';

export interface Profile {
    key: ProfileKey;
    badge: string;
    colorVar: string;      // CSS/Tailwind токен, напр. '--color-green'
    title: string;
    body: string;
    offerTitle: string;
    offerText: string;
    tgMessage: string;     // предзаполненный текст для Telegram deep link
}

export interface QuizOption {
    label: string;
    sub: string;
    scores: ProfileKey;    // какой профиль получает +1
}

export interface QuizQuestion {
    id: number;
    title: string;
    options: QuizOption[];
}

export interface BridgeContent {
    question: string;
    cta: string;
    href: string;          // якорь, напр. '#map'
}

export interface SiteContent {
    meta: {
        title: string; description: string;
        ogTitle: string; ogDescription: string;
    };
    hero: {
        kicker: string; h1: string; sub: string;
        pills: string[]; cta: string; microcopy: string;
    };
    problem: {
        kicker: string; h2: string;
        cards: { emoji: string; title: string; text: string }[];
        summaryLead: string; summaryRest: string;
    };
    map: {
        kicker: string; h2: string; sub: string;
        center: string;
        points: { name: string; time: string }[];
        caption: string;
    };
    transformation: {
        kicker: string; h2: string;
        before: string[]; bridge: string; after: string;  // after = заголовок колонки
        afterItems: string[];
    };
    quiz: {
        kicker: string; h2: string; sub: string;
        resultNote: string; restart: string;
    };
    objections: {
        kicker: string; h2: string;
        items: { q: string; a: string }[];
    };
    finalCta: {
        kicker: string; h2: string; text: string;
        cta1: string; cta2: string; guarantee: string;
    };
    footer: { name: string; tagline: string };
    stickyCta: string;
}

// ── Состояние квиза (SPEC §4) ──
export interface QuizState {
    step: 0 | 1 | 2 | 3;
    scores: Record<ProfileKey, number>;
    finished: boolean;
    result: ProfileKey | null;
}

// ── Аналитика: типобезопасные цели (SPEC §4, §9.3) ──
export type Goal =
    | 'quiz_start'
    | 'quiz_complete'
    | `lead_click_${ProfileKey}`
    | 'lead_click_direct'
    | 'objection_open';

// ── Фаза 2: payload заявки (не используется в MVP) ──
export interface LeadPayload {
    name: string;
    contact: string;
    profile: ProfileKey;
    source: 'quiz' | 'direct';
}
