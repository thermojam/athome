# Техническая спецификация v3.0 · Лендинг «Тренер у дома»
### Next.js 16 · TypeScript · Tailwind · разработка через Superpowers

**Проект:** Каменский Никита — персональные силовые тренировки в шаговой доступности (СПб, Приморский пр., 56)
**Статус:** готова к спринту 2
**Что нового в v3.0 относительно v2.0 + аддендума:**
1. Всё сведено в один документ (спека + визуальные правила + новые блоки).
2. Премиум-дизайн стал **обязательной частью DoD**, а не «значениями токенов» (ретро спринта 1).
3. Новая секция **карта локации** (premium, заменяет старую плоскую Map).
4. Новая секция **слот записи** — с честной MVP-логикой (выбор времени → Telegram, без фейковой брони).

**Живые референсы (открыть перед версткой, копировать оттуда — НЕ воображать по тексту):**
- `VISUAL-REFERENCE.html` — премиум-приёмы (фон, стекло, hairline, glow) с комментариями в CSS.
- `blocks-location-slot.html` — готовая карта локации + слот записи.
- `CONTENT-trener-u-doma.md` — все тексты + типизированный TS.
- Скрин дизайн-системы «05 · TYPE & TOKENS» — первоисточник палитры и типографики.

---

## 0. TL;DR

Next.js 16 (App Router, Server Components) + TS (strict) + Tailwind. Лендинг — одна SSG-страница. Квиз (3 вопроса) сегментирует на 3 профиля → персональный оффер → deep link в Telegram. Плюс две новые секции: премиум-карта локации и слот записи (честный MVP: выбор времени уходит в Telegram, бронь — фаза 2). Аналитика — Яндекс.Метрика (цели на клики). Хостинг — Vercel. Разработка — через Superpowers по TDD + визуальный review-gate.

**Главная метрика:** число входящих заявок в Telegram за неделю.

**Принцип спринта 2:** не «собрать по токенам», а «неотличимо по породе от дизайн-системы».

---

## 1. Цели и границы MVP

### 1.1. В скоупе MVP
- Продающий поток (боль → близость → трансформация → квиз → слот → возражения → CTA).
- Квиз: сегментация на health/body/energy, персональный оффер.
- **Карта локации** (premium) — главное УТП «зал рядом».
- **Слот записи** — выбор удобного времени → Telegram с этим временем.
- Заявки — Telegram deep link.
- Аналитика — Метрика до клика по заявке.

### 1.2. Вне скоупа (фаза 2, архитектурно заложено)
- Реальная бронь слотов (нужен бэк, источник правды о расписании).
- Серверный приём заявок (Route Handler + Bot API).
- Личный кабинет, оплата, БД.

### 1.3. Принципы (фильтры)
- **KISS:** на MVP нет БД, стора, UI-китов. Квиз — `useReducer`.
- **Безопасность по умолчанию:** секреты только в env; в фазе 2 токен бота на сервере.
- **Масштабируемость без костылей:** домен (контент, профили, скоринг, слоты) отделён от презентации; новые фичи добавляются, а не переписываются.
- **Честность интерфейса:** UI не обещает то, чего система не делает (см. §9 слот).

---

## 2. Технологический стек

| Слой | Решение | Примечание |
|---|---|---|
| Фреймворк | Next.js 16, App Router, Server Components | SSG для лендинга |
| Язык | TypeScript, `strict:true` | |
| Стили | Tailwind v4 + токены через `@theme` в `globals.css` | + компонент-классы для premium-карточек |
| Сборка | Turbopack | |
| Анимации | CSS (reveal/radar); Motion только если нужно | `prefers-reduced-motion` обязателен |
| Шрифты | `next/font/local` (Gerhaus) + `next/font/google` (Nunito+cyrillic, JetBrains Mono) | |
| Аналитика | Яндекс.Метрика через `next/script` (`afterInteractive`) | |
| Заявки | Telegram deep link (клиент) | фаза 2 — Route Handler + Bot API |
| Хостинг | Vercel | |
| Тесты | Vitest + RTL; Playwright (e2e) | основа TDD |

UI-кит (shadcn и пр.) на MVP **не** ставим. Каждая зависимость оправдывает себя.

---

## 3. Структура проекта

```
trener-u-doma/
├── app/
│   ├── layout.tsx            # шрифты, <head>, Метрика, html lang="ru", градиентный фон
│   ├── page.tsx              # сборка секций (Server Component)
│   ├── globals.css           # Tailwind @theme токены + premium производные + @font-face fallback
│   ├── api/                  # ЗАГЛУШКА под фазу 2 (lead/route.ts, booking/route.ts)
│   └── privacy/page.tsx
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Problem.tsx
│   │   ├── LocationMap.tsx       # НОВОЕ — premium карта (client из-за hover/анимации опц.)
│   │   ├── Transformation.tsx    # BAB
│   │   ├── BookingSlot.tsx       # НОВОЕ — слот записи (client: выбор + deep link)
│   │   ├── Objections.tsx        # аккордеон (client)
│   │   └── FinalCta.tsx
│   ├── quiz/ { Quiz, QuizQuestion, QuizResult, ProgressBar }
│   ├── ui/   { Button, GlassCard, Bridge, Pill, Badge }
│   └── analytics/YandexMetrika.tsx
├── lib/
│   ├── content.ts            # ВЕСЬ статический контент (из CONTENT-trener-u-doma.md, раздел B)
│   ├── quiz-data.ts          # вопросы, профили, офферы
│   ├── quiz-logic.ts         # reducer + скоринг (под TDD)
│   ├── slots-data.ts         # НОВОЕ — демо-слоты (фаза 2: приходят с бэка)
│   ├── telegram.ts           # buildTelegramLink + шаблоны
│   ├── analytics.ts          # типобезопасный reachGoal
│   └── types.ts              # все типы
├── public/ { fonts/gerhaus.woff2, og-image.png }
└── tests/
```

**Server/Client граница:** по умолчанию Server. `'use client'` — только `Quiz`, `BookingSlot`, `Objections`, `YandexMetrika`, кнопки с трекингом. `LocationMap` может остаться Server, если радар чисто CSS-анимация (предпочтительно).

---

## 4. Доменная модель (`lib/types.ts`)

```ts
export type ProfileKey = 'health' | 'body' | 'energy';

export interface Profile {
  key: ProfileKey; badge: string; colorVar: string;
  title: string; body: string; offerTitle: string; offerText: string; tgMessage: string;
}
export interface QuizOption { label: string; sub: string; scores: ProfileKey; }
export interface QuizQuestion { id: number; title: string; options: QuizOption[]; }
export interface QuizState {
  step: number; scores: Record<ProfileKey, number>; finished: boolean; result: ProfileKey | null;
}

// НОВОЕ — слоты
export interface Slot {
  id: string;
  day: string;        // "Вторник"
  time: string;       // "19:00"
  label: string;      // "Персональная · 60 мин · зал у дома"
  status: 'free' | 'busy';   // на MVP только подтверждённые 'free'; источник правды — тренер
  profileHint?: ProfileKey;  // тег профиля на карточке (опц.)
  walkMinutes?: number;      // "3 мин пешком"
}

// НОВОЕ — фаза 2
export interface LeadPayload { name: string; contact: string; profile?: ProfileKey; slotId?: string; }

export type Goal =
  | 'quiz_start' | 'quiz_complete'
  | `lead_click_${ProfileKey}` | 'lead_click_direct'
  | 'slot_select' | 'slot_take'          // НОВОЕ
  | 'objection_open';
```

**Tie-break квиза:** детерминированный приоритет `health → body → energy`.

---

## 5. ДИЗАЙН-СИСТЕМА (обязательная — приоритет над дефолтами Tailwind)

> Ретро спринта 1: плоско вышло потому, что были даны **значения** токенов, но не **рецепт премиальности**. Здесь — рецепт. Секция готова, только когда положена рядом с дизайн-системой и отличается лишь контентом, не уровнем отделки.

### 5.1. Токены (`globals.css` → `@theme` + `:root`)
```css
@theme {
  --color-cyan:#2CE6FF; --color-violet:#8B5CFF; --color-pink:#FF4FD8;
  --color-green:#36FF9D; --color-orange:#FF9F43; --color-blue:#4D7DFF;
  --color-bg-primary:#0E1117; --color-bg2:#151923; --color-bg3:#1B2030;
  --color-tx:#E8ECF4; --color-tx2:#9AA3B5; --color-tx3:#5E6678;
  --radius-md:22px; --radius-lg:30px; --radius-xl:42px; --blur-md:18px;
  --font-display:'Gerhaus',Georgia,serif; --font-body:'Nunito','Segoe UI',sans-serif; --font-mono:'JetBrains Mono',monospace;
}
:root{
  /* ПРОИЗВОДНЫЕ премиальности — без них не собрать «дорого» */
  --glass-bg:linear-gradient(180deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.02) 40%,rgba(255,255,255,0.012) 100%);
  --glass-bg-solid:#141925;
  --line:rgba(255,255,255,0.09);
  --line-soft:rgba(255,255,255,0.055);
  --edge-highlight:inset 0 1px 0 rgba(255,255,255,0.10);
  --lift:0 1px 2px rgba(0,0,0,0.4),0 8px 24px rgba(0,0,0,0.35),0 24px 60px rgba(0,0,0,0.30);
  --glow-cyan:0 0 14px 1px rgba(44,230,255,0.6);
  --glow-green:0 0 14px 1px rgba(54,255,157,0.6);
  --glow-pink:0 0 14px 1px rgba(255,79,216,0.6);
  --glow-orange:0 0 14px 1px rgba(255,159,67,0.6);
  --bg-gradient:
    radial-gradient(120% 80% at 50% -10%,rgba(139,92,255,0.16) 0%,rgba(139,92,255,0) 45%),
    radial-gradient(90% 60% at 80% 0%,rgba(44,230,255,0.09) 0%,rgba(44,230,255,0) 50%),
    linear-gradient(180deg,#121624 0%,#0E1117 40%,#0A0D13 100%);
}
```

### 5.2. Пять приёмов премиальности (ОБЯЗАТЕЛЬНЫ на каждой секции)

**1. Градиентный фон** — НЕ плоская заливка. На `body`:
```css
body{ background-color:var(--color-bg-primary); background-image:var(--bg-gradient); background-attachment:fixed; }
```

**2. Стеклянная карточка** — главный блок, собирается из СЛОЁВ (один слой = плоско):
```css
.card{
  background-color:var(--glass-bg-solid); background-image:var(--glass-bg);
  border:1px solid var(--line); border-radius:var(--radius-xl);    /* КРУПНЫЙ 42px */
  box-shadow:var(--edge-highlight),var(--lift); backdrop-filter:blur(var(--blur-md));
  padding:34px 36px;
}
```
В Tailwind — оформить как компонент-класс (`@layer components`), НЕ размазывать утилитами (забудут слой → опять плоско).

**3. Hairline-разделители** внутри карточек: `border-bottom:1px solid var(--line-soft)`, у последнего — `none`.

**4. Неоновый glow** на акцентах (точки профилей, активный слот, цифры, главная кнопка): `box-shadow:var(--glow-cyan)` и т.п.

**5. Крупные радиусы + воздух:** радиусы 30–42px для крупных блоков (мелкий запрещён); между секциями 64–96px; внутренние паддинги карточек 30–36px (не 16).

### 5.3. Типографика (зафиксировано, споров нет)
- H1/H2/H3 — **Gerhaus, UPPERCASE** (капс верен, подтверждён эталоном), `letter-spacing:-0.2…-0.5px`.
- Body — **Nunito** 16px / lh 1.6, обычный регистр.
- Kicker/метки/цифры — **JetBrains Mono**, uppercase, трекинг +2.4.
- Gerhaus → fallback Georgia,serif (обязателен). Nunito subset `cyrillic` (обязателен).

### 5.4. Кнопки
- **Главная:** циан-градиент + glow + светящееся кольцо `0 0 0 1px rgba(44,230,255,.5)`.
- **«Занять слот»:** градиент violet→blue→cyan + крупный glow (см. `blocks-location-slot.html`).
- **Вторичная:** стекло + тонкий бордер. Никогда две главные рядом.

---

## 6. Структура страницы и продающие формулы

Каркас **AIDA**; боль по **PMHS** (один раз); трансформация по **BAB**; оффер **Свойства→Преимущества→Выгоды**. Между секциями — интерактивные «мостики» (вопрос + кнопка-якорь).

```
Hero            → 1 главная + 1 вторичная CTA; bridge → #pain
Problem (#pain) → 3 боли + вывод «дело не в лени»; bridge → #map
LocationMap (#map) → premium-карта (§8); bridge → #bab
Transformation (#bab) → BAB; bridge → #test
Quiz (#test)    → 3 вопроса → профиль → оффер → CTA в Telegram; bridge → #booking
BookingSlot (#booking) → слот записи (§9); bridge → #objections
Objections (#objections) → аккордеон
FinalCta (#final) → квиз ИЛИ прямой контакт
Footer + sticky CTA (mobile → #test)
```

Все тексты — в `lib/content.ts` (из `CONTENT-trener-u-doma.md`). Правки — только через заказчика.

---

## 7. Квиз (ядро, клиент)

3 вопроса × 3 варианта, +1 баллу профилю. Прогресс-бар. После 3-го — результат (max баллов, tie-break health→body→energy). Состояние — `useReducer`, без внешнего стора. Данные — из `lib/quiz-data.ts`. На событиях — `reachGoal`. Кнопка результата — `buildTelegramLink(profile.tgMessage)`.

```ts
function quizReducer(state, action){
  switch(action.type){
    case 'ANSWER': {
      const scores={...state.scores,[action.profile]:state.scores[action.profile]+1};
      const step=state.step+1;
      if(step<3) return {...state,scores,step};
      return {...state,scores,step,finished:true,result:resolveResult(scores)};
    }
    case 'RESET': return initialState;
  }
}
```

---

## 8. НОВОЕ · Карта локации (`LocationMap.tsx`)

Premium-замена старой плоской Map. Эталон верстки — `blocks-location-slot.html`, блок 1.

**Состав (3 колонки на десктопе, стек на мобиле):**
- Левая: kicker «ЗАЛ У ДОМА — УДОБНО И РЕАЛЬНО» + H2 «Тренировки рядом с вами» + короткий текст.
- Центр: квадратная стеклянная карта —
  - SVG-подложка: сетка улиц + диагональный проспект (приглушённые линии);
  - радар: 3 концентрических кольца вокруг центра (cyan→violet, убывающая яркость), мягкая CSS-пульсация (`@keyframes pulse`, отключается при `prefers-reduced-motion`);
  - центр: «дом-зал» — скруглённый бейдж с градиентом violet→cyan, инициалы/иконка, glow + подпись «ЗАЛ · Приморский пр., 56»;
  - 3 пина ЖК (SVG-капли) на разной высоте, цвета cyan/violet/green, с тенью и «ping».
- Правая: список ЖК с цветными засечками-glow, временем (моно) и названием.

**Данные:** из `CONTENT.map` (`points`: name + time + цвет-tick). ⚠️ названия ЖК и минуты — сверить по Яндекс.Картам.
**Логики нет** — чистая верстка. Может быть Server Component (если радар — чистый CSS).

---

## 9. НОВОЕ · Слот записи (`BookingSlot.tsx`) — ЧЕСТНЫЙ MVP

Эталон верстки — `blocks-location-slot.html`, блок 2.

### 9.1. Что это и чего это НЕ
- **Это:** выбор удобного времени → переход в Telegram с выбранным слотом в тексте сообщения.
- **Это НЕ бронь.** На MVP нет бэка → нет источника правды о занятости. Кнопка «Занять слот» НЕ резервирует время — она открывает Telegram.

> **Критично (честность интерфейса):** нельзя показывать «забронировано» после клика — человек подумает, что место за ним, а оно не закреплено. Это хуже, чем отсутствие слота: бьёт по доверию с первого касания. Поэтому под кнопкой обязательна подпись «Откроется Telegram с выбранным временем — подтвердим лично».

### 9.2. Состав
- Стеклянная карточка: «{день} · {время}», подзаголовок (тип/длительность/«зал у дома»), бейдж «свободно» (зелёный glow) — **только для подтверждённых тренером слотов**.
- Теги: профиль (cyan-акцент) + «N мин пешком».
- Сетка чипов выбора слота (день+время); выбранный — неоновое кольцо cyan.
- Кнопка «Занять слот →» (градиент violet→blue→cyan) → deep link.
- Подпись-честность под кнопкой.

### 9.3. Логика (клиент)
```ts
// при выборе чипа: reachGoal('slot_select'); пересобрать ссылку
// при клике «Занять»: reachGoal('slot_take')
const msg = `Привет! Хочу записаться на персональную тренировку. Удобное время: ${selected}. Зал у дома (Приморский пр., 56).`;
href = buildTelegramLink(msg);
```

### 9.4. Данные слотов (`lib/slots-data.ts`)
- MVP: статичный массив `Slot[]` со `status:'free'` — **только время, которое тренер реально держит открытым** (заказчик задаёт). Не выдумывать «свободно».
- Фаза 2: тот же массив приходит с бэка (расписание + актуальный статус), кнопка → реальная бронь через Route Handler. **Компонент не переписывается** — меняется источник данных и обработчик кнопки.

### 9.5. Размещение
Между квизом (`#test`) и возражениями (`#objections`), якорь `#booking`. Логика потока: квиз определил профиль → предложили конкретное время → возражения добиваем → финал.

---

## 10. Telegram

```ts
// lib/telegram.ts
const TG = process.env.NEXT_PUBLIC_TG_USERNAME!;
export function buildTelegramLink(message: string){ return `https://t.me/${TG}?text=${encodeURIComponent(message)}`; }
```
- Username публичный (`NEXT_PUBLIC_`). Сообщения профилей несут метку сегмента; слот — выбранное время.
- Кнопки: `target="_blank" rel="noopener"`; перед открытием — `reachGoal`.
- **Фаза 2:** форма → `app/api/lead/route.ts` (zod-валидация) → Bot API `sendMessage`. `TG_BOT_TOKEN`/`TG_CHAT_ID` — серверные env, не в клиенте.

---

## 11. Яндекс.Метрика

`YandexMetrika.tsx` (`'use client'`) в `layout.tsx`, `next/script` `afterInteractive`, init с `webvisor:true`. `YM_ID` из `NEXT_PUBLIC_YM_ID`. Типобезопасный хелпер:
```ts
export function reachGoal(goal: Goal){
  const id=Number(process.env.NEXT_PUBLIC_YM_ID);
  if(typeof window!=='undefined' && window.ym) window.ym(id,'reachGoal',goal);
}
```
Тип `Goal` ловит опечатки на компиляции.

**Цели:** `quiz_start`, `quiz_complete`, `lead_click_<profile>`, `lead_click_direct`, **`slot_select`**, **`slot_take`**, `objection_open`.
**Воронка:** `Визит → quiz_start → quiz_complete → (lead_click_* | slot_take)`.

> ⚠️ Дыра аналитики: заявка/слот уходят в Telegram (вне сайта) — Метрика видит только *клик*, не факт «написал». Реальную конверсию заказчик сверяет вручную: клики vs входящие в TG. Лечится фазой 2. Заложить в недельный отчёт.

---

## 12. Env

```
NEXT_PUBLIC_TG_USERNAME=kamensky_trener
NEXT_PUBLIC_YM_ID=00000000
# Фаза 2 (серверные, без NEXT_PUBLIC):
# TG_BOT_TOKEN=...
# TG_CHAT_ID=...
```
`.env.local` не в git; `.env.local.example` — в git. На Vercel — Project Settings.

---

## 13. Адаптивность, доступность, перформанс

- **Mobile-first.** Брейкпоинты: ≤640 — карты/BAB/слот-грид в колонку; ≤720 — sticky-CTA.
- Карта локации: 3 колонки → стек; слот-чипы — `auto-fit minmax`.
- Таргеты ≥44×44px; контраст `--tx2/tx3` на фоне — AA; `prefers-reduced-motion` отключает radar/reveal.
- Нативные `<button>/<a>`; один `<h1>`; `lang="ru"`; `alt` у смысловых.
- Рендеринг — SSG; клиентского JS минимум (квиз/слот/аккордеон/метрика).
- Lighthouse mobile: Perf ≥90, A11y ≥90, SEO ≥95.
- Шрифты `next/font` (`display:swap`); анимации только `transform`/`opacity`; фото (если будут) — `next/image` WebP.
- Метаданные — Metadata API: title, description, OpenGraph + `og:image` 1200×630 (критично для шеринга в чаты).

---

## 14. Workflow через Superpowers + визуальный gate

Фазы: brainstorm (сверить архитектуру) → TDD (RED→GREEN→REFACTOR) → subagent (параллелить независимое) → code review → Spec Self-Review.

**Визуальный gate (новое, чтобы спринт 2 ≠ спринт 1):** TDD не ловит «красиво», поэтому в review добавляется шаг:
1. Каждую секцию — скриншот рядом с `VISUAL-REFERENCE.html` / дизайн-системой. Расходится по отделке → не принято.
2. Чек-лист «5 приёмов» (§5.2) на каждую секцию.
3. Запрет плоских заглушек: карточка на голом `--color-bg2` без `--glass-bg`/highlight/тени = баг.

---

## 15. Тестовые критерии (опора TDD)

**telegram:** ссылка начинается с `https://t.me/`, текст encoded; пустое сообщение не падает; username из env.
**quiz-logic:** 3×health→health; смешанные→max; равенство 1/1/1→health; 0/2/2→body; после 3-го `finished`; RESET→initial.
**analytics:** не падает без `window.ym`; тип `Goal` отвергает левую строку.
**quiz UI:** 1-й вопрос+прогресс 0; клик→2-й, прогресс растёт; 3 клика→результат; «заново»→1-й.
**slot:** выбор чипа → меняется `selected` и `href` (содержит выбранное время, encoded); клик «Занять» шлёт `slot_take`; нет состояния «забронировано» в DOM.
**accordion:** все свёрнуты; клик раскрывает один, переключение корректно.
**e2e:** пройти квиз → TG-href корректен; выбрать слот → TG-href содержит время; мобильный sticky-CTA ведёт к #test; reduced-motion не блокирует контент.

---

## 16. Чек-лист «к продакшену»

**Плейсхолдеры → реальные данные**
- [ ] `NEXT_PUBLIC_TG_USERNAME`, `NEXT_PUBLIC_YM_ID` (+ цели в кабинете Метрики).
- [ ] Минуты/названия ЖК — сверить по Яндекс.Картам.
- [ ] **Слоты (`slots-data.ts`)** — реальное время, которое тренер держит открытым (НЕ выдуманное «свободно»).
- [ ] Цифры доверия (10+ лет, 2–3 года) — подтвердить.
- [ ] `gerhaus.woff2` + проверить лицензию на web-embedding.
- [ ] `og-image.png` 1200×630; `privacy` заполнить.

**Качество**
- [ ] `tsc --noEmit` чисто, ESLint чисто, все тесты §15 зелёные.
- [ ] **Визуальный gate §14 пройден по каждой секции.**
- [ ] Lighthouse mobile: Perf ≥90, A11y ≥90, SEO ≥95.
- [ ] Проверено на реальных iOS Safari / Android Chrome (особенно открытие Telegram из слота и квиза).

**Деплой**
- [ ] Env в Vercel; прод-домен + HTTPS; `.env.local` не в git.

---

## 17. После MVP (по влиянию)

1. **Соцдоказательство** — отзывы/фото «до-после» (сейчас почти нет). Блок между LocationMap и Transformation.
2. **Замер отвала** по мостикам и `slot_select→slot_take` — где теряем.
3. **Фаза 2: бэк** — реальная бронь слотов + серверный приём заявок (закрывает дыру аналитики, фундамент кабинета). Слот и форма уже к этому готовы.
4. А/Б заголовка hero.
5. БД + кабинет + оплата — по росту.

---

*Конец v3.0. Эталоны вида — `VISUAL-REFERENCE.html` и `blocks-location-slot.html`; тексты — `CONTENT-trener-u-doma.md`. Принцип: честный интерфейс + «неотличимо по породе от дизайн-системы».*
