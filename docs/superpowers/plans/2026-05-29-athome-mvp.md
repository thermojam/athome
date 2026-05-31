# MVP лендинга «Тренер у дома» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:
> executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать production-ready MVP лендинга (Next 16 App Router) с квизом-сегментацией, Telegram deep link,
Яндекс.Метрикой и полным набором тестов (Vitest + RTL + Playwright) по SPEC.md v2.0.

**Architecture:** Server-first рендеринг (SSG) с минимальной клиентской поверхностью: `'use client'` только на Quiz,
Objections (аккордеон), YandexMetrika, TrackedLink (CTA-обёртка с трекингом), Reveal (IntersectionObserver). Доменная
логика (контент, типы, скоринг, telegram-ссылки) изолирована в `lib/`. Дизайн-токены — через `@theme` Tailwind v4 в
`globals.css`, дисплейный шрифт Gerhaus.ttf через `next/font/local`, Nunito + JetBrains Mono через `next/font/google`.

**Tech Stack:** Next.js 16.2.6 · React 19.2 · TypeScript 5 (strict) · Tailwind CSS 4 (через `@tailwindcss/postcss`) ·
Vitest + @testing-library/react · Playwright · `next/og` для opengraph-image · Яндекс.Метрика через `next/script`.

**Источники истины:**

- SPEC: [`SPEC.md`](../../../SPEC.md) v2.0
- Дизайн: [`docs/superpowers/specs/2026-05-29-athome-mvp-design.md`](../specs/2026-05-29-athome-mvp-design.md)
- Готовый контент: `lib/quiz-data.ts`, `lib/types.ts`, `lib/quiz-logic.ts`, `lib/telegram.ts`
- Next 16 docs: `node_modules/next/dist/docs/` — **при сомнении в API всегда читать оттуда, не доверять памяти**

**Принципы исполнения:**

- TDD: RED → GREEN → REFACTOR на каждом юните с тестом. Сначала падающий тест, потом минимальная реализация.
- DRY, YAGNI: не добавлять флаги, абстракции, фичи, не описанные в SPEC.
- Частые коммиты: после каждой завершённой задачи. Если задача — пара компонентов, коммит после всех.
- Не править неотносящиеся файлы.

---

## Файловая структура (что и где)

```
app/
├── layout.tsx               (server) lang=ru, шрифты, метадата, YandexMetrika
├── page.tsx                 (server) композиция секций
├── globals.css              @import tailwindcss + @theme токены §5
├── opengraph-image.tsx      (server) ImageResponse из next/og, 1200×630
├── opengraph-image.alt.txt  alt-текст для og-image
├── privacy/page.tsx         (server) шаблон 152-ФЗ
└── api/.gitkeep             пустышка под фазу 2

components/
├── analytics/YandexMetrika.tsx     'use client' — <Script afterInteractive>
├── ui/Pill.tsx                     (server)
├── ui/GlassCard.tsx                (server)
├── ui/Bridge.tsx                   (server)
├── ui/TrackedLink.tsx              'use client'
├── ui/Reveal.tsx                   'use client'
├── ui/StickyCta.tsx                (server)
├── sections/Hero.tsx               (server)
├── sections/Problem.tsx            (server)
├── sections/Map.tsx                (server)
├── sections/Transformation.tsx     (server)
├── sections/FinalCta.tsx           (server)
├── sections/Objections.tsx         'use client'
├── quiz/Quiz.tsx                   'use client'
├── quiz/ProgressBar.tsx            (server)
├── quiz/QuizQuestion.tsx           (server)
└── quiz/QuizResult.tsx             (server)

lib/
├── types.ts                 расширить: QuizState, Goal, LeadPayload
├── quiz-data.ts             ✅ есть, не трогаем
├── quiz-logic.ts            ✅ есть
├── telegram.ts              убрать `!`, добавить fallback
└── analytics.ts             reachGoal(goal: Goal)

tests/
├── setup.ts                 jest-dom matchers
├── lib/telegram.test.ts
├── lib/quiz-logic.test.ts
├── lib/analytics.test.ts
├── components/Quiz.test.tsx
├── components/Objections.test.tsx
└── e2e/
    ├── quiz-flow.spec.ts
    ├── mobile-sticky.spec.ts
    └── reduced-motion.spec.ts

vitest.config.mts
playwright.config.ts
.env.local.example
.gitignore                   проверить (.env*, .next/, /test-results, /playwright-report)
```

---

# Фаза A · Фундамент

## Task 1: Установить dev-зависимости

**Files:** `package.json`

- [ ] **Step 1: Установить тестовые и форматирующие пакеты**

Run:

```bash
npm install -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event \
  vite-tsconfig-paths @playwright/test prettier prettier-plugin-tailwindcss
```

- [ ] **Step 2: Установить браузер для Playwright**

Run:

```bash
npx playwright install chromium
```

Expected: загрузка chromium, выводит «Downloading Chromium» и завершается без ошибок.

- [ ] **Step 3: Проверить, что devDependencies в `package.json` теперь содержит все 11 пакетов**

Run:

```bash
node -e "const p=require('./package.json');['vitest','@vitejs/plugin-react','jsdom','@testing-library/react','@testing-library/dom','@testing-library/jest-dom','@testing-library/user-event','vite-tsconfig-paths','@playwright/test','prettier','prettier-plugin-tailwindcss'].forEach(k=>console.log(k, p.devDependencies[k] ? 'ok' : 'MISSING'))"
```

Expected: каждая строка `<pkg> ok`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add vitest, RTL, playwright, prettier"
```

---

## Task 2: Скрипты `package.json`

**Files:** `package.json` (modify)

- [ ] **Step 1: Заменить блок `scripts`**

В `package.json` секция `"scripts"` сейчас:

```json
"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "eslint"
}
```

Заменить на:

```json
"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "eslint",
"typecheck": "tsc --noEmit",
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"format": "prettier --write ."
}
```

- [ ] **Step 2: Sanity-check, что скрипты работают (без тестов — их ещё нет)**

Run:

```bash
npm run typecheck
```

Expected: проходит без ошибок (текущий код компилируется; если `quiz-logic.ts` падает из-за отсутствующего `QuizState` —
это ожидаемо, починим в Task 8).

Если `typecheck` показывает ошибку «Module has no exported member 'QuizState'» — НЕ исправляем сейчас, оставляем как
известный долг до Task 8.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add typecheck/test/format scripts"
```

---

## Task 3: Vitest config + setup

**Files:**

- Create: `vitest.config.mts`
- Create: `tests/setup.ts`

- [ ] **Step 1: Создать `vitest.config.mts`**

```ts
import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],
        globals: false,
        include: ['tests/**/*.test.{ts,tsx}'],
        exclude: ['tests/e2e/**'],
    },
});
```

- [ ] **Step 2: Создать `tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import {afterEach} from 'vitest';
import {cleanup} from '@testing-library/react';

afterEach(() => {
    cleanup();
});
```

- [ ] **Step 3: Создать smoke-тест, чтобы проверить пайплайн**

Create: `tests/smoke.test.ts`

```ts
import {describe, it, expect} from 'vitest';

describe('smoke', () => {
    it('runs vitest', () => {
        expect(1 + 1).toBe(2);
    });
});
```

- [ ] **Step 4: Запустить vitest**

Run:

```bash
npm test
```

Expected: `1 passed`, выход 0.

- [ ] **Step 5: Удалить smoke-тест**

```bash
rm tests/smoke.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add vitest.config.mts tests/setup.ts
git commit -m "test: configure vitest + RTL setup"
```

---

## Task 4: Playwright config

**Files:** Create `playwright.config.ts`

- [ ] **Step 1: Создать `playwright.config.ts`**

```ts
import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    projects: [
        {name: 'chromium-desktop', use: {...devices['Desktop Chrome']}},
        {name: 'chromium-mobile', use: {...devices['Pixel 7']}},
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
```

- [ ] **Step 2: Дополнить `.gitignore`**

Open `.gitignore` и добавить в конец (если ещё не там):

```
# playwright
/test-results/
/playwright-report/
/playwright/.cache/
```

- [ ] **Step 3: Commit**

```bash
git add playwright.config.ts .gitignore
git commit -m "test: configure playwright (desktop + mobile chromium)"
```

---

## Task 5: Дизайн-токены в `globals.css`

**Files:** `app/globals.css` (rewrite)

Текущий файл содержит дефолт create-next-app — перепишем под токены SPEC §5.

- [ ] **Step 1: Полностью заменить содержимое `app/globals.css`**

```css
@import "tailwindcss";

/* ── Tailwind theme tokens (SPEC §5) ── */
@theme {
    /* Цвет / свет */
    --color-cyan: #2CE6FF;
    --color-violet: #8B5CFF;
    --color-pink: #FF4FD8;
    --color-green: #36FF9D;
    --color-orange: #FF9F43;
    --color-blue: #4D7DFF;

    --color-bg-primary: #0E1117;
    --color-bg2: #151923;
    --color-bg3: #1B2030;

    --color-tx: #E8ECF4;
    --color-tx2: #9AA3B5;
    --color-tx3: #5E6678;

    /* Типографика — алиасим переменные next/font на theme-токены */
    --font-display: var(--font-gerhaus);
    --font-body: var(--font-nunito);
    --font-mono: var(--font-jbm);
}

/* ── Кастомные переменные вне @theme (radii, glass, line, blur) ── */
:root {
    --radius-md: 22px;
    --radius-lg: 30px;
    --radius-xl: 42px;
    --blur-md: 18px;
    --glass: rgba(255, 255, 255, 0.04);
    --line: rgba(255, 255, 255, 0.09);
}

/* ── Глобальный body ── */
html {
    background: var(--color-bg-primary);
    color: var(--color-tx);
}

body {
    background: var(--color-bg-primary);
    color: var(--color-tx);
    font-family: var(--font-body), 'Nunito', 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
}

/* ── Reduced motion: глобально отключаем transition/animation ── */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
    }
}
```

- [ ] **Step 2: Проверить, что Tailwind видит токены (никакой ошибки сборки)**

Run:

```bash
npm run build
```

Expected: успешная сборка (предупреждения про неиспользуемые токены допустимы, ошибок быть не должно).

> Если build падает из-за отсутствующего `--font-gerhaus`/`--font-nunito`/`--font-jbm` — это ожидаемо, токены ссылаются
> на переменные шрифтов, которые подключим в Task 6. Минимально допустимо: токены `--font-*` указывают на ещё не
> существующие vars; CSS не падает, Tailwind просто отдаёт font-family с fallback в браузер. Build не должен ломаться.
> Если ломается — ставим временный fallback `'serif'`, переделаем после Task 6.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: replace globals with SPEC §5 design tokens"
```

---

## Task 6: Шрифты + layout

**Files:** `app/layout.tsx` (rewrite)

- [ ] **Step 1: Полностью заменить содержимое `app/layout.tsx`**

```tsx
import type {Metadata, Viewport} from 'next';
import localFont from 'next/font/local';
import {Nunito, JetBrains_Mono} from 'next/font/google';
import {CONTENT} from '@/lib/quiz-data';
import './globals.css';

const gerhaus = localFont({
    src: '../public/fonts/gerhaus/Gerhaus.ttf',
    variable: '--font-gerhaus',
    display: 'swap',
    fallback: ['Georgia', 'serif'],
});

const nunito = Nunito({
    subsets: ['latin', 'cyrillic'],
    variable: '--font-nunito',
    display: 'swap',
});

const jbm = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jbm',
    display: 'swap',
});

export const metadata: Metadata = {
    title: CONTENT.meta.title,
    description: CONTENT.meta.description,
    openGraph: {
        title: CONTENT.meta.ogTitle,
        description: CONTENT.meta.ogDescription,
        type: 'website',
        locale: 'ru_RU',
    },
};

export const viewport: Viewport = {
    themeColor: '#0E1117',
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html
            lang="ru"
            className={`${gerhaus.variable} ${nunito.variable} ${jbm.variable} h-full antialiased`}
        >
        <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
```

- [ ] **Step 2: Заменить `app/page.tsx` на временную заглушку, чтобы dev запустился**

```tsx
export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center font-display text-4xl text-tx bg-bg-primary">
            Тренер у дома · скоро
        </main>
    );
}
```

- [ ] **Step 3: Проверить dev-сервер**

Run:

```bash
npm run dev
```

Открыть `http://localhost:3000` в браузере. Ожидаем: чёрный фон `#0E1117`, светлый текст `#E8ECF4`, заголовок шрифтом
Gerhaus (вертикально-узкий, не Times). Если виден Times — Gerhaus не подхватился, проверить путь
`public/fonts/gerhaus/Gerhaus.ttf`.

Остановить dev (Ctrl+C).

- [ ] **Step 4: Build + typecheck**

Run:

```bash
npm run build && npm run typecheck
```

Expected: оба зелёные.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat(app): wire fonts (Gerhaus/Nunito/JetBrains Mono), metadata, lang=ru"
```

---

## Task 7: `.env.local.example`

**Files:** Create `.env.local.example`

- [ ] **Step 1: Создать `.env.local.example`**

```
# Публичные (попадают в клиентский bundle, безопасно)
NEXT_PUBLIC_TG_USERNAME=
NEXT_PUBLIC_YM_ID=

# Фаза 2 (серверные, секреты — НЕ NEXT_PUBLIC_)
# TG_BOT_TOKEN=
# TG_CHAT_ID=
```

- [ ] **Step 2: Создать локальный `.env.local` для разработки (НЕ в git благодаря `.gitignore` `.env*`)**

```
NEXT_PUBLIC_TG_USERNAME=placeholder
NEXT_PUBLIC_YM_ID=00000000
```

- [ ] **Step 3: Проверить, что `.env.local` НЕ попал в git**

Run:

```bash
git status --short
```

Expected: видим только `?? .env.local.example`. `.env.local` отсутствует.

- [ ] **Step 4: Commit**

```bash
git add .env.local.example
git commit -m "chore: add env example with NEXT_PUBLIC placeholders"
```

---

# Фаза B · Доменный слой (TDD)

## Task 8: Расширить `lib/types.ts`

**Files:** `lib/types.ts` (modify)

- [ ] **Step 1: В конец файла `lib/types.ts` добавить три типа**

```ts

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
```

- [ ] **Step 2: Проверить typecheck**

Run:

```bash
npm run typecheck
```

Expected: 0 ошибок. `lib/quiz-logic.ts` теперь корректно импортирует `QuizState`.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "types: add QuizState, Goal, LeadPayload"
```

---

## Task 9: TDD — telegram.ts

**Files:**

- Create: `tests/lib/telegram.test.ts`
- Modify: `lib/telegram.ts`

- [ ] **Step 1: Написать падающий тест**

Create `tests/lib/telegram.test.ts`:

```ts
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {buildTelegramLink} from '@/lib/telegram';

describe('buildTelegramLink', () => {
    beforeEach(() => {
        vi.stubEnv('NEXT_PUBLIC_TG_USERNAME', 'kamensky_trener');
    });
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('starts with https://t.me/<username>?text=', () => {
        expect(buildTelegramLink('hi')).toMatch(
            /^https:\/\/t\.me\/kamensky_trener\?text=/,
        );
    });

    it('URL-encodes Cyrillic text', () => {
        const url = buildTelegramLink('привет');
        expect(url).toContain(
            'text=%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82',
        );
    });

    it('handles empty message gracefully', () => {
        expect(buildTelegramLink('')).toBe(
            'https://t.me/kamensky_trener?text=',
        );
    });

    it('falls back to "placeholder" when env is missing', () => {
        vi.stubEnv('NEXT_PUBLIC_TG_USERNAME', '');
        expect(buildTelegramLink('hi')).toMatch(
            /^https:\/\/t\.me\/placeholder\?text=/,
        );
    });
});
```

- [ ] **Step 2: Запустить тест, убедиться, что падает**

Run:

```bash
npx vitest run tests/lib/telegram.test.ts
```

Expected: 4 failed (3 ошибки на `t.me/undefined`, 1 ошибка на fallback). Текущая реализация `lib/telegram.ts` использует
`!` и не имеет fallback.

- [ ] **Step 3: Переписать `lib/telegram.ts`**

```ts
const FALLBACK_USERNAME = 'placeholder';

function readUsername(): string {
    const raw = process.env.NEXT_PUBLIC_TG_USERNAME;
    return raw && raw.length > 0 ? raw : FALLBACK_USERNAME;
}

export function buildTelegramLink(message: string): string {
    return `https://t.me/${readUsername()}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 4: Запустить тест, убедиться, что зелёный**

Run:

```bash
npx vitest run tests/lib/telegram.test.ts
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add tests/lib/telegram.test.ts lib/telegram.ts
git commit -m "feat(lib/telegram): safe fallback + tests (§15.1)"
```

---

## Task 10: TDD — analytics.ts

**Files:**

- Create: `tests/lib/analytics.test.ts`
- Create: `lib/analytics.ts`

- [ ] **Step 1: Написать падающий тест**

Create `tests/lib/analytics.test.ts`:

```ts
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {reachGoal} from '@/lib/analytics';

describe('reachGoal', () => {
    beforeEach(() => {
        vi.stubEnv('NEXT_PUBLIC_YM_ID', '99999999');
    });
    afterEach(() => {
        vi.unstubAllEnvs();
        // @ts-expect-error cleanup test-only global
        delete window.ym;
    });

    it('is a no-op when window.ym is missing', () => {
        expect(() => reachGoal('quiz_start')).not.toThrow();
    });

    it('calls window.ym with id, "reachGoal", and goal name', () => {
        const ym = vi.fn();
        // @ts-expect-error inject test double
        window.ym = ym;
        reachGoal('quiz_complete');
        expect(ym).toHaveBeenCalledWith(99999999, 'reachGoal', 'quiz_complete');
    });

    it('is a no-op when YM_ID env is missing', () => {
        vi.stubEnv('NEXT_PUBLIC_YM_ID', '');
        const ym = vi.fn();
        // @ts-expect-error inject test double
        window.ym = ym;
        reachGoal('quiz_start');
        expect(ym).not.toHaveBeenCalled();
    });

    it('accepts template-literal goals like lead_click_health', () => {
        const ym = vi.fn();
        // @ts-expect-error inject test double
        window.ym = ym;
        reachGoal('lead_click_health');
        expect(ym).toHaveBeenCalledWith(99999999, 'reachGoal', 'lead_click_health');
    });
});
```

- [ ] **Step 2: Запустить тест, убедиться, что падает (файл не найден)**

Run:

```bash
npx vitest run tests/lib/analytics.test.ts
```

Expected: fail с `Cannot find module '@/lib/analytics'`.

- [ ] **Step 3: Написать `lib/analytics.ts`**

```ts
import type {Goal} from './types';

declare global {
    interface Window {
        ym?: (id: number, method: string, goal: string) => void;
    }
}

export function reachGoal(goal: Goal): void {
    if (typeof window === 'undefined') return;
    const ymId = Number(process.env.NEXT_PUBLIC_YM_ID);
    if (!ymId || typeof window.ym !== 'function') return;
    window.ym(ymId, 'reachGoal', goal);
}
```

- [ ] **Step 4: Запустить тест, убедиться, что зелёный**

Run:

```bash
npx vitest run tests/lib/analytics.test.ts
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add tests/lib/analytics.test.ts lib/analytics.ts
git commit -m "feat(lib/analytics): type-safe reachGoal + tests (§15.3)"
```

---

## Task 11: TDD — quiz-logic.ts

**Files:** Create `tests/lib/quiz-logic.test.ts`

(Реализация уже есть в `lib/quiz-logic.ts` — тесты проверяют корректность.)

- [ ] **Step 1: Написать тесты**

```ts
import {describe, it, expect} from 'vitest';
import {quizReducer, resolveResult, initialState} from '@/lib/quiz-logic';

describe('resolveResult (argmax + tie-break health→body→energy)', () => {
    it('returns the unambiguous winner', () => {
        expect(resolveResult({health: 3, body: 0, energy: 0})).toBe('health');
        expect(resolveResult({health: 0, body: 3, energy: 0})).toBe('body');
        expect(resolveResult({health: 0, body: 0, energy: 3})).toBe('energy');
    });

    it('breaks 3-way tie to "health"', () => {
        expect(resolveResult({health: 1, body: 1, energy: 1})).toBe('health');
    });

    it('breaks 2-way tie body/energy to "body"', () => {
        expect(resolveResult({health: 0, body: 1, energy: 1})).toBe('body');
    });

    it('breaks 2-way tie health/energy to "health"', () => {
        expect(resolveResult({health: 1, body: 0, energy: 1})).toBe('health');
    });

    it('breaks 2-way tie health/body to "health"', () => {
        expect(resolveResult({health: 1, body: 1, energy: 0})).toBe('health');
    });
});

describe('quizReducer', () => {
    it('advances step on each ANSWER until 3, then finishes', () => {
        let s = quizReducer(initialState, {type: 'ANSWER', profile: 'health'});
        expect(s.step).toBe(1);
        expect(s.finished).toBe(false);
        expect(s.result).toBeNull();

        s = quizReducer(s, {type: 'ANSWER', profile: 'body'});
        expect(s.step).toBe(2);
        expect(s.finished).toBe(false);

        s = quizReducer(s, {type: 'ANSWER', profile: 'energy'});
        expect(s.step).toBe(3);
        expect(s.finished).toBe(true);
        expect(s.scores).toEqual({health: 1, body: 1, energy: 1});
        expect(s.result).toBe('health'); // tie-break
    });

    it('produces a 3-health winner when all answers are health', () => {
        let s = quizReducer(initialState, {type: 'ANSWER', profile: 'health'});
        s = quizReducer(s, {type: 'ANSWER', profile: 'health'});
        s = quizReducer(s, {type: 'ANSWER', profile: 'health'});
        expect(s.result).toBe('health');
        expect(s.scores).toEqual({health: 3, body: 0, energy: 0});
    });

    it('RESET returns to initialState', () => {
        const dirty = {
            step: 3 as const,
            scores: {health: 2, body: 1, energy: 0},
            finished: true,
            result: 'health' as const,
        };
        expect(quizReducer(dirty, {type: 'RESET'})).toEqual(initialState);
    });
});
```

- [ ] **Step 2: Запустить тест**

Run:

```bash
npx vitest run tests/lib/quiz-logic.test.ts
```

Expected: 8 passed (текущая реализация уже корректна).

Если что-то падает — НЕ менять `quiz-logic.ts` без согласования: контент уже зафиксирован. Если тест выявит расхождение
со SPEC — сначала обсудить.

- [ ] **Step 3: Commit**

```bash
git add tests/lib/quiz-logic.test.ts
git commit -m "test(lib/quiz-logic): cover argmax + tie-break + reducer (§15.2)"
```

---

## Task 12: Полный прогон тестов и typecheck

- [ ] **Step 1: Запустить всё**

Run:

```bash
npm run typecheck && npm test
```

Expected: typecheck чистый, vitest 3 файла / 16 тестов passed.

- [ ] **Step 2: Если зелёное — переходим к UI. Если нет — стоп, диагностика.**

---

# Фаза C · UI-примитивы

## Task 13: `components/ui/Pill.tsx`

**Files:** Create `components/ui/Pill.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
import type {ReactNode} from 'react';

export function Pill({children}: { children: ReactNode }) {
    return (
        <span
            className="inline-flex items-center rounded-full border border-[--line] bg-[--glass] px-3 py-1 text-xs font-mono uppercase tracking-[0.15em] text-tx2">
      {children}
    </span>
    );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: чисто.

- [ ] **Step 3: Commit**

```bash
git add components/ui/Pill.tsx
git commit -m "feat(ui): Pill"
```

---

## Task 14: `components/ui/GlassCard.tsx`

**Files:** Create `components/ui/GlassCard.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
import type {ReactNode} from 'react';

export function GlassCard({
                              children,
                              className = '',
                          }: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`rounded-[--radius-lg] border border-[--line] bg-[--glass] p-6 backdrop-blur-[--blur-md] ${className}`}
        >
            {children}
        </div>
    );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add components/ui/GlassCard.tsx
git commit -m "feat(ui): GlassCard"
```

---

## Task 15: `components/ui/Bridge.tsx`

**Files:** Create `components/ui/Bridge.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
import type {BridgeContent} from '@/lib/types';

export function Bridge({data}: { data: BridgeContent }) {
    return (
        <div className="my-12 flex flex-col items-center gap-3 text-center">
            <p className="font-display text-xl text-tx2 md:text-2xl">{data.question}</p>
            <a
                href={data.href}
                className="inline-flex items-center gap-2 rounded-full border border-[--line] bg-[--glass] px-5 py-2 text-sm text-tx transition-colors hover:border-cyan hover:text-cyan"
            >
                {data.cta} <span aria-hidden>→</span>
            </a>
        </div>
    );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add components/ui/Bridge.tsx
git commit -m "feat(ui): Bridge"
```

---

## Task 16: `components/ui/TrackedLink.tsx`

**Files:** Create `components/ui/TrackedLink.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
'use client';

import type {ReactNode} from 'react';
import type {Goal} from '@/lib/types';
import {reachGoal} from '@/lib/analytics';

export function TrackedLink({
                                href,
                                goal,
                                children,
                                className = '',
                                external = false,
                            }: {
    href: string;
    goal: Goal;
    children: ReactNode;
    className?: string;
    external?: boolean;
}) {
    return (
        <a
            href={href}
            className={className}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            onClick={() => reachGoal(goal)}
        >
            {children}
        </a>
    );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add components/ui/TrackedLink.tsx
git commit -m "feat(ui): TrackedLink (client) — anchor + reachGoal"
```

---

## Task 17: `components/ui/Reveal.tsx`

**Files:** Create `components/ui/Reveal.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';

export function Reveal({
                           children,
                           className = '',
                           delayMs = 0,
                       }: {
    children: ReactNode;
    className?: string;
    delayMs?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const reduced =
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        if (reduced) {
            setVisible(true);
            return;
        }

        const el = ref.current;
        if (!el) return;

        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        setVisible(true);
                        io.disconnect();
                        break;
                    }
                }
            },
            {rootMargin: '0px 0px -10% 0px', threshold: 0.1},
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            data-reveal={visible ? 'visible' : 'hidden'}
            style={{transitionDelay: visible ? `${delayMs}ms` : '0ms'}}
            className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${className}`}
        >
            {children}
        </div>
    );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add components/ui/Reveal.tsx
git commit -m "feat(ui): Reveal (client) — IntersectionObserver + reduced-motion"
```

---

## Task 18: `components/ui/StickyCta.tsx`

**Files:** Create `components/ui/StickyCta.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
import {CONTENT} from '@/lib/quiz-data';

export function StickyCta() {
    return (
        <div
            className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-[--line] bg-bg2/95 px-4 py-3 backdrop-blur-[--blur-md]">
            <a
                href="#test"
                className="block w-full rounded-full bg-cyan px-5 py-3 text-center text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
            >
                {CONTENT.stickyCta}
            </a>
        </div>
    );
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
npm run typecheck
git add components/ui/StickyCta.tsx
git commit -m "feat(ui): StickyCta (mobile-only, anchor to #test)"
```

---

# Фаза D · Server-секции

## Task 19: `components/sections/Hero.tsx`

**Files:** Create `components/sections/Hero.tsx`

- [ ] **Step 1: Создать секцию**

```tsx
import {CONTENT, DIRECT_TG_MESSAGE} from '@/lib/quiz-data';
import {buildTelegramLink} from '@/lib/telegram';
import {Pill} from '@/components/ui/Pill';
import {TrackedLink} from '@/components/ui/TrackedLink';

export function Hero() {
    const tgHref = buildTelegramLink(DIRECT_TG_MESSAGE);
    return (
        <section
            className="relative isolate overflow-hidden border-b border-[--line] bg-bg-primary px-4 pb-16 pt-20 md:pb-24 md:pt-28">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.hero.kicker}
                </p>
                <h1 className="font-display text-3xl leading-tight text-tx md:text-5xl">
                    {CONTENT.hero.h1}
                </h1>
                <p className="max-w-2xl text-base text-tx2 md:text-lg">
                    {CONTENT.hero.sub}
                </p>
                <ul className="flex flex-wrap gap-2">
                    {CONTENT.hero.pills.map((p) => (
                        <li key={p}>
                            <Pill>{p}</Pill>
                        </li>
                    ))}
                </ul>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a
                        href="#test"
                        className="rounded-full bg-cyan px-6 py-3 text-center text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
                    >
                        {CONTENT.hero.cta}
                    </a>
                    <TrackedLink
                        href={tgHref}
                        goal="lead_click_direct"
                        external
                        className="rounded-full border border-[--line] bg-[--glass] px-6 py-3 text-center text-sm text-tx transition-colors hover:border-cyan hover:text-cyan"
                    >
                        ✈ Сразу написать
                    </TrackedLink>
                </div>
                <p className="text-xs text-tx3">{CONTENT.hero.microcopy}</p>
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Подключить в `app/page.tsx`**

Заменить содержимое `app/page.tsx`:

```tsx
import {Hero} from '@/components/sections/Hero';

export default function Home() {
    return (
        <>
            <Hero/>
        </>
    );
}
```

- [ ] **Step 3: Визуальная проверка в dev**

Run:

```bash
npm run dev
```

Открыть `http://localhost:3000`, убедиться: видны kicker (mono uppercase), большой H1 Gerhaus, sub Nunito, 3 pills,
синяя кнопка «Пройти короткий разбор» и серая «Сразу написать». Mobile-вид: всё в колонку. Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Hero.tsx app/page.tsx
git commit -m "feat(sections): Hero"
```

---

## Task 20: `components/sections/Problem.tsx`

**Files:** Create `components/sections/Problem.tsx`

- [ ] **Step 1: Создать секцию**

```tsx
import {CONTENT, BRIDGES} from '@/lib/quiz-data';
import {GlassCard} from '@/components/ui/GlassCard';
import {Bridge} from '@/components/ui/Bridge';
import {Reveal} from '@/components/ui/Reveal';

export function Problem() {
    return (
        <section id="pain" className="border-b border-[--line] bg-bg2 px-4 py-20 md:py-28">
            <div className="mx-auto max-w-5xl">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.problem.kicker}
                </p>
                <h2 className="mt-2 font-display text-2xl text-tx md:text-4xl">
                    {CONTENT.problem.h2}
                </h2>
                <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {CONTENT.problem.cards.map((c, i) => (
                        <li key={c.title}>
                            <Reveal delayMs={i * 80}>
                                <GlassCard className="h-full">
                                    <div className="text-3xl" aria-hidden>{c.emoji}</div>
                                    <h3 className="mt-3 font-display text-lg text-tx">{c.title}</h3>
                                    <p className="mt-2 text-sm text-tx2">{c.text}</p>
                                </GlassCard>
                            </Reveal>
                        </li>
                    ))}
                </ul>
                <p className="mt-10 max-w-2xl text-base text-tx">
                    <span className="font-semibold">{CONTENT.problem.summaryLead}</span>{' '}
                    <span className="text-tx2">{CONTENT.problem.summaryRest}</span>
                </p>
                <Bridge data={BRIDGES.toMap}/>
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Подключить в page.tsx + проверить в dev**

`app/page.tsx`:

```tsx
import {Hero} from '@/components/sections/Hero';
import {Problem} from '@/components/sections/Problem';

export default function Home() {
    return (
        <>
            <Hero/>
            <Problem/>
        </>
    );
}
```

Run `npm run dev`, открыть в браузере, проверить три карточки, summary, мостик. Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Problem.tsx app/page.tsx
git commit -m "feat(sections): Problem"
```

---

## Task 21: `components/sections/Map.tsx`

**Files:** Create `components/sections/Map.tsx`

- [ ] **Step 1: Создать секцию**

```tsx
import {CONTENT, BRIDGES} from '@/lib/quiz-data';
import {Bridge} from '@/components/ui/Bridge';

export function Map() {
    return (
        <section id="map" className="border-b border-[--line] bg-bg-primary px-4 py-20 md:py-28">
            <div className="mx-auto max-w-5xl">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.map.kicker}
                </p>
                <h2 className="mt-2 font-display text-2xl text-tx md:text-4xl">
                    {CONTENT.map.h2}
                </h2>
                <p className="mt-4 max-w-2xl text-base text-tx2">{CONTENT.map.sub}</p>

                <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_1.4fr]">
                    <ul className="space-y-3">
                        {CONTENT.map.points.map((p) => (
                            <li
                                key={p.name}
                                className="flex items-baseline justify-between rounded-[--radius-md] border border-[--line] bg-[--glass] px-4 py-3"
                            >
                                <span className="font-display text-base text-tx">{p.name}</span>
                                <span className="font-mono text-sm text-cyan">{p.time}</span>
                            </li>
                        ))}
                    </ul>

                    <div
                        className="relative aspect-square w-full overflow-hidden rounded-[--radius-xl] border border-[--line] bg-bg3">
                        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                            <circle cx="50" cy="50" r="3" fill="var(--color-cyan)"/>
                            <circle cx="50" cy="50" r="18" fill="none" stroke="var(--color-cyan)" strokeOpacity="0.25"/>
                            <circle cx="50" cy="50" r="32" fill="none" stroke="var(--color-cyan)" strokeOpacity="0.15"/>
                            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-cyan)" strokeOpacity="0.08"/>
                            <text x="50" y="62" textAnchor="middle" fontSize="3.2" fill="var(--color-tx2)"
                                  fontFamily="var(--font-mono)">
                                {CONTENT.map.center}
                            </text>
                        </svg>
                    </div>
                </div>

                <p className="mt-8 text-sm text-tx3">{CONTENT.map.caption}</p>
                <Bridge data={BRIDGES.toTransformation}/>
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Подключить + dev-проверка + commit**

`app/page.tsx`: добавить `import { Map } from '@/components/sections/Map';` и `<Map />` после `<Problem />`.

Run `npm run dev`, проверить, Ctrl+C.

```bash
git add components/sections/Map.tsx app/page.tsx
git commit -m "feat(sections): Map"
```

---

## Task 22: `components/sections/Transformation.tsx`

**Files:** Create `components/sections/Transformation.tsx`

- [ ] **Step 1: Создать секцию**

```tsx
import {CONTENT, BRIDGES} from '@/lib/quiz-data';
import {GlassCard} from '@/components/ui/GlassCard';
import {Bridge} from '@/components/ui/Bridge';

export function Transformation() {
    return (
        <section id="bab" className="border-b border-[--line] bg-bg2 px-4 py-20 md:py-28">
            <div className="mx-auto max-w-5xl">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.transformation.kicker}
                </p>
                <h2 className="mt-2 font-display text-2xl text-tx md:text-4xl">
                    {CONTENT.transformation.h2}
                </h2>

                <div className="mt-10 grid gap-4 md:grid-cols-2">
                    <GlassCard>
                        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-tx3">сейчас</h3>
                        <ul className="mt-4 space-y-2 text-tx2">
                            {CONTENT.transformation.before.map((b) => (
                                <li key={b} className="flex gap-2">
                                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-tx3" aria-hidden/>
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                    </GlassCard>

                    <GlassCard className="border-cyan/40 bg-cyan/[0.04]">
                        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">{CONTENT.transformation.after}</h3>
                        <ul className="mt-4 space-y-2 text-tx">
                            {CONTENT.transformation.afterItems.map((a) => (
                                <li key={a} className="flex gap-2">
                                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden/>
                                    <span>{a}</span>
                                </li>
                            ))}
                        </ul>
                    </GlassCard>
                </div>

                <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.transformation.bridge}
                </p>

                <Bridge data={BRIDGES.toQuiz}/>
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Подключить + dev-проверка + commit**

`app/page.tsx`: добавить импорт и `<Transformation />`.

```bash
git add components/sections/Transformation.tsx app/page.tsx
git commit -m "feat(sections): Transformation (BAB)"
```

---

## Task 23: `components/sections/FinalCta.tsx`

**Files:** Create `components/sections/FinalCta.tsx`

- [ ] **Step 1: Создать секцию**

```tsx
import {CONTENT, DIRECT_TG_MESSAGE} from '@/lib/quiz-data';
import {buildTelegramLink} from '@/lib/telegram';
import {TrackedLink} from '@/components/ui/TrackedLink';

export function FinalCta() {
    const tgHref = buildTelegramLink(DIRECT_TG_MESSAGE);
    return (
        <section id="cta" className="bg-bg-primary px-4 py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.finalCta.kicker}
                </p>
                <h2 className="mt-2 font-display text-2xl text-tx md:text-4xl">
                    {CONTENT.finalCta.h2}
                </h2>
                <p className="mt-4 text-base text-tx2">{CONTENT.finalCta.text}</p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <a
                        href="#test"
                        className="rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
                    >
                        {CONTENT.finalCta.cta1}
                    </a>
                    <TrackedLink
                        href={tgHref}
                        goal="lead_click_direct"
                        external
                        className="rounded-full border border-[--line] bg-[--glass] px-6 py-3 text-sm text-tx transition-colors hover:border-cyan hover:text-cyan"
                    >
                        {CONTENT.finalCta.cta2}
                    </TrackedLink>
                </div>

                <p className="mt-6 text-xs text-tx3">{CONTENT.finalCta.guarantee}</p>
            </div>
        </section>
    );
}
```

- [ ] **Step 2: Подключить + dev-проверка + commit**

`app/page.tsx` добавить `<FinalCta />`.

```bash
git add components/sections/FinalCta.tsx app/page.tsx
git commit -m "feat(sections): FinalCta"
```

---

## Task 24: Footer + StickyCta + полная сборка page.tsx

**Files:** Modify `app/page.tsx`

- [ ] **Step 1: Финальный `app/page.tsx`**

```tsx
import {Hero} from '@/components/sections/Hero';
import {Problem} from '@/components/sections/Problem';
import {Map} from '@/components/sections/Map';
import {Transformation} from '@/components/sections/Transformation';
import {FinalCta} from '@/components/sections/FinalCta';
import {StickyCta} from '@/components/ui/StickyCta';
import {CONTENT} from '@/lib/quiz-data';

export default function Home() {
    return (
        <>
            <Hero/>
            <Problem/>
            <Map/>
            <Transformation/>
            {/* Quiz и Objections подключим в фазе E */}
            <FinalCta/>
            <footer className="border-t border-[--line] bg-bg2 px-4 py-10 text-center">
                <p className="font-display text-base text-tx">{CONTENT.footer.name}</p>
                <p className="mt-2 text-xs text-tx3">{CONTENT.footer.tagline}</p>
                <p className="mt-4 text-xs text-tx3">
                    <a href="/privacy" className="underline hover:text-tx2">
                        Политика конфиденциальности
                    </a>
                </p>
            </footer>
            <StickyCta/>
        </>
    );
}
```

- [ ] **Step 2: dev-проверка mobile + desktop**

Run `npm run dev`. В DevTools переключить на mobile (375px) — увидеть sticky-CTA внизу. Кликнуть — должно скроллить
вверх (так как `#test` ещё нет, скролл к началу страницы; это нормально, исправится после Quiz). Ctrl+C.

- [ ] **Step 3: Build + typecheck**

```bash
npm run build && npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(app): assemble landing page (sections + sticky + footer)"
```

---

# Фаза E · Клиентский интерактив (TDD)

## Task 25: TDD — Objections (аккордеон)

**Files:**

- Create: `tests/components/Objections.test.tsx`
- Create: `components/sections/Objections.tsx`

- [ ] **Step 1: Написать падающий тест**

```tsx
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Objections} from '@/components/sections/Objections';

describe('Objections accordion (§15.5)', () => {
    beforeEach(() => {
        vi.stubEnv('NEXT_PUBLIC_YM_ID', '99999999');
    });
    afterEach(() => {
        vi.unstubAllEnvs();
        // @ts-expect-error cleanup
        delete window.ym;
    });

    it('renders all questions collapsed by default', () => {
        render(<Objections/>);
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(4);
        for (const btn of buttons) {
            expect(btn).toHaveAttribute('aria-expanded', 'false');
        }
    });

    it('expands a single item on click', async () => {
        const user = userEvent.setup();
        render(<Objections/>);
        const first = screen.getAllByRole('button')[0];
        await user.click(first);
        expect(first).toHaveAttribute('aria-expanded', 'true');
    });

    it('toggles to another item, collapses the previous', async () => {
        const user = userEvent.setup();
        render(<Objections/>);
        const [a, b] = screen.getAllByRole('button');
        await user.click(a);
        await user.click(b);
        expect(a).toHaveAttribute('aria-expanded', 'false');
        expect(b).toHaveAttribute('aria-expanded', 'true');
    });

    it('fires objection_open goal only on the FIRST expand', async () => {
        const ym = vi.fn();
        // @ts-expect-error inject
        window.ym = ym;
        const user = userEvent.setup();
        render(<Objections/>);
        const [a, b] = screen.getAllByRole('button');
        await user.click(a);
        await user.click(b);
        await user.click(a);
        const goalCalls = ym.mock.calls.filter((c) => c[2] === 'objection_open');
        expect(goalCalls).toHaveLength(1);
    });
});
```

- [ ] **Step 2: Запустить, убедиться, что fail (модуль не существует)**

```bash
npx vitest run tests/components/Objections.test.tsx
```

Expected: fail с `Cannot find module '@/components/sections/Objections'`.

- [ ] **Step 3: Реализовать `components/sections/Objections.tsx`**

```tsx
'use client';

import {useRef, useState} from 'react';
import {CONTENT, BRIDGES} from '@/lib/quiz-data';
import {Bridge} from '@/components/ui/Bridge';
import {reachGoal} from '@/lib/analytics';

export function Objections() {
    const [openIdx, setOpenIdx] = useState<number | null>(null);
    const goalSent = useRef(false);

    const toggle = (idx: number) => {
        setOpenIdx((prev) => (prev === idx ? null : idx));
        if (!goalSent.current) {
            goalSent.current = true;
            reachGoal('objection_open');
        }
    };

    return (
        <section id="objections" className="border-b border-[--line] bg-bg2 px-4 py-20 md:py-28">
            <div className="mx-auto max-w-3xl">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.objections.kicker}
                </p>
                <h2 className="mt-2 font-display text-2xl text-tx md:text-4xl">
                    {CONTENT.objections.h2}
                </h2>

                <ul className="mt-8 space-y-3">
                    {CONTENT.objections.items.map((item, idx) => {
                        const open = openIdx === idx;
                        const panelId = `obj-panel-${idx}`;
                        return (
                            <li key={item.q} className="rounded-[--radius-md] border border-[--line] bg-[--glass]">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                                    aria-expanded={open}
                                    aria-controls={panelId}
                                    onClick={() => toggle(idx)}
                                >
                                    <span className="font-display text-base text-tx md:text-lg">{item.q}</span>
                                    <span className="font-mono text-tx2" aria-hidden>{open ? '−' : '+'}</span>
                                </button>
                                {open && (
                                    <div id={panelId} className="px-5 pb-5 text-sm text-tx2">
                                        {item.a}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <Bridge data={BRIDGES.toQuiz}/>
            </div>
        </section>
    );
}
```

- [ ] **Step 4: Запустить тест, убедиться, что зелёный**

```bash
npx vitest run tests/components/Objections.test.tsx
```

Expected: 4 passed.

- [ ] **Step 5: Подключить Objections в `app/page.tsx` ПЕРЕД `<FinalCta />`**

В `app/page.tsx`:

```tsx
import {Objections} from '@/components/sections/Objections';
```

И добавить `<Objections />` после `<Transformation />`, перед `<FinalCta />`.

- [ ] **Step 6: Commit**

```bash
git add tests/components/Objections.test.tsx components/sections/Objections.tsx app/page.tsx
git commit -m "feat(sections): Objections accordion + tests (§15.5)"
```

---

## Task 26: Квиз — презентационные подкомпоненты

**Files:**

- Create: `components/quiz/ProgressBar.tsx`
- Create: `components/quiz/QuizQuestion.tsx`
- Create: `components/quiz/QuizResult.tsx`

- [ ] **Step 1: ProgressBar**

```tsx
export function ProgressBar({step, total}: { step: number; total: number }) {
    const pct = Math.min(100, Math.max(0, (step / total) * 100));
    return (
        <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
            className="h-1.5 w-full overflow-hidden rounded-full bg-[--line]"
        >
            <div
                className="h-full bg-cyan transition-[width] duration-500 ease-out"
                style={{width: `${pct}%`}}
            />
        </div>
    );
}
```

- [ ] **Step 2: QuizQuestion**

```tsx
import type {QuizQuestion as Q, ProfileKey} from '@/lib/types';

export function QuizQuestion({
                                 question,
                                 onAnswer,
                             }: {
    question: Q;
    onAnswer: (profile: ProfileKey) => void;
}) {
    return (
        <div>
            <h3 className="font-display text-xl text-tx md:text-2xl">{question.title}</h3>
            <ul className="mt-6 grid gap-3">
                {question.options.map((opt) => (
                    <li key={opt.label}>
                        <button
                            type="button"
                            onClick={() => onAnswer(opt.scores)}
                            className="block w-full rounded-[--radius-md] border border-[--line] bg-[--glass] px-5 py-4 text-left transition-colors hover:border-cyan"
                        >
                            <div className="font-medium text-tx">{opt.label}</div>
                            <div className="mt-1 text-sm text-tx2">{opt.sub}</div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

- [ ] **Step 3: QuizResult**

```tsx
import type {Profile} from '@/lib/types';
import {CONTENT} from '@/lib/quiz-data';
import {buildTelegramLink} from '@/lib/telegram';
import {TrackedLink} from '@/components/ui/TrackedLink';

export function QuizResult({
                               profile,
                               onRestart,
                           }: {
    profile: Profile;
    onRestart: () => void;
}) {
    const tgHref = buildTelegramLink(profile.tgMessage);
    return (
        <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">{profile.badge}</p>
            <h3 className="mt-2 font-display text-2xl text-tx md:text-3xl">{profile.title}</h3>
            <p className="mt-4 text-base text-tx2">{profile.body}</p>

            <div className="mt-8 rounded-[--radius-lg] border border-[--line] bg-[--glass] p-6">
                <h4 className="font-display text-lg text-tx">{profile.offerTitle}</h4>
                <p className="mt-3 text-sm text-tx2">{profile.offerText}</p>
            </div>

            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <TrackedLink
                    href={tgHref}
                    goal={`lead_click_${profile.key}` as const}
                    external
                    className="rounded-full bg-cyan px-6 py-3 text-center text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
                >
                    Записаться на бесплатную встречу
                </TrackedLink>
                <button
                    type="button"
                    onClick={onRestart}
                    className="rounded-full border border-[--line] bg-[--glass] px-6 py-3 text-center text-sm text-tx2 transition-colors hover:text-tx"
                >
                    {CONTENT.quiz.restart}
                </button>
            </div>

            <p className="mt-4 text-xs text-tx3">{CONTENT.quiz.resultNote}</p>
        </div>
    );
}
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: чисто.

- [ ] **Step 5: Commit**

```bash
git add components/quiz/ProgressBar.tsx components/quiz/QuizQuestion.tsx components/quiz/QuizResult.tsx
git commit -m "feat(quiz): ProgressBar, QuizQuestion, QuizResult (presentational)"
```

---

## Task 27: TDD — Quiz (оркестратор)

**Files:**

- Create: `tests/components/Quiz.test.tsx`
- Create: `components/quiz/Quiz.tsx`

- [ ] **Step 1: Написать падающий тест**

```tsx
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Quiz} from '@/components/quiz/Quiz';
import {QUESTIONS, PROFILES} from '@/lib/quiz-data';

describe('Quiz (§15.4)', () => {
    beforeEach(() => {
        vi.stubEnv('NEXT_PUBLIC_YM_ID', '99999999');
        vi.stubEnv('NEXT_PUBLIC_TG_USERNAME', 'kamensky_trener');
    });
    afterEach(() => {
        vi.unstubAllEnvs();
        // @ts-expect-error cleanup
        delete window.ym;
    });

    it('renders the first question and 0% progress', () => {
        render(<Quiz/>);
        expect(screen.getByText(QUESTIONS[0].title)).toBeInTheDocument();
        const bar = screen.getByRole('progressbar');
        expect(bar).toHaveAttribute('aria-valuenow', '0');
    });

    it('advances to the next question on answer', async () => {
        const user = userEvent.setup();
        render(<Quiz/>);
        await user.click(screen.getByText(QUESTIONS[0].options[0].label));
        expect(screen.getByText(QUESTIONS[1].title)).toBeInTheDocument();
        const bar = screen.getByRole('progressbar');
        expect(Number(bar.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
    });

    it('shows the result after 3 health answers', async () => {
        const user = userEvent.setup();
        render(<Quiz/>);
        for (let i = 0; i < 3; i++) {
            await user.click(screen.getAllByRole('button').find((b) => b.textContent?.includes(QUESTIONS[i].options[0].label))!);
        }
        expect(screen.getByText(PROFILES.health.title)).toBeInTheDocument();
    });

    it('restarts to the first question on "Пройти заново"', async () => {
        const user = userEvent.setup();
        render(<Quiz/>);
        for (let i = 0; i < 3; i++) {
            await user.click(screen.getAllByRole('button').find((b) => b.textContent?.includes(QUESTIONS[i].options[0].label))!);
        }
        expect(screen.getByText(PROFILES.health.title)).toBeInTheDocument();
        await user.click(screen.getByText(/пройти заново/i));
        expect(screen.getByText(QUESTIONS[0].title)).toBeInTheDocument();
    });

    it('fires quiz_start once on first answer and quiz_complete once on result', async () => {
        const ym = vi.fn();
        // @ts-expect-error inject
        window.ym = ym;
        const user = userEvent.setup();
        render(<Quiz/>);
        for (let i = 0; i < 3; i++) {
            await user.click(screen.getAllByRole('button').find((b) => b.textContent?.includes(QUESTIONS[i].options[0].label))!);
        }
        const starts = ym.mock.calls.filter((c) => c[2] === 'quiz_start');
        const completes = ym.mock.calls.filter((c) => c[2] === 'quiz_complete');
        expect(starts).toHaveLength(1);
        expect(completes).toHaveLength(1);
    });
});
```

- [ ] **Step 2: Запустить, убедиться, что fail (компонент не существует)**

```bash
npx vitest run tests/components/Quiz.test.tsx
```

Expected: fail с `Cannot find module '@/components/quiz/Quiz'`.

- [ ] **Step 3: Реализовать `components/quiz/Quiz.tsx`**

```tsx
'use client';

import {useEffect, useReducer, useRef} from 'react';
import {QUESTIONS, PROFILES, CONTENT} from '@/lib/quiz-data';
import {quizReducer, initialState} from '@/lib/quiz-logic';
import {reachGoal} from '@/lib/analytics';
import {ProgressBar} from './ProgressBar';
import {QuizQuestion} from './QuizQuestion';
import {QuizResult} from './QuizResult';

const TOTAL = QUESTIONS.length;

export function Quiz() {
    const [state, dispatch] = useReducer(quizReducer, initialState);
    const startSent = useRef(false);
    const completeSent = useRef(false);

    useEffect(() => {
        if (state.finished && state.result && !completeSent.current) {
            completeSent.current = true;
            reachGoal('quiz_complete');
        }
    }, [state.finished, state.result]);

    const handleAnswer = (profile: 'health' | 'body' | 'energy') => {
        if (!startSent.current) {
            startSent.current = true;
            reachGoal('quiz_start');
        }
        dispatch({type: 'ANSWER', profile});
    };

    const handleReset = () => {
        startSent.current = false;
        completeSent.current = false;
        dispatch({type: 'RESET'});
    };

    return (
        <section id="test" className="border-b border-[--line] bg-bg-primary px-4 py-20 md:py-28">
            <div className="mx-auto max-w-2xl">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.quiz.kicker}
                </p>
                <h2 className="mt-2 font-display text-2xl text-tx md:text-4xl">
                    {CONTENT.quiz.h2}
                </h2>
                <p className="mt-4 text-base text-tx2">{CONTENT.quiz.sub}</p>

                <div className="mt-10 rounded-[--radius-xl] border border-[--line] bg-bg2 p-6 md:p-8">
                    <ProgressBar step={state.step} total={TOTAL}/>

                    <div className="mt-8">
                        {!state.finished && state.step < TOTAL ? (
                            <QuizQuestion
                                question={QUESTIONS[state.step]}
                                onAnswer={handleAnswer}
                            />
                        ) : state.result ? (
                            <QuizResult profile={PROFILES[state.result]} onRestart={handleReset}/>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}
```

- [ ] **Step 4: Запустить, убедиться зелёный**

```bash
npx vitest run tests/components/Quiz.test.tsx
```

Expected: 5 passed.

- [ ] **Step 5: Подключить Quiz в `app/page.tsx` ПЕРЕД `<Objections />`**

В `app/page.tsx`:

```tsx
import {Quiz} from '@/components/quiz/Quiz';
```

Добавить `<Quiz />` после `<Transformation />`, перед `<Objections />`.

- [ ] **Step 6: dev-проверка полного флоу**

Run `npm run dev`. Открыть, проскроллить до Quiz, пройти 3 вопроса, увидеть результат с TG-кнопкой. Проверить «Пройти
заново». Ctrl+C.

- [ ] **Step 7: Commit**

```bash
git add tests/components/Quiz.test.tsx components/quiz/Quiz.tsx app/page.tsx
git commit -m "feat(quiz): Quiz orchestrator (client) + tests (§15.4)"
```

---

# Фаза F · Аналитика, privacy, OG, фаза-2 заглушка

## Task 28: `components/analytics/YandexMetrika.tsx`

**Files:**

- Create: `components/analytics/YandexMetrika.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
'use client';

import Script from 'next/script';

const YM_ID_RAW = process.env.NEXT_PUBLIC_YM_ID;

export function YandexMetrika() {
    if (!YM_ID_RAW) return null;
    const ymId = Number(YM_ID_RAW);
    if (!ymId) return null;

    return (
        <>
            <Script id="ym-init" strategy="afterInteractive">
                {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          ym(${ymId}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
        `}
            </Script>
            <noscript>
                <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://mc.yandex.ru/watch/${ymId}`} style={{position: 'absolute', left: '-9999px'}}
                         alt=""/>
                </div>
            </noscript>
        </>
    );
}
```

- [ ] **Step 2: Подключить в `app/layout.tsx`**

В `app/layout.tsx` добавить импорт:

```tsx
import {YandexMetrika} from '@/components/analytics/YandexMetrika';
```

В `<body>` добавить компонент **последним дочерним элементом** (после `{children}`):

```tsx
<body className="min-h-full flex flex-col">
{children}
<YandexMetrika/>
</body>
```

- [ ] **Step 3: dev-проверка**

Run `npm run dev`. В DevTools → Network — увидеть запрос к `mc.yandex.ru/metrika/tag.js` (если `NEXT_PUBLIC_YM_ID` в
`.env.local` ≠ пустой). Если стоит `00000000` — скрипт всё равно подгружается; ошибки 404 на конкретный счётчик
нормальны. Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add components/analytics/YandexMetrika.tsx app/layout.tsx
git commit -m "feat(analytics): YandexMetrika via next/script afterInteractive"
```

---

## Task 29: `app/privacy/page.tsx`

**Files:** Create `app/privacy/page.tsx`

- [ ] **Step 1: Создать страницу**

```tsx
import type {Metadata} from 'next';

export const metadata: Metadata = {
    title: 'Политика конфиденциальности · Тренер у дома',
    description: 'Как обрабатываются персональные данные посетителей сайта.',
    robots: {index: false, follow: true},
};

export default function PrivacyPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-20 text-tx">
            <h1 className="font-display text-3xl md:text-4xl">Политика конфиденциальности</h1>
            <p className="mt-4 text-sm text-tx3">Редакция от 29 мая 2026 г.</p>

            <section className="mt-10 space-y-4 text-tx2">
                <h2 className="font-display text-xl text-tx">1. Кто обрабатывает данные</h2>
                <p>
                    Сайт «Тренер у дома» (далее — «Сайт») оператор персональных данных: Каменский Никита,
                    самозанятый, ИНН по запросу. Контакт для обращений: Telegram, указанный на главной странице.
                </p>

                <h2 className="font-display text-xl text-tx">2. Какие данные собираются</h2>
                <p>
                    Сайт не содержит форм регистрации. При прохождении квиза персональные данные не передаются:
                    результат квиза формируется и хранится только в браузере посетителя. Если посетитель
                    переходит по кнопке в Telegram, переписка ведётся в соответствии с пользовательским
                    соглашением Telegram.
                </p>
                <p>
                    На Сайте используется счётчик Яндекс.Метрики. Метрика собирает обезличенные данные о посещении:
                    IP-адрес, тип браузера и операционной системы, источник перехода, действия на странице
                    (визор), время сессии. Использование этих данных регулируется
                    {' '}<a className="underline hover:text-tx" href="https://yandex.ru/legal/metrica_termsofuse/"
                            target="_blank" rel="noopener noreferrer">условиями Яндекс.Метрики</a>.
                </p>

                <h2 className="font-display text-xl text-tx">3. Зачем данные обрабатываются</h2>
                <p>
                    Цели: оценка эффективности контента и улучшение Сайта; коммуникация с посетителем, который
                    сам инициировал контакт в Telegram. Данные не передаются третьим лицам, кроме сервисов
                    Яндекс.Метрики (в обезличенном виде).
                </p>

                <h2 className="font-display text-xl text-tx">4. Cookies</h2>
                <p>
                    Сайт использует cookies, необходимые для работы Яндекс.Метрики. Их можно отключить в
                    настройках браузера — это не повлияет на функциональность Сайта.
                </p>

                <h2 className="font-display text-xl text-tx">5. Права субъекта данных</h2>
                <p>
                    В соответствии с Федеральным законом № 152-ФЗ «О персональных данных» вы вправе:
                    получить информацию об обработке ваших данных, потребовать уточнения, блокирования или
                    удаления. Обращайтесь через Telegram, указанный на главной странице.
                </p>

                <h2 className="font-display text-xl text-tx">6. Изменения политики</h2>
                <p>
                    Актуальная редакция всегда доступна по адресу
                    {' '}<code className="font-mono text-tx">/privacy</code>. О существенных изменениях посетители
                    уведомляются на главной странице.
                </p>
            </section>

            <p className="mt-12">
                <a href="/" className="text-sm text-tx2 underline hover:text-tx">← На главную</a>
            </p>
        </main>
    );
}
```

- [ ] **Step 2: dev-проверка**

Run `npm run dev`. Открыть `http://localhost:3000/privacy` — увидеть страницу. Перейти из футера главной — ссылка
работает. Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add app/privacy/page.tsx
git commit -m "feat(privacy): 152-ФЗ template page (no-index)"
```

---

## Task 30: `app/opengraph-image.tsx`

**Files:**

- Create: `app/opengraph-image.tsx`
- Create: `app/opengraph-image.alt.txt`

- [ ] **Step 1: Создать alt-файл**

`app/opengraph-image.alt.txt`:

```
Тренер у дома · Каменский Никита — силовые в шаговой доступности
```

- [ ] **Step 2: Создать `app/opengraph-image.tsx`**

```tsx
import {ImageResponse} from 'next/og';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {CONTENT} from '@/lib/quiz-data';

export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default async function Image() {
    const gerhaus = await readFile(
        join(process.cwd(), 'public/fonts/gerhaus/Gerhaus.ttf'),
    );

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    background: '#0E1117',
                    color: '#E8ECF4',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '64px',
                    fontFamily: 'Gerhaus, serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        fontFamily: 'monospace',
                        fontSize: 22,
                        letterSpacing: 4,
                        textTransform: 'uppercase',
                        color: '#9AA3B5',
                    }}
                >
                    СИЛОВЫЕ ТРЕНИРОВКИ · ПРИМОРСКИЙ ПР., 56
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
                    <div style={{fontSize: 64, lineHeight: 1.05, maxWidth: 1000}}>
                        {CONTENT.meta.ogTitle}
                    </div>
                    <div style={{fontSize: 30, color: '#9AA3B5', maxWidth: 1000}}>
                        {CONTENT.meta.ogDescription}
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        fontSize: 22,
                        color: '#2CE6FF',
                    }}
                >
          <span
              style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: 9999,
                  background: '#2CE6FF',
              }}
          />
                    тренер у дома · разбор за 60 секунд
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                {name: 'Gerhaus', data: gerhaus, style: 'normal', weight: 400},
            ],
        },
    );
}
```

- [ ] **Step 3: Build + проверка**

```bash
npm run build
```

Expected: build чистый. Можно открыть `http://localhost:3000/opengraph-image` после `npm run dev` — увидеть PNG.

- [ ] **Step 4: Commit**

```bash
git add app/opengraph-image.tsx app/opengraph-image.alt.txt
git commit -m "feat(og): generate opengraph-image from tokens via next/og"
```

---

## Task 31: Заглушка `app/api/` под фазу 2

**Files:** Create `app/api/.gitkeep`

- [ ] **Step 1: Создать пустой файл**

Run:

```bash
mkdir -p app/api && : > app/api/.gitkeep
```

- [ ] **Step 2: Commit**

```bash
git add app/api/.gitkeep
git commit -m "chore(api): reserve app/api for phase 2 lead handler"
```

---

# Фаза G · E2E + финальный аудит

## Task 32: E2E — quiz-flow

**Files:** Create `tests/e2e/quiz-flow.spec.ts`

- [ ] **Step 1: Создать тест**

```ts
import {test, expect} from '@playwright/test';

test('Hero CTA → quiz → result → TG link', async ({page}) => {
    await page.goto('/');

    // Hero виден
    await expect(page.locator('h1')).toContainText('Зал в пяти минутах');

    // Скроллим к квизу
    await page.locator('#test').scrollIntoViewIfNeeded();

    // Проходим 3 вопроса — выбираем первый вариант в каждом (health, health, health)
    for (let i = 0; i < 3; i++) {
        const buttons = page.locator('#test button');
        await buttons.first().click();
    }

    // Видим заголовок профиля «здоровье»
    await expect(page.locator('#test')).toContainText('Тебе важно вернуть телу рабочее состояние');

    // TG-кнопка
    const tgLink = page.locator('#test a[href^="https://t.me/"]');
    await expect(tgLink).toBeVisible();
    const href = await tgLink.getAttribute('href');
    expect(href).toMatch(/^https:\/\/t\.me\/[^?]+\?text=.+%D0/); // содержит URL-encoded кириллицу
});
```

- [ ] **Step 2: Запустить тест**

Run:

```bash
npm run test:e2e -- tests/e2e/quiz-flow.spec.ts
```

Expected: passed (для обоих проектов desktop и mobile).

> Если тест падает из-за того, что `Hero` использует ссылку `#test` (которая на mobile перекрывается sticky-CTA) — в
> тесте уже используется `scrollIntoViewIfNeeded()`, должно работать.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/quiz-flow.spec.ts
git commit -m "test(e2e): full quiz flow → TG link (§15.6)"
```

---

## Task 33: E2E — mobile sticky CTA

**Files:** Create `tests/e2e/mobile-sticky.spec.ts`

- [ ] **Step 1: Создать тест**

```ts
import {test, expect} from '@playwright/test';

test.use({viewport: {width: 375, height: 812}});

test('mobile: sticky CTA visible and scrolls to #test', async ({page}) => {
    await page.goto('/');

    const sticky = page.locator('a[href="#test"]:has-text("Пройти")').last();
    await expect(sticky).toBeVisible();

    // Скроллим вниз, чтобы sticky оставалась на экране
    await page.mouse.wheel(0, 1500);
    await expect(sticky).toBeVisible();

    // Клик скроллит к квизу
    await sticky.click();
    await page.waitForTimeout(800); // нативный smooth-scroll
    const quiz = page.locator('#test');
    await expect(quiz).toBeInViewport();
});
```

- [ ] **Step 2: Запустить**

```bash
npm run test:e2e -- tests/e2e/mobile-sticky.spec.ts
```

Expected: passed.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/mobile-sticky.spec.ts
git commit -m "test(e2e): mobile sticky-CTA visibility + scroll"
```

---

## Task 34: E2E — prefers-reduced-motion

**Files:** Create `tests/e2e/reduced-motion.spec.ts`

- [ ] **Step 1: Создать тест**

```ts
import {test, expect} from '@playwright/test';

test.use({colorScheme: 'dark', reducedMotion: 'reduce'});

test('reduced-motion: all sections visible without animation block', async ({page}) => {
    await page.goto('/');

    // Hero виден сразу
    await expect(page.locator('h1')).toBeVisible();

    // Карточки Problem видны без скролла-обёртки Reveal
    await page.locator('#pain').scrollIntoViewIfNeeded();
    const cards = page.locator('#pain li');
    await expect(cards).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
        await expect(cards.nth(i)).toBeVisible();
    }

    // Квиз доступен (первый вопрос виден)
    await page.locator('#test').scrollIntoViewIfNeeded();
    await expect(page.locator('#test')).toContainText('Что для тебя сейчас важнее всего?');
});
```

- [ ] **Step 2: Запустить**

```bash
npm run test:e2e -- tests/e2e/reduced-motion.spec.ts
```

Expected: passed.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/reduced-motion.spec.ts
git commit -m "test(e2e): prefers-reduced-motion does not block content"
```

---

## Task 35: Полный аудит и production check

- [ ] **Step 1: Прогнать всё**

Run:

```bash
npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e
```

Expected: всё зелёное.

> Если какой-то шаг падает — диагностировать через `superpowers:systematic-debugging`. НЕ помечать задачу выполненной до
> зелёного результата.

- [ ] **Step 2: Запустить Lighthouse (опционально, информативно)**

Run:

```bash
npm run build && npm run start &
sleep 4
npx lighthouse http://localhost:3000 --quiet --chrome-flags="--headless" --preset=desktop --output=json --output-path=./lighthouse-desktop.json
npx lighthouse http://localhost:3000 --quiet --chrome-flags="--headless" --output=json --output-path=./lighthouse-mobile.json
kill %1
```

Цели (SPEC §12): Performance ≥ 90, Accessibility ≥ 90, BP ≥ 90, SEO ≥ 95 на mobile.
Это **информативный** шаг — не блокирует план; реальная отладка perf — отдельно.

- [ ] **Step 3: Заполнить чек-лист §16 в commit-сообщении**

Создать заметку для заказчика в коммите:

```bash
git commit --allow-empty -m "chore(release): MVP code complete

Checklist §16 — что осталось заказчику до прод-релиза:
- [ ] NEXT_PUBLIC_TG_USERNAME → реальный username в Vercel env
- [ ] NEXT_PUBLIC_YM_ID → реальный счётчик Метрики + цели quiz_start/quiz_complete/lead_click_*/objection_open
- [ ] Минуты пешком к 3 ЖК (4/8/10) — сверить по Яндекс.Картам и обновить lib/quiz-data.ts (см. // ⚠️ сверить)
- [ ] Цифры доверия (10+ лет, 2–3 года) — подтвердить
- [ ] Прод-домен + HTTPS на Vercel
- [ ] Проверка на реальном iOS Safari и Android Chrome (особенно открытие Telegram)
- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 90, SEO ≥ 95"
```

- [ ] **Step 4: Готово** 🎯

Все тесты §15 зелёные, MVP лендинга собран, чек-лист продакшена зафиксирован.

---

## Self-Review

**Spec coverage:**

- §1 Цели/границы — Hero/Problem/Map/Transformation/Quiz/Objections/FinalCta + sticky-CTA + Метрика ✅
- §2 Стек — все технологии выбраны и поставлены (Task 1, 3, 4) ✅
- §3 Структура файлов — отражена один-в-один в плане ✅
- §4 Доменная модель — Task 8 (расширение types.ts) + готовый lib/ ✅
- §5 Дизайн-токены — Task 5 (@theme), Task 6 (шрифты) ✅
- §6 Структура страницы — Tasks 19–24, 25, 27 ✅
- §7 Квиз — Tasks 26, 27 ✅
- §8.1 Telegram deep link — Task 9 + использование в Hero/FinalCta/QuizResult/StickyCta ✅
- §8.2 Фаза 2 — Task 31 (заглушка app/api/), тип LeadPayload в Task 8 ✅
- §9 Метрика — Task 28 (YandexMetrika) + Task 10 (reachGoal) + использование в TrackedLink, Quiz, Objections ✅
- §10 Env — Task 7 ✅
- §11 A11y/mobile — `prefers-reduced-motion` в globals.css + Reveal; mobile sticky; aria-expanded на аккордеоне;
  semantic h1/h2/h3; lang=ru ✅
- §12 Perf/SEO — SSG (всё server-first кроме явных client), Metadata API, next/font, OG (Task 30), Lighthouse в Task 35
  ✅
- §13 Готовность к фазе 2 — `app/api/.gitkeep`, `LeadPayload`, NEXT_PUBLIC vs server env разделены ✅
- §14 Workflow Superpowers — план структурирован по фазам, микро-задачи 2–5 мин ✅
- §15.1 telegram — Task 9 ✅
- §15.2 quiz-logic — Task 11 ✅
- §15.3 analytics — Task 10 ✅
- §15.4 Quiz UI — Task 27 ✅
- §15.5 Objections — Task 25 ✅
- §15.6 e2e — Tasks 32, 33, 34 ✅
- §16 Чек-лист продакшена — Task 35 step 3 ✅
- §17 Пост-MVP — явно не в скоупе ✅

**Placeholder scan:** Нет «TBD»/«TODO» в самих задачах. Плейсхолдеры значений (TG, YM, ЖК-минуты) явно
владельцем-заказчиком через §16 — это бизнес-данные, а не placeholder в плане.

**Type consistency:**

- `Goal` тип везде из `@/lib/types` (Task 8 определяет — Tasks 10, 16, 27 потребляют).
- `ProfileKey` уже определён в существующем `lib/types.ts`.
- `QuizState` определён в Task 8, используется в `lib/quiz-logic.ts` (существующий) — typecheck в Task 8 это
  подтверждает.
- `reachGoal(goal: Goal)` — единая сигнатура в Task 10, TrackedLink (Task 16), Objections (Task 25), Quiz (Task 27).
- `buildTelegramLink(message: string): string` — единая сигнатура, Task 9 фиксирует, используется в Hero (Task 19),
  FinalCta (Task 23), QuizResult (Task 26).
- Имена компонентов: `Hero`, `Problem`, `Map`, `Transformation`, `Objections`, `FinalCta`, `Quiz`, `Pill`, `GlassCard`,
  `Bridge`, `TrackedLink`, `Reveal`, `StickyCta`, `ProgressBar`, `QuizQuestion`, `QuizResult`, `YandexMetrika` — каждое
  определяется один раз и далее используется без вариаций.

Готово.
