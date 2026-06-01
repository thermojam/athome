export type ProfileKey = 'health' | 'body' | 'energy';

// v3.3 §5.5: иконки болей — ключи Lucide-компонентов
// v3.3 переименовывает: bone → activity, repeat → trending-down (см. landing-final.html стр.305-307)
export type ProblemIcon =
    | 'activity'
    | 'trending-down'
    | 'battery-low'
    // DEPRECATED — sprint 3 (старые ключи, переезжают на новые)
    | 'bone'
    | 'repeat';

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
    accentVar: '--color-cyan' | '--color-violet' | '--color-green' | '--color-pink' | '--color-orange';
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
    /** DEPRECATED — sprint 3: убирается из v3.3 (см. SPEC §9.2) */
    profileHint?: ProfileKey;
    /** DEPRECATED — sprint 3: убирается из v3.3 (см. SPEC §9.2) */
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
        /** v3.3: левая часть H1 (две строки через \n) */
        h1Lead: string;
        /** v3.3: cyan-акцентная строка H1 */
        h1Accent: string;
        sub: string;
        cta: string;
        /** v3.3: текст вторичной CTA (ведёт на #booking) */
        ctaSecondary: string;
        microcopy: string;
        /** DEPRECATED — sprint 3: пилюли убраны в v3.3 (см. landing-final.html — hero без .pill-row) */
        pills?: string[];
        /** DEPRECATED — sprint 3: заменено на h1Lead + h1Accent */
        h1?: string;
    };
    problem: {
        kicker: string;
        h2: string;
        cards: {
            /** v3.3: новый ключ Lucide */
            iconKey: ProblemIcon;
            title: string;
            text: string;
            /** DEPRECATED — sprint 3 (старое имя поля) */
            icon?: ProblemIcon;
        }[];
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
        /** v3.3: подпись под картой (см. landing-final стр.346) */
        caption: string;
    };
    transformation: {
        kicker: string;
        h2: string;
        /** v3.3: lead-абзац над путём из 4 шагов */
        lead: string;
        /** v3.3: 4 шага вместо before/bridge/after */
        steps: {
            tone: 's1' | 's2' | 's3' | 's4';
            iconKey: 'clock' | 'circle-plus' | 'zap' | 'circle-check-big';
            week: string;
            title: string;
            text: string;
        }[];
        /** DEPRECATED — sprint 3 (BAB-колонки) */
        before?: string[];
        /** DEPRECATED — sprint 3 */
        bridge?: string;
        /** DEPRECATED — sprint 3 */
        after?: string;
        /** DEPRECATED — sprint 3 */
        afterItems?: string[];
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
        /** v3.3: метаданные слота в шапке карточки */
        slotMeta: string;
        /** v3.3: бейдж «свободно» */
        badgeFree: string;
        /** v3.3: подпись над сеткой чипов */
        pickLabel: string;
        ctaLabel: string;
        honestyNote: string;
        /** DEPRECATED — sprint 3 */
        body?: string;
        /** DEPRECATED — sprint 3 */
        pillGym?: string;
    };
    objections: {
        kicker: string;
        h2: string;
        items: { q: string; a: string }[];
    };
    finalCta: {
        kicker: string;
        h2: string;
        /** v3.3: подзаголовок-абзац */
        lead: string;
        cta1: string;
        cta2: string;
        /** v3.3: микрокопи под кнопками */
        microcopy: string;
        /** DEPRECATED — sprint 3 */
        text?: string;
        /** DEPRECATED — sprint 3 */
        guarantee?: string;
    };
    about: {
        kicker: string;
        h2: string;
        intro: string;
        facts: { num: string; txt: string }[];
        freeMeetingNote: string;
        cta1: string;
        cta2: string;
        microcopy: string;
        badge: string;
        photo: { src: string; alt: string };
    };
    footer: {
        /** v3.3: display-заголовок в футере (см. landing-final стр.460) */
        brand: string;
        name: string;
        tagline: string;
    };
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
