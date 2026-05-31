export type ProfileKey = 'health' | 'body' | 'energy';

// ── v3.1 §5.5: иконки болей — ключи Lucide-компонентов ──
export type ProblemIcon = 'bone' | 'repeat' | 'battery-low';

export interface Profile {
    key: ProfileKey;
    badge: string;
    colorVar: string;
    title: string;
    body: string;
    offerTitle: string;
    offerText: string;
    tgMessage: string;
}

export interface QuizOption {
    label: string;
    sub: string;
    scores: ProfileKey;
}

export interface QuizQuestion {
    id: number;
    title: string;
    options: QuizOption[];
}

export interface BridgeContent {
    question: string;
    cta: string;
    href: string;
}

// ── НОВОЕ: точка ЖК на карте (SPEC §8) ──
export interface MapPoint {
    name: string;
    walkMinutes: number;
    /** CSS-переменная цвета акцента — определяет цвет dot/pin/glow */
    accentVar: '--color-cyan' | '--color-violet' | '--color-green' | '--color-pink';
    /** Координаты пина в % от viewbox SVG (0..100) */
    x: number;
    y: number;
}

// ── НОВОЕ: слот записи (SPEC §9) ──
// status — только 'free': busy не возим в DOM на MVP, чтобы не врать пользователю.
export interface Slot {
    id: string;
    day: string;
    time: string;
    label: string;
    status: 'free';
    profileHint?: ProfileKey;
    walkMinutes?: number;
}

export interface SiteContent {
    meta: {
        title: string;
        description: string;
        ogTitle: string;
        ogDescription: string;
    };
    hero: {
        kicker: string;
        h1: string;
        sub: string;
        pills: string[];
        cta: string;
        microcopy: string;
    };
    problem: {
        kicker: string;
        h2: string;
        cards: { icon: ProblemIcon; title: string; text: string }[];
        summaryLead: string;
        summaryRest: string;
    };
    // ── МИГРАЦИЯ: новая структура для LocationMap ──
    map: {
        kicker: string;
        h2: string;
        body: string;
        gymLabel: string;
        points: MapPoint[];
    };
    transformation: {
        kicker: string;
        h2: string;
        before: string[];
        bridge: string;
        after: string;
        afterItems: string[];
    };
    quiz: {
        kicker: string;
        h2: string;
        sub: string;
        resultNote: string;
        restart: string;
    };
    // ── НОВОЕ: контент BookingSlot ──
    booking: {
        kicker: string;
        h2: string;
        body: string;
        pillGym: string;
        ctaLabel: string;
        honestyNote: string;
    };
    objections: {
        kicker: string;
        h2: string;
        items: { q: string; a: string }[];
    };
    finalCta: {
        kicker: string;
        h2: string;
        text: string;
        cta1: string;
        cta2: string;
        guarantee: string;
    };
    footer: { name: string; tagline: string };
    stickyCta: string;
}

export interface QuizState {
    step: number;
    scores: Record<ProfileKey, number>;
    finished: boolean;
    result: ProfileKey | null;
}

// ── Аналитика: добавлены slot_select / slot_take ──
export type Goal =
    | 'quiz_start'
    | 'quiz_complete'
    | `lead_click_${ProfileKey}`
    | 'lead_click_direct'
    | 'slot_select'
    | 'slot_take'
    | 'objection_open';

// ── Фаза 2: payload заявки (не используется в MVP) ──
export interface LeadPayload {
    name: string;
    contact: string;
    profile?: ProfileKey;
    slotId?: string;
    source: 'quiz' | 'direct' | 'slot';
}
