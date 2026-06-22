# Техническая спецификация · MVP лендинга «Тренер у дома»

### Стек: Next.js 16 · TypeScript · Tailwind CSS · разработка через Superpowers (Claude Code)

**Проект:** Каменский Никита — персональные силовые тренировки в шаговой доступности
**Версия спеки:** 2.0 (Next-стек)
**Статус:** готова к разработке
**Заметка о смене стека:** v1.0 описывала чистую статику (один HTML, ноль зависимостей). v2.0 переходит на Next.js,
потому что **фаза 2 — реальный план** (бэкенд приёма заявок, личный кабинет, оплата). При таком горизонте Next оправдан:
лендинг становится первой страницей будущего приложения, а API Routes закрывают бэк без отдельного сервера. Если бы фазы
2 не было — статика была бы правильнее (KISS). Решение принято осознанно.

---

## 0. TL;DR для разработчика

Next.js 16 (App Router, Server Components) + TypeScript (strict) + Tailwind. Лендинг — одна страница, статически
отрендеренная (SSG), быстрая и SEO-дружелюбная. Квиз из 3 вопросов — клиентский компонент, сегментирует на 3 профиля и
формирует deep link в Telegram. Аналитика — Яндекс.Метрика (цели на клики). Хостинг — Vercel.

Разработка ведётся через **Superpowers** (агентный плагин Claude Code): фазами, по TDD-циклу RED→GREEN→REFACTOR, с
разбивкой на микро-задачи 2–5 минут. Поэтому спека даёт **тестируемые критерии** на каждый модуль (раздел 15) — без них
TDD не на что опереть.

Главная метрика успеха MVP: **число входящих заявок в Telegram за неделю.**

---

## 1. Цели и границы MVP

### 1.1. Что делает

- Захват трафика → продающий поток (боль → близость → трансформация → квиз → возражения → CTA).
- Квиз сегментирует на 3 профиля (health / body / energy), выдаёт персональный оффер.
- Заявка уходит в Telegram тренера через deep link с предзаполненным текстом.
- Воронка в Яндекс.Метрике до момента клика по заявке.

### 1.2. Вне скоупа MVP (но архитектурно заложено)

- Нет своего хранилища заявок (deep link, не бот) — фаза 2.
- Нет личного кабинета, оплаты, расписания — фаза 2+.
- Нет А/Б-тестов на старте (структура позволяет добавить).
- **Важно:** код организуется так, чтобы фаза 2 добавлялась, а не переписывалась (раздел 13).

### 1.3. Архитектурные принципы (фильтры из user preferences)

- **KISS:** на MVP — никакой БД, никакого state-менеджера, никаких UI-китов. Квиз = `useReducer`, не Redux.
- **Безопасность по умолчанию:** секреты только в env, никогда в клиенте; валидация на границах; в фазе 2 — токен бота
  на сервере.
- **Масштабируемость без костылей:** доменная логика (контент, профили, скоринг) отделена от презентации — чтобы через
  год не вырывать с мясом.

---

## 2. Технологический стек

| Слой         | Решение                                                                   | Версия / примечание                          |
|--------------|---------------------------------------------------------------------------|----------------------------------------------|
| Фреймворк    | Next.js, App Router, Server Components                                    | 16.x (стабильная ветка)                      |
| Язык         | TypeScript, `strict: true`                                                | catch багов на этапе компиляции              |
| Стили        | Tailwind CSS + дизайн-токены через `@theme`                               | без отдельного CSS-фреймворка                |
| Сборка       | Turbopack (встроен в Next)                                                | быстрый HMR                                  |
| Анимации     | CSS + при необходимости Motion (framer-motion)                            | reveal/scroll — можно чистым CSS             |
| Шрифты       | `next/font/local` (Gerhaus) + `next/font/google` (Nunito, JetBrains Mono) | self-host Gerhaus обязателен                 |
| Аналитика    | Яндекс.Метрика через `next/script`                                        | стратегия `afterInteractive`                 |
| Приём заявок | Telegram deep link (клиент)                                               | фаза 2 — Route Handler + Bot API             |
| Хостинг      | Vercel                                                                    | нативно для Next, HTTPS, env, preview-деплои |
| Линт/формат  | ESLint (`@typescript-eslint`) + Prettier                                  | strict-правила                               |
| Тесты        | Vitest + React Testing Library; Playwright для e2e                        | основа для TDD через Superpowers             |

**Принцип зависимостей:** каждая npm-зависимость должна оправдывать своё присутствие. UI-кит (shadcn и пр.) на MVP **не
** ставим — компонентов мало, Tailwind достаточно. Пересмотр — в фазе 2.

---

## 3. Архитектура проекта (структура файлов)

```
athome/
├── app/
│   ├── layout.tsx            # корневой layout: шрифты, <head>, Метрика, html lang="ru"
│   ├── page.tsx              # сборка лендинга из секций (Server Component)
│   ├── globals.css           # Tailwind + @theme токены + @font-face fallback
│   └── privacy/
│       └── page.tsx          # политика конфиденциальности
├── components/
│   ├── sections/             # презентационные секции (по возможности Server Components)
│   │   ├── Hero.tsx
│   │   ├── Problem.tsx
│   │   ├── Map.tsx
│   │   ├── Transformation.tsx   # BAB
│   │   ├── Objections.tsx       # аккордеон (client)
│   │   └── FinalCta.tsx
│   ├── quiz/                 # КЛИЕНТСКИЙ модуль квиза
│   │   ├── Quiz.tsx          # 'use client' — оркестратор, useReducer
│   │   ├── QuizQuestion.tsx
│   │   ├── QuizResult.tsx
│   │   └── ProgressBar.tsx
│   ├── ui/                   # мелкие переиспользуемые (Button, GlassCard, Bridge, Pill)
│   └── analytics/
│       └── YandexMetrika.tsx # 'use client' — инициализация + reachGoal-хелпер
├── lib/
│   ├── quiz-data.ts          # ВОПРОСЫ, скоринг, профили, офферы (типизировано)
│   ├── telegram.ts           # buildTelegramLink(), шаблоны сообщений
│   ├── analytics.ts          # типобезопасный reachGoal(goal: Goal)
│   └── types.ts              # Profile, QuizState, Goal, и т.д.
├── public/
│   ├── fonts/                # gerhaus.woff2 (+ woff)
│   └── og-image.png          # 1200×630 для шеринга
├── tests/                    # Vitest unit + Playwright e2e
├── tailwind.config.ts        # (если нужен) — но токены лучше через @theme в CSS
├── .env.local.example        # шаблон переменных (без значений)
└── ...
```

**Граница Server / Client:**

- По умолчанию всё — Server Components (быстрее, меньше JS на клиенте).
- `'use client'` только там, где есть интерактив: `Quiz`, `Objections` (аккордеон), `YandexMetrika`, кнопки с `onClick`
  -трекингом.
- Контент (тексты, офферы) живёт в `lib/quiz-data.ts` как типизированные данные — это и есть отделение домена от вида.
  Server Components читают их напрямую.

---

## 4. Доменная модель и типы

`lib/types.ts` — единый источник правды по типам. На них опирается весь TDD.

```ts
export type ProfileKey = 'health' | 'body' | 'energy';

export interface Profile {
    key: ProfileKey;
    badge: string;        // "профиль · здоровье"
    colorVar: string;     // "--color-green" (токен Tailwind/CSS)
    title: string;
    body: string;
    offerTitle: string;
    offerText: string;
    tgMessage: string;    // предзаполненный текст для Telegram
}

export interface QuizOption {
    label: string;
    sub: string;
    scores: ProfileKey;   // какой профиль получает +1
}

export interface QuizQuestion {
    id: number;
    title: string;
    options: QuizOption[];
}

export type Goal =
    | 'quiz_start'
    | 'quiz_complete'
    | `lead_click_${ProfileKey}`
    | 'lead_click_direct'
    | 'objection_open';

export interface QuizState {
    step: number;                       // 0..3
    scores: Record<ProfileKey, number>;
    finished: boolean;
    result: ProfileKey | null;
}
```

**Tie-break при равенстве баллов:** детерминированный приоритет `health → body → energy` (документировать в коде,
покрыть тестом — см. 15.2).

---

## 5. Дизайн-система → Tailwind токены

Источник истины — макет «05 · TYPE & TOKENS». В Next 16 / Tailwind v4 токены задаются через `@theme` в `globals.css` (
предпочтительно) — тогда они доступны и как Tailwind-классы, и как CSS-переменные.

```css
/* globals.css */
@import "tailwindcss";

@theme {
    /* ── Цвет / свет ── */
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

    /* ── Форма / ритм ── */
    --radius-md: 22px;
    --radius-lg: 30px;
    --radius-xl: 42px;
    --blur-md: 18px;

    /* ── Типографика (три голоса) ── */
    --font-display: 'Gerhaus', Georgia, serif;
    --font-body: 'Nunito', 'Segoe UI', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}

/* стекло и линии — как обычные кастом-свойства */
:root {
    --glass: rgba(255, 255, 255, 0.04);
    --line: rgba(255, 255, 255, 0.09);
}
```

Использование в разметке: `className="bg-bg2 text-tx rounded-[--radius-lg]"`, `font-display`, `font-mono` и т.д.

### 5.1. Типографика · три голоса

| Роль             | Шрифт              | Размер / стиль                           | Где                 |
|------------------|--------------------|------------------------------------------|---------------------|
| Дисплейный       | **Gerhaus**        | 27–40pt, 700                             | H1                  |
| Заголовок секции | **Gerhaus**        | clamp 23–32px                            | H2                  |
| Подзаголовок     | **Gerhaus**        | 19px                                     | H3                  |
| Body             | **Nunito**         | 400 / 16px / lh 1.6                      | текст, кнопки       |
| Kicker / метка   | **JetBrains Mono** | 500 / 12–14px / трекинг +2.4 / uppercase | kicker, цифры-герои |

### 5.2. Подключение шрифтов (`next/font`)

```ts
// app/layout.tsx
import localFont from 'next/font/local';
import {Nunito, JetBrains_Mono} from 'next/font/google';

const gerhaus = localFont({
    src: '../public/fonts/gerhaus.woff2',
    variable: '--font-display',
    display: 'swap',
    fallback: ['Georgia', 'serif'],   // обязателен — если woff2 не загрузится, страница не ломается
});
const nunito = Nunito({subsets: ['latin', 'cyrillic'], variable: '--font-body', display: 'swap'});
const mono = JetBrains_Mono({subsets: ['latin'], variable: '--font-mono', display: 'swap'});
// классы variable вешаются на <html>
```

> ⚠️ **Лицензия Gerhaus:** убедиться, что лицензия разрешает web-embedding (self-host woff2). Ответственность заказчика.
> Nunito/JetBrains Mono — открытые, проблем нет.
> ⚠️ Subsets: для русского текста у Nunito подключить `cyrillic`.

### 5.3. Тон голоса

Прямой, тёплый, без сюсюканья и без агрессии. «Сделал — отметили», а не «ты сможешь, если очень захочешь!». Глаголы
действия, короткие фразы, уважение к занятому взрослому. Обращение на «ты». (Из блока «Тон голоса» дизайн-системы.)

---

## 6. Структура страницы и продающие формулы

Поток (каркас **AIDA**; боль по **PMHS** — один раз; трансформация по **BAB**; оффер по **Свойства→Преимущества→Выгоды
**). Между секциями — интерактивные «мостики» (вопрос + кнопка-якорь).

```
Hero            → 1 CTA в квиз; bridge «вроде начинаешь — и снова бросаешь?»
Problem (#pain) → 3 боли + вывод «дело не в лени»; bridge «а если до зала 5 минут?»
Map (#map)      → близость = условие (анимир. карта); bridge «как меняется жизнь?»
Transformation  → BAB до/мост/после; bridge «с чего начать именно тебе?»
Quiz (#test)    → 3 вопроса → профиль → персон. оффер → CTA в Telegram
                  bridge «остались сомнения?»
Objections      → аккордеон, 4 пункта
FinalCta        → квиз ИЛИ прямой контакт
Footer
+ sticky CTA (mobile) → #test
```

Контент блоков и тексты офферов уже зафиксированы в текущей рабочей реализации лендинга — переносятся в
`lib/quiz-data.ts` без изменений. Правки текста — только через заказчика.

⚠️ Названия 3 ЖК и минуты пешком (4 / 8 / 10) — сверить по Яндекс.Картам перед публикацией.

---

## 7. Модуль квиза (клиентский, ядро)

### 7.1. Механика

- 3 вопроса × 3 варианта; каждый ответ → +1 баллу профилю.
- Прогресс-бар 0→33→66→100%.
- После 3-го ответа — результат: профиль с max баллов (tie-break health→body→energy).
- Кнопка «Пройти заново» сбрасывает состояние.

### 7.2. Реализация

- `Quiz.tsx` — `'use client'`, состояние через `useReducer<QuizState>` (не внешний стор — KISS).
- Данные вопросов/профилей импортируются из `lib/quiz-data.ts` (типизировано по `QuizQuestion` / `Profile`).
- На событиях квиза — вызовы `reachGoal` (раздел 9).
- Результирующая кнопка строит ссылку через `buildTelegramLink(profile.tgMessage)`.

```ts
// reducer — псевдо
function quizReducer(state, action) {
    switch (action.type) {
        case 'ANSWER':
            const scores = {...state.scores, [action.profile]: state.scores[action.profile] + 1};
            const step = state.step + 1;
            if (step < 3) return {...state, scores, step};
            return {...state, scores, step, finished: true, result: argmax(scores)};
        case 'RESET':
            return initialState;
    }
}
```

---

## 8. Telegram — приём заявок

### 8.1. MVP: deep link (клиент)

```ts
// lib/telegram.ts
const TG_USERNAME = process.env.NEXT_PUBLIC_TG_USERNAME!;  // env, не хардкод

export function buildTelegramLink(message: string): string {
    return `https://t.me/${TG_USERNAME}?text=${encodeURIComponent(message)}`;
}
```

- Username — публичный, можно в `NEXT_PUBLIC_*`.
- Сообщения по профилям несут метку профиля, чтобы тренер сразу видел сегмент.
- Кнопка: `target="_blank" rel="noopener"`; перед открытием — `reachGoal('lead_click_<profile>')`.

### 8.2. Фаза 2 (НЕ в MVP, но архитектурно готово)

- Форма (имя + контакт + профиль) → `app/api/lead/route.ts` (Route Handler, POST).
- Handler валидирует (zod) и шлёт в Telegram через **Bot API** `sendMessage` на `chat_id` тренера.
- `TG_BOT_TOKEN` и `TG_CHAT_ID` — **серверные** env (без `NEXT_PUBLIC_`), не попадают в клиент.
- Это закрывает дыру аналитики (заявка фиксируется на сервере) и даёт основу для CRM/кабинета.
- Папка `app/api/` и тип `LeadPayload` в `lib/types.ts` закладываются сразу (пустые/заглушка), чтобы фаза 2 была
  дополнением, а не рефакторингом.

---

## 9. Яндекс.Метрика

### 9.1. Установка

`components/analytics/YandexMetrika.tsx` (`'use client'`), подключается в `layout.tsx` через `next/script`, стратегия
`afterInteractive`.

```tsx
<Script id="ym" strategy="afterInteractive">{`
  (function(m,e,t,r,i,k,a){ ... })(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
  ym(${YM_ID}, 'init', { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
`}</Script>
```

`YM_ID` — из `process.env.NEXT_PUBLIC_YM_ID`. `<noscript>` с пиксельным img — тоже добавить.

### 9.2. Типобезопасный reachGoal

```ts
// lib/analytics.ts
import type {Goal} from './types';

declare global {
    interface Window {
        ym?: (id: number, m: string, g: string) => void
    }
}

export function reachGoal(goal: Goal) {
    const id = Number(process.env.NEXT_PUBLIC_YM_ID);
    if (typeof window !== 'undefined' && window.ym) window.ym(id, 'reachGoal', goal);
}
```

Тип `Goal` (раздел 4) не даёт отправить опечатку — цель либо из списка, либо ошибка компиляции.

### 9.3. Цели и воронка

| Цель                   | Когда                               | Что меряет              |
|------------------------|-------------------------------------|-------------------------|
| `quiz_start`           | первый ответ / клик «Пройти разбор» | начали квиз             |
| `quiz_complete`        | показ результата                    | дошли до конца          |
| `lead_click_<profile>` | клик по TG-кнопке результата        | какой сегмент конвертит |
| `lead_click_direct`    | клик по прямой TG-кнопке            | доля «горячих»          |
| `objection_open`       | первое открытие аккордеона          | какие сомнения читают   |

Воронка: `Визит → quiz_start → quiz_complete → lead_click_*`.

> ⚠️ **Честно про дыру аналитики:** заявка отправляется уже в Telegram (вне сайта), поэтому Метрика видит только *клик*,
> а не факт «написал». Реальную конверсию заказчик сверяет вручную: «кликов lead_click_* за неделю» vs «реально
> написавших
> в TG». Разница = потери на стыке. Это лечится фазой 2 (серверная фиксация). Заложить в недельный отчёт.

---

## 10. Переменные окружения

`.env.local` (НЕ в git; в репозитории — `.env.local.example` без значений):

```
NEXT_PUBLIC_TG_USERNAME=kamensky_trener     # публичный, можно в клиент
NEXT_PUBLIC_YM_ID=00000000                  # номер счётчика Метрики
# Фаза 2 (серверные, НЕ NEXT_PUBLIC):
# TG_BOT_TOKEN=...
# TG_CHAT_ID=...
```

На Vercel те же переменные заводятся в Project Settings → Environment Variables.

---

## 11. Адаптивность и доступность

- **Mobile-first** (основной трафик — мобильный: соцсети, чаты ЖК).
- Брейкпоинты Tailwind: `sm`(640) — карточки в колонку, BAB вертикально; `md`(720) — sticky-CTA, нижний паддинг body.
- Таргеты ≥ 44×44px.
- Контраст `--color-tx2/tx3` на `--color-bg-primary` — проверить AA.
- `prefers-reduced-motion` — отключает reveal/scroll-анимации (Tailwind `motion-reduce:` или CSS-медиазапрос).
- Интерактив — нативные `<button>`/`<a>` (клавиатура, скринридеры).
- Один `<h1>`, корректная иерархия, `lang="ru"` на `<html>`, `alt` у смысловых картинок.

---

## 12. Производительность и SEO

- Рендеринг лендинга — **SSG** (статически на билде); клиентского JS минимум (только квиз/аккордеон/метрика).
- Lighthouse mobile цель: Performance ≥ 90, Accessibility ≥ 90, BP ≥ 90, SEO ≥ 95 (SSG облегчает).
- Метаданные через Metadata API (`export const metadata` в `layout.tsx`/`page.tsx`): title, description, OpenGraph,
  `og:image` (1200×630 — критично, ссылку кидают в чаты).
- Шрифты — `next/font` (self-host, без layout shift, `display:swap`).
- Анимации — только `transform`/`opacity`.
- Если появятся фото зала/тренера (рекомендуется для доверия) — `next/image` (WebP, lazy, размеры).

---

## 13. Готовность к фазе 2 (что заложить сейчас, не реализуя)

Чтобы фаза 2 была **дополнением, а не переписыванием**:

- Доменные данные и логика — в `lib/` (контент, скоринг, типы), отделены от компонентов.
- Папка `app/api/` существует (заглушка `route.ts` или пустая) — место для Route Handlers.
- `LeadPayload`, `lead_*`-цели — типы заведены заранее.
- Env-разделение `NEXT_PUBLIC_*` (клиент) vs серверные (секреты) соблюдается с первого дня.
- БД на MVP нет, но выбор (вероятно Postgres + Prisma/Drizzle на Vercel) — зафиксировать в backlog, не тащить сейчас.

> Принцип: MVP не должен содержать «костылей», которые придётся вырывать. Но и не реализуем фазу 2 авансом — только не
> мешаем ей.

---

## 14. Workflow разработки через Superpowers

Superpowers — агентный плагин Claude Code (open-source, маркетплейс Anthropic). Превращает Claude Code в
«senior-разработчика»: разбивает работу на микро-задачи (2–5 мин), ведёт по фазам, применяет TDD.

### 14.1. Фазы (как вести проект)

1. **Brainstorming** — согласовать архитектуру по этой спеке (стек, границы Server/Client, доменная модель). Выход —
   план микро-задач.
2. **Test-Driven Development (RED→GREEN→REFACTOR)** — на каждый модуль сперва тест (падает), потом минимальный код (
   зелёный), потом рефактор. Опора — критерии раздела 15.
3. **Subagent-driven** — параллелизация независимых кусков (например: настройка токенов/Tailwind ║ модуль квиза ║
   интеграция Метрики).
4. **Requesting code review** — качественная проверка перед мержем.
5. **Spec Self-Review** — встроенный чек-лист superpowers прогнать по этой спеке перед стартом (ловит расхождения за ~30
   сек).

### 14.2. Пример разбивки на микро-задачи (старт)

- `init`: создать Next 16 проект (`create-next-app`, TS, Tailwind, App Router) — ~3 мин.
- `tokens`: перенести дизайн-токены в `@theme`, подключить 3 шрифта через `next/font` — ~5 мин.
- `types`: завести `lib/types.ts` (Profile, QuizState, Goal, LeadPayload) — ~3 мин.
- `quiz-data`: перенести вопросы/профили/офферы из текущего лендинга — ~4 мин.
- `quiz-logic` (TDD): reducer + argmax + tie-break, сначала тесты — ~5 мин.
- … далее секции, мостики, аккордеон, метрика, OG, privacy.

### 14.3. Следствие для спеки

Раз superpowers работает по TDD — **каждый модуль обязан иметь тестируемый критерий** (раздел 15). Где критерий нельзя
сформулировать как тест — это сигнал, что требование сформулировано нечётко.

---

## 15. Тестовые критерии (опора для TDD)

### 15.1. Telegram (`lib/telegram.ts`)

- `buildTelegramLink('привет')` → начинается с `https://t.me/`, текст URL-encoded.
- Пустое сообщение → ссылка валидна, без падения.
- Username берётся из env, не захардкожен.

### 15.2. Скоринг квиза (`lib/quiz-logic`)

- 3 ответа health → result `health`.
- Смешанные ответы → побеждает профиль с max баллов.
- **Равенство баллов** (например 1/1/1) → детерминированно `health` (tie-break).
- После 3-го ответа `finished === true`, `step === 3`.
- `RESET` → возврат к `initialState`.

### 15.3. Аналитика (`lib/analytics.ts`)

- `reachGoal` не падает, если `window.ym` отсутствует (SSR / блокировщик).
- Тип `Goal` отвергает строку не из списка (тест компиляции / тип-тест).

### 15.4. Квиз UI (RTL)

- Рендерится 1-й вопрос, прогресс 0%.
- Клик по варианту → 2-й вопрос, прогресс растёт.
- 3 клика → виден экран результата с нужным профилем.
- «Пройти заново» → снова 1-й вопрос.

### 15.5. Аккордеон

- По умолчанию все свёрнуты.
- Клик раскрывает один; повторный/другой — корректно переключает.

### 15.6. e2e (Playwright)

- Пройти квиз до конца, проверить, что TG-кнопка содержит корректный `href` с encoded текстом.
- Мобильный вьюпорт: sticky-CTA виден, ведёт к `#test`.
- `prefers-reduced-motion` — анимации не блокируют контент.

---

## 16. Чек-лист «к продакшену»

**Плейсхолдеры → реальные данные**

- [ ] `NEXT_PUBLIC_TG_USERNAME` → реальный username тренера.
- [ ] `NEXT_PUBLIC_YM_ID` → реальный счётчик Метрики (+ создать цели в кабинете).
- [ ] Минуты пешком (4/8/10) и названия ЖК → сверить по Яндекс.Картам.
- [ ] Цифры доверия (10+ лет, 2–3 года) → подтвердить заказчиком.
- [ ] `public/fonts/gerhaus.woff2` → реальный файл + проверить лицензию на web.
- [ ] `public/og-image.png` (1200×630).
- [ ] `app/privacy/page.tsx` → заполнить, связать из футера.

**Качество**

- [ ] `tsc --noEmit` без ошибок, ESLint чистый.
- [ ] Все тесты (15.x) зелёные.
- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 90, SEO ≥ 95.
- [ ] Проверено на реальном iOS Safari и Android Chrome (особенно открытие Telegram).
- [ ] Метрика: цели срабатывают (отчёт «по кликам»).

**Деплой**

- [ ] Env заведены в Vercel.
- [ ] Прод-домен + HTTPS.
- [ ] `.env.local` не в git; `.env.local.example` — в git.

---

## 17. После MVP (приоритет по влиянию)

1. **Социальное доказательство** — сейчас почти нет (только цифры). Первые 2–3 реальных отзыва / фото «до-после» (с
   согласия) поднимут конверсию сильнее любой правки. Блок между Map и Transformation.
2. **Замер отвала по мостикам** — если Метрика покажет уход до квиза, поднять квиз выше.
3. **Фаза 2: серверный приём заявок** (раздел 8.2) — закрывает дыру аналитики, фундамент CRM/кабинета.
4. А/Б заголовка hero — после ~неск. сотен визитов.
5. БД + кабинет + оплата — по мере роста (backlog).

---

*Конец спецификации v2.0. Контентные тексты блоков и офферов — в текущей рабочей реализации лендинга; данная спека
описывает архитектуру, стек, токены, интеграции, тестовые критерии и порядок реализации через Superpowers.*
