# Design · MVP лендинга «Тренер у дома»

**Дата:** 2026-05-29
**Базовая спека:** [`SPEC.md`](../../../SPEC.md) v2.0
**Статус:** утверждён пользователем, готов к декомпозиции в план

Этот документ фиксирует решения брейншторма поверх SPEC и закрывает места, где SPEC оставил выбор. Всё, что в SPEC уже зафиксировано (стек, граница server/client, токены, типы), — здесь не дублируется, только дополняется.

## 0. Решения, принятые в брейншторме

| Тема | Решение | Источник |
|---|---|---|
| Контент секций и квиза | Уже лежит в `lib/quiz-data.ts` + `lib/types.ts` + `lib/quiz-logic.ts` + `lib/telegram.ts` | пользователь добавил до старта |
| Скоуп итерации | Полная production-ready реализация | пользователь |
| Reveal/scroll-анимации | Чистый CSS + IntersectionObserver, без framer-motion | пользователь (KISS) |
| Глубина TDD | Полный набор §15.1–§15.6 (Vitest + RTL + Playwright) | пользователь |
| Шрифт Gerhaus | `public/fonts/gerhaus/Gerhaus.ttf` (OFL 1.1 — web-embedding разрешён), `next/font/local` напрямую | пользователь |
| OG image | Сгенерировать через Next App Router `opengraph-image.tsx` по токенам | дефолт |
| Privacy policy | Стандартный шаблон под 152-ФЗ, заказчик потом верифицирует | дефолт |
| TG username, YM ID, минуты к 3 ЖК | Плейсхолдеры + чек-лист §16 | дефолт |

## 1. Финальная структура файлов и граница server/client

```
app/
├── layout.tsx               (server) lang=ru, шрифты, метадата, YandexMetrika в <body>
├── page.tsx                 (server) композиция секций
├── globals.css              @import tailwindcss + @theme токены §5
├── opengraph-image.tsx      (server) генерация 1200×630 OG из токенов
├── privacy/page.tsx         (server) шаблон 152-ФЗ
└── api/.gitkeep             пустышка под фазу 2 (без route.ts)

components/
├── analytics/
│   └── YandexMetrika.tsx    'use client' — <Script strategy="afterInteractive">
├── ui/
│   ├── Reveal.tsx           'use client' — IntersectionObserver-обёртка над children
│   ├── TrackedLink.tsx      'use client' — <a> с onClick→reachGoal
│   ├── Pill.tsx             (server) текстовая «таблетка»
│   ├── GlassCard.tsx        (server) стеклянный контейнер (token --glass)
│   ├── Bridge.tsx           (server) вопрос + кнопка-якорь (без трекинга)
│   └── StickyCta.tsx        (server) mobile-only, ведёт к #test
├── sections/
│   ├── Hero.tsx             (server) — TrackedLink на «Пройти разбор» → #test
│   ├── Problem.tsx          (server) — 3 GlassCard внутри Reveal
│   ├── Map.tsx              (server) — центр + 3 точки, SVG
│   ├── Transformation.tsx   (server) — BAB две колонки + Bridge
│   ├── Objections.tsx       'use client' — аккордеон, useState, reachGoal('objection_open') один раз
│   └── FinalCta.tsx         (server) — две TrackedLink: квиз и прямой TG
└── quiz/
    ├── Quiz.tsx             'use client' — useReducer(quizReducer, initialState)
    ├── ProgressBar.tsx      (server) — чистая презентация
    ├── QuizQuestion.tsx     (server) — кнопки получают onClick через children prop
    └── QuizResult.tsx       (server) — карточка профиля + TrackedLink на TG

lib/
├── types.ts                 расширить: QuizState, Goal (template-literal), LeadPayload
├── quiz-data.ts             ✅ есть
├── quiz-logic.ts            ✅ есть (после расширения types.ts — заработает импорт QuizState)
├── telegram.ts              ✅ есть; убрать non-null assertion, добавить безопасный fallback для SSR/тестов
└── analytics.ts             reachGoal(goal: Goal) — no-op при отсутствии window.ym

public/
└── fonts/gerhaus/Gerhaus.ttf  ✅ + License.txt + readme.txt (оставить рядом — OFL требует включать копию)

tests/
├── setup.ts                 RTL + @testing-library/jest-dom
├── lib/
│   ├── telegram.test.ts     §15.1
│   ├── quiz-logic.test.ts   §15.2
│   └── analytics.test.ts    §15.3
├── components/
│   ├── Quiz.test.tsx        §15.4
│   └── Objections.test.tsx  §15.5
└── e2e/
    ├── quiz-flow.spec.ts    §15.6 — Hero → 3 ответа → результат, проверка href TG (encoded)
    ├── mobile-sticky.spec.ts  mobile-viewport, sticky-CTA видна, ведёт к #test
    └── reduced-motion.spec.ts  prefers-reduced-motion → контент виден без анимаций

vitest.config.ts             jsdom, setupFiles=tests/setup.ts, alias '@'
playwright.config.ts         webServer: next dev, 1 браузер (chromium) на старте

.env.local.example           NEXT_PUBLIC_TG_USERNAME=, NEXT_PUBLIC_YM_ID=
```

### Принципы границы server/client

- **TrackedLink** — единственная клиентская точка для CTA в серверных секциях. Это минимизирует `'use client'`: один маленький компонент-обёртка вместо клиент-ификации целых Hero/FinalCta/StickyCta.
- **Reveal** — клиент-обёртка с `IntersectionObserver`; внутри держит server-children через `children` prop.
- **YandexMetrika** инициализируется один раз в `layout.tsx`; цели — через `lib/analytics.reachGoal()` из любого client-компонента.
- **Bridge** — серверный (просто `<a href="#anchor">`), потому что клики по мостикам по SPEC §9.3 не трекаются.

## 2. Доменная модель — расширения типов

`lib/types.ts` уже содержит `Profile`, `QuizOption`, `QuizQuestion`, `BridgeContent`, `SiteContent`. Добавляем недостающие из SPEC §4 и §8.2:

```ts
export interface QuizState {
  step: 0 | 1 | 2 | 3;
  scores: Record<ProfileKey, number>;
  finished: boolean;
  result: ProfileKey | null;
}

export type Goal =
  | 'quiz_start'
  | 'quiz_complete'
  | `lead_click_${ProfileKey}`
  | 'lead_click_direct'
  | 'objection_open';

export interface LeadPayload {        // фаза 2, не используется в MVP
  name: string;
  contact: string;
  profile: ProfileKey;
  source: 'quiz' | 'direct';
}
```

После расширения `lib/quiz-logic.ts` (где импортируется `QuizState`) скомпилируется без правок.

## 3. Поток событий аналитики

| Событие | Где | Цель |
|---|---|---|
| Первый ответ в квизе | `Quiz.tsx` — `dispatch ANSWER` при `step===0` | `quiz_start` |
| Показ результата | `Quiz.tsx` — `useEffect` на `finished===true` с `useRef`-флагом «уже отправлено» | `quiz_complete` |
| Клик по TG-кнопке результата | `QuizResult.tsx` через `TrackedLink` | `lead_click_${result}` |
| Клик по прямой TG (Hero/FinalCta/StickyCta) | `TrackedLink` | `lead_click_direct` |
| Первое раскрытие пункта аккордеона | `Objections.tsx` — `useRef`-флаг «уже отправлено» | `objection_open` |

Каждая цель шлётся ровно один раз за визит, повторные клики не дублируются.

## 4. Точечные правки уже существующего `lib/`

- `lib/telegram.ts` — заменить `process.env.NEXT_PUBLIC_TG_USERNAME!` (упадёт в тестах) на чтение через функцию-геттер с fallback. Тест §15.1 ставит env через `vi.stubEnv` и проверяет схему `https://t.me/<user>?text=<encoded>`. Без env — корректная ссылка с заглушкой `placeholder`, без throw, чтобы dev/build/тесты не падали; чек-листом §16 пользователь обязан подменить.
- `lib/quiz-logic.ts` — корректность tie-break и argmax подтверждена прогоном вручную:
  - `[3,0,0]→health`, `[0,3,0]→body`, `[0,0,3]→energy`
  - `[1,1,1]→health`, `[0,1,1]→body`, `[1,0,1]→health`, `[1,1,0]→health`
  Все случаи покрываются тестом §15.2.

## 5. Тестовая стратегия

| Файл | Что проверяет | Уровень |
|---|---|---|
| `tests/lib/telegram.test.ts` | URL-encoding кириллицы и спецсимволов, схема `https://t.me/`, env-источник через `vi.stubEnv`, пустое сообщение | Vitest |
| `tests/lib/quiz-logic.test.ts` | `resolveResult` на всех сценариях (включая tie-break), `quizReducer ANSWER/RESET`, `step` и `finished` после 3-го ответа | Vitest |
| `tests/lib/analytics.test.ts` | no-op без `window.ym`; вызов `window.ym(id,'reachGoal',goal)` с моком | Vitest |
| `tests/components/Quiz.test.tsx` | 1-й вопрос виден, прогресс 0%; клик → 2-й, прогресс растёт; 3 клика → виден результат с нужным профилем; «Пройти заново» → 1-й вопрос | RTL |
| `tests/components/Objections.test.tsx` | свёрнуто по умолчанию; клик раскрывает один; повторный/другой — корректно переключает | RTL |
| `tests/e2e/quiz-flow.spec.ts` | Hero → клик CTA → 3 ответа → результат; `href` TG-кнопки содержит `t.me/<user>?text=<encoded>` | Playwright |
| `tests/e2e/mobile-sticky.spec.ts` | mobile-viewport (375×812): sticky-CTA в DOM и видна; клик скроллит к `#test` | Playwright |
| `tests/e2e/reduced-motion.spec.ts` | `prefers-reduced-motion: reduce` — все секции и контент видимы (Reveal не блокирует) | Playwright |

**DevDeps:** `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `@playwright/test`. Prettier — отдельно.

**Скрипты `package.json`:**
- `test` → `vitest run`
- `test:watch` → `vitest`
- `test:e2e` → `playwright test`
- `typecheck` → `tsc --noEmit`
- `lint` уже есть

## 6. План реализации — фазы

```
Фаза A · Фундамент
  - расширить globals.css токенами §5 (@theme)
  - подключить шрифты (Gerhaus local, Nunito с cyrillic, JetBrains Mono)
  - переписать layout.tsx: lang=ru, метадата, переменные шрифтов, slot для YandexMetrika
  - .env.local.example
  - package.json: добавить devDeps и scripts (test/test:watch/test:e2e/typecheck)
  - vitest.config.ts + tests/setup.ts (jsdom + jest-dom)
  - playwright.config.ts

Фаза B · Доменный слой (TDD)
  - lib/types.ts: добавить QuizState, Goal, LeadPayload
  - lib/telegram.ts: убрать non-null assertion, добавить безопасный fallback
  - lib/analytics.ts: reachGoal(goal) + window.ym typing
  - RED→GREEN→REFACTOR: §15.1, §15.2, §15.3 — зелёные перед UI

Фаза C · UI-примитивы
  - ui/Pill, GlassCard, Bridge (server)
  - ui/TrackedLink, Reveal (client)
  - ui/StickyCta (server, mobile-only через md:hidden)

Фаза D · Server-секции и сборка страницы
  - components/sections/Hero, Problem, Map, Transformation, FinalCta
  - app/page.tsx: композиция секций + bridges + StickyCta
  - визуальная проверка в next dev (mobile + desktop)

Фаза E · Клиентский интерактив (TDD)
  - Objections аккордеон + §15.5
  - Quiz + ProgressBar + QuizQuestion + QuizResult + §15.4

Фаза F · Аналитика, privacy, OG, фаза-2 заглушка
  - components/analytics/YandexMetrika.tsx + подключение в layout
  - app/privacy/page.tsx — шаблон 152-ФЗ + ссылка из футера
  - app/opengraph-image.tsx — Next OG из токенов
  - app/api/.gitkeep

Фаза G · E2E и аудит
  - Playwright §15.6: quiz-flow, mobile-sticky, reduced-motion
  - локально tsc/lint/test/test:e2e — всё зелёное
  - Lighthouse mobile прогон (информативно, не блокер плана)
  - заполнить чек-лист §16 (отметить, что требует прод-данных от заказчика)
```

## 7. Что НЕ делаем в этой итерации

- Не пишем `app/api/lead/route.ts` — только `.gitkeep`, чтобы папка осталась в git.
- Не делаем БД, Prisma, личный кабинет, оплату (фаза 2+).
- Не делаем A/B-тесты заголовка Hero (после ~неск. сотен визитов, §17).
- Не делаем социальное доказательство (отзывы, фото до/после) — нет материала; §17 пункт 1.
- Не оптимизируем Gerhaus.ttf в woff2 — 147 KB приемлемо, можно отдельной задачей.
- Не подменяем плейсхолдеры реальными значениями (TG, YM, минуты к ЖК) — это работа после кода, по чек-листу §16.

## 8. Риски и допущения

| Риск | Mitigation |
|---|---|
| Next 16 имеет отличия от привычного API (см. AGENTS.md) | При сомнении — читать `node_modules/next/dist/docs/`, не доверять памяти |
| Tailwind 4 + `@theme` — относительно свежий синтаксис | Тестируем на `next dev` каждое изменение токенов |
| `next/font/local` с TTF — поддерживается, но woff2 предпочтительнее | OK для MVP, оптимизация в backlog |
| Playwright в CI потребует системных бинарей браузера | Локально хватает `npx playwright install chromium`; CI вне MVP-скоупа |
| Отсутствие реальных env при e2e | Тест проверяет паттерн `t.me/<любой>?text=...`, не точный username |
| OFL 1.1 требует копию лицензии рядом с шрифтом | Файлы `License.txt` и `readme.txt` остаются в `public/fonts/gerhaus/` |
