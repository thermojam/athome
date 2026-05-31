# Дизайн спринта 2 · «Тренер у дома»

**Дата:** 2026-05-31
**Спека:** `SPEC-trener-u-doma-v3.md` (v3.0)
**Эталон:** `VISUAL-REFERENCE.html`
**База кода:** ветка `feat-spec-3` после merge `feat-spec-2` (MVP-каркас спринта 1)

> Это design-документ под спринт 2. Он фиксирует **стратегию исполнения** и **архитектурные решения** для тех мест, где спека v3.0 оставила выбор на разработчика. Спека остаётся источником правды по содержанию (тексты, токены, доменная модель). Этот файл — про *как именно мы доставим её до прода*.

---

## 0. Контекст и постановка

**Что есть на старте спринта 2:**
- MVP-каркас из спринта 1 (Hero, Problem, Map, Transformation, Quiz, Objections, FinalCta, sticky-CTA, YandexMetrika, privacy, opengraph, e2e-тесты Playwright).
- Вся доменная логика: `lib/{telegram,analytics,quiz-logic,quiz-data,types}`, тесты Vitest.
- Шрифт Gerhaus (.ttf) уже лежит в `public/fonts/gerhaus/`.

**Что не так после спринта 1 (ретро §5 спеки):**
> *«Плоско вышло потому, что были даны значения токенов, но не рецепт премиальности.»*

Существующие секции стилизованы Tailwind-утилитами поверх голых цветовых токенов. Нет градиентного фона body, нет производных токенов премиальности (`--glass-bg`, `--lift`, `--edge-highlight`, `--glow-*`), нет компонент-класса `.card` через `@layer components`, радиусы маленькие, hairline-разделителей нет.

**Что нужно сделать в спринте 2:**
1. **Visual ре-стайл** всех существующих секций под §5 спеки (5 приёмов премиальности → DoD).
2. **Новые секции:** LocationMap (premium-карта района) и BookingSlot (честный MVP записи через Telegram).
3. **Новые цели аналитики** (`slot_select`, `slot_take`).
4. **Тесты** на BookingSlot, регрессионные — на сохранение существующего поведения.
5. **Visual gate** в DoD: ручная сверка с `VISUAL-REFERENCE.html` по чек-листу.

---

## 1. Стратегия исполнения

### 1.1. Слияние веток

Выполнено в начале спринта (коммит `b3a7f23`):
1. На `feat-spec-3` закоммичены `SPEC-trener-u-doma-v3.md` + `VISUAL-REFERENCE.html`.
2. `git merge feat-spec-2 --no-ff` → подтянул весь MVP спринта 1.
3. `test-results/` автоматически попал под `.gitignore` (он есть в `.gitignore` из feat-spec-2).
4. Дальнейшая работа — на `feat-spec-3`.

### 1.2. Порядок реализации (фундамент → секции)

```
1. Фундамент CSS         → globals.css: токены + @layer components (.card, .btn-*, .pill)
2. UI-кит                → Pill, GlassCard, Button (главная/вторичная/btn-slot) на premium классах
3. Типы и данные         → lib/types.ts (+Slot, MapPoint, новые Goals), lib/slots-data.ts,
                           CONTENT.map + CONTENT.booking в lib/quiz-data.ts
4. Секции (параллельно)  → ре-стайл Hero, Problem, Transformation, Quiz, Objections, FinalCta;
                           новый LocationMap (заменяет Map); новый BookingSlot
5. Сборка                → app/page.tsx: новый порядок (Hero → Problem → LocationMap →
                           Transformation → Quiz → BookingSlot → Objections → FinalCta),
                           bridge Quiz→Booking
6. Тесты                 → BookingSlot.test.tsx, slots-data.test.ts (опц.); регрессия по всем;
                           e2e: booking-slot.spec.ts; расширение quiz-flow и reduced-motion
7. Visual gate           → ручная сверка каждой секции с VISUAL-REFERENCE.html
```

**Параллелизация:** шаги 1-3 строго последовательны (фундамент). Шаги 4 → 6 распараллеливаются через `superpowers:subagent-driven-development` — каждая секция/тест-сьют независимы после готовности фундамента.

### 1.3. Что НЕ в скоупе спринта 2

- Реальный бэк под бронь слотов (фаза 2).
- Серверный приём заявок через Route Handler + Bot API (фаза 2, заглушка в `app/api/.gitkeep` уже есть).
- Картинки/фото отзывов «до-после» (после MVP).
- Изменения `lib/telegram.ts`, `lib/quiz-logic.ts` (стабильные, рабочие).
- Изменения `lib/analytics.ts` по реализации (только тип `Goal` расширяется в `lib/types.ts`).

---

## 2. CSS-архитектура премиальности

Это критическая часть — спринт 1 «вышел плоско» именно здесь. Подход — **жёстко рецепт §5 спеки**, не утилитарный Tailwind.

### 2.1. Структура `app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* акценты — стабильные имена */
  --color-cyan: #2CE6FF; --color-violet: #8B5CFF; --color-pink: #FF4FD8;
  --color-green: #36FF9D; --color-orange: #FF9F43; --color-blue: #4D7DFF;
  --color-bg-primary: #0E1117; --color-bg2: #151923; --color-bg3: #1B2030;
  --color-tx: #E8ECF4; --color-tx2: #9AA3B5; --color-tx3: #5E6678;
  --radius-md: 22px; --radius-lg: 30px; --radius-xl: 42px; --blur-md: 18px;
  --font-display: 'Gerhaus', Georgia, serif;
  --font-body: 'Nunito', 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

:root {
  /* ПРОИЗВОДНЫЕ премиальности — без них «дорого» не собрать */
  --glass-bg: linear-gradient(180deg, rgba(255,255,255,0.05) 0%,
                                       rgba(255,255,255,0.02) 40%,
                                       rgba(255,255,255,0.012) 100%);
  --glass-bg-solid: #141925;
  --line: rgba(255,255,255,0.09);
  --line-soft: rgba(255,255,255,0.055);
  --edge-highlight: inset 0 1px 0 rgba(255,255,255,0.10);
  --lift: 0 1px 2px rgba(0,0,0,0.4),
          0 8px 24px rgba(0,0,0,0.35),
          0 24px 60px rgba(0,0,0,0.30);
  --glow-cyan:   0 0 14px 1px rgba(44,230,255,0.6);
  --glow-violet: 0 0 14px 1px rgba(139,92,255,0.6);
  --glow-pink:   0 0 14px 1px rgba(255,79,216,0.6);
  --glow-green:  0 0 14px 1px rgba(54,255,157,0.6);
  --glow-orange: 0 0 14px 1px rgba(255,159,67,0.6);
  --bg-gradient:
    radial-gradient(120% 80% at 50% -10%, rgba(139,92,255,0.16) 0%, rgba(139,92,255,0) 45%),
    radial-gradient(90% 60% at 80% 0%,   rgba(44,230,255,0.09) 0%, rgba(44,230,255,0) 50%),
    linear-gradient(180deg, #121624 0%, #0E1117 40%, #0A0D13 100%);
}

/* ПРИЁМ 1 — градиентный фон body, fixed чтобы не плыл при скролле */
body {
  background-color: var(--color-bg-primary);
  background-image: var(--bg-gradient);
  background-attachment: fixed;
  color: var(--color-tx);
  font-family: var(--font-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

@layer components {
  /* ПРИЁМ 2 — стеклянная карточка */
  .card {
    position: relative;
    background-color: var(--glass-bg-solid);
    background-image: var(--glass-bg);
    border: 1px solid var(--line);
    border-radius: var(--radius-xl);                  /* 42px */
    box-shadow: var(--edge-highlight), var(--lift);
    backdrop-filter: blur(var(--blur-md));
    padding: 34px 36px;
  }
  .card-lg { border-radius: var(--radius-xl); padding: 40px 44px; }
  .card-md { border-radius: var(--radius-lg); padding: 26px 28px; }

  /* ПРИЁМ 3 — hairline-разделитель */
  .hairline { border-bottom: 1px solid var(--line-soft); }
  .hairline:last-child { border-bottom: none; }

  /* ПРИЁМ 5 — кнопки */
  .btn {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--font-body); font-weight: 700; font-size: 16px;
    padding: 15px 28px; border-radius: 40px;
    cursor: pointer; text-decoration: none; border: none;
    transition: transform .15s ease, box-shadow .25s ease;
  }
  .btn-primary {
    background: linear-gradient(100deg, var(--color-cyan), #20B8E8);
    color: #06121b;
    box-shadow: 0 0 0 1px rgba(44,230,255,0.5),
                0 8px 30px rgba(44,230,255,0.35);
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 0 1px rgba(44,230,255,0.7),
                0 12px 44px rgba(44,230,255,0.5);
  }
  .btn-slot {
    background: linear-gradient(100deg, var(--color-violet), var(--color-blue) 50%, var(--color-cyan));
    color: #06121b;
    box-shadow: 0 0 0 1px rgba(139,92,255,0.4),
                0 12px 36px rgba(139,92,255,0.45);
  }
  .btn-secondary {
    background-color: rgba(255,255,255,0.02);
    background-image: var(--glass-bg);
    border: 1px solid var(--line);
    color: var(--color-tx);
    box-shadow: var(--edge-highlight);
  }
  .btn-secondary:hover { border-color: rgba(255,255,255,0.22); }

  /* пилюли */
  .pill {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: var(--font-mono); font-size: 12.5px;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--color-tx2);
    padding: 9px 16px; border-radius: 30px;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--line);
    box-shadow: var(--edge-highlight);
  }

  /* типографические голоса */
  .kicker {
    font-family: var(--font-mono); font-size: 13px; font-weight: 500;
    letter-spacing: 2.6px; text-transform: uppercase;
    color: var(--color-cyan);
    display: inline-flex; align-items: center; gap: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2.2. Правила применения в JSX

- Каждая **секция-карточка** = `<div className="card">…</div>`. Никаких россыпей `bg-bg-primary border-[--line] rounded-2xl` — это и есть антипаттерн спринта 1.
- Внутри карточки **layout** (grid, flex, gap, padding между подблоками) — через Tailwind utilities. Это норм.
- Акценты с glow (точки, бейджи) — inline style: `style={{ boxShadow: 'var(--glow-cyan)' }}`.
- **Воздух между секциями** — `<div className="h-16 md:h-24" />` либо padding на самой `<section>` (64-96px по §5.2).

### 2.3. Шрифты

В `app/layout.tsx`:
- `next/font/local` для Gerhaus (файл `public/fonts/gerhaus/Gerhaus.ttf` уже есть).
- `next/font/google` для Nunito (subset `cyrillic`, weights 400/600/700/800) и JetBrains Mono (400/500).
- Все три экспортируются как CSS-переменные `--font-display`, `--font-body`, `--font-mono` — перекрывают значения из `@theme`.

### 2.4. Что меняется

- `app/globals.css` — полная переписка (структура §2.1). Дополнительно сюда же кладём `@keyframes radar-pulse` и класс `.radar-ring` для LocationMap (вне `@layer components`, т.к. keyframes на уровне layer не работают надёжно).
- `app/layout.tsx` — добавить Gerhaus, проверить отсутствие inline `bg-` на body.
- Все секции — заменить «плоские» div на `.card`.
- Hero/footer — без карточки, но с градиентом body как атмосферой.

**Breaking change токенов:** в спринте 1 в UI-компонентах используется устаревший CSS-токен `--glass` (через утилиту `bg-[--glass]` в `GlassCard`, `Pill`, `Bridge`, `TrackedLink` стилях). В спринте 2 переходим на новый набор: `--glass-bg-solid` + `--glass-bg` (layered). Старый `--glass` удаляется. Все упоминания `bg-[--glass]` в JSX должны быть заменены на `.card`, `.pill`, `.btn-secondary` либо inline style с новыми переменными — ничего не остаётся на старом токене. Эту замену делает шаг «UI-кит» (см. §1.2).

---

## 3. Типы, новые секции, данные

### 3.1. Расширение `lib/types.ts`

Существующие типы — без изменений. Добавить:

```ts
// Слоты записи
export interface Slot {
  id: string;
  day: string;          // "Вторник"
  time: string;         // "19:00"
  label: string;        // "Персональная · 60 мин · зал у дома"
  status: 'free';       // на MVP только 'free' — busy не возим в DOM, чтобы не врать
  profileHint?: ProfileKey;
  walkMinutes?: number;
}

// Карта (точки ЖК)
export interface MapPoint {
  name: string;
  walkMinutes: number;
  accentVar: '--color-cyan' | '--color-violet' | '--color-green';
  x: number;   // 0..100, в % от viewbox SVG
  y: number;
}

// Фаза 2 (только тип, без реализации)
export interface LeadPayload {
  name: string;
  contact: string;
  profile?: ProfileKey;
  slotId?: string;
}

// Цели — добавлены slot_select / slot_take
export type Goal =
  | 'quiz_start' | 'quiz_complete'
  | `lead_click_${ProfileKey}` | 'lead_click_direct'
  | 'slot_select' | 'slot_take'
  | 'objection_open';
```

`lib/analytics.ts` правки не требует — `reachGoal(goal: Goal)` автоматически примет новые значения.

### 3.2. `LocationMap.tsx` — Server Component

**Заменяет** `components/sections/Map.tsx`. Якорь `#map`.

**Структура (3 колонки на десктопе → стек на мобиле):**
```
[ ЛЕВАЯ ]                 [ ЦЕНТР — квадратная карта ]            [ ПРАВАЯ ]
.kicker «ЗАЛ У ДОМА»      .card 1:1                                ul: точки ЖК
H2 «Тренировки рядом      ├─ SVG: сетка улиц + диагональ           каждая:
   с вами»                ├─ радар: 3 кольца (CSS-pulse,           ├─ цветной dot
body                      │     reduced-motion → статика)          │     с glow
                          ├─ центр: бейдж-зал                      ├─ название
                          │     (градиент violet→cyan, glow,       └─ N мин (моно)
                          │      инициалы / иконка, подпись
                          │      "ЗАЛ · ПРИМОРСКИЙ ПР., 56")
                          └─ N пинов ЖК (SVG-капли) на разной
                             высоте, цвет из MapPoint.accentVar
```

**CSS-анимация радара:**
```css
@keyframes radar-pulse { 0% { transform: scale(0.6); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }
.radar-ring { animation: radar-pulse 3.2s ease-out infinite; transform-origin: center; }
.radar-ring--d1 { animation-delay: 0s; }
.radar-ring--d2 { animation-delay: 1s; }
.radar-ring--d3 { animation-delay: 2s; }
@media (prefers-reduced-motion: reduce) { .radar-ring { animation: none; opacity: 0.4; } }
```

Логики нет — чистый Server Component. Данные из `CONTENT.map` (см. §3.4).

### 3.3. `BookingSlot.tsx` — Client Component, честный MVP

Якорь `#booking`. Размещение: между Quiz (`#test`) и Objections (`#objections`).

**Структура:**
```
.card (один большой блок)
├─ .kicker «ВЫБЕРИ УДОБНОЕ ВРЕМЯ»
├─ H2 «Запишемся прямо сейчас»
├─ body-text + .pill «зал у дома · Приморский, 56»
├─ Сетка чипов (grid auto-fit minmax(160px, 1fr) gap-3):
│    каждый чип = <button aria-pressed={selected}>:
│      [день+время] моно
│      [тип/мин/«N мин пешком»] — мелкий
│      .dot.glow.{цвет профиля} если slot.profileHint
│      выбранный → box-shadow: 0 0 0 2px var(--color-cyan), var(--glow-cyan)
├─ Большая кнопка <a className="btn btn-slot">:
│      «Занять слот {день, время} →»
│      disabled (aria-disabled + pointer-events:none + opacity) пока ничего не выбрано
└─ Подпись-честность (моно, tx3):
     «Откроется Telegram с выбранным временем — подтвердим лично»
```

**Логика (`'use client'`):**
```ts
const [selectedId, setSelectedId] = useState<string | null>(null);
const selected = SLOTS.find(s => s.id === selectedId);

const handlePick = (id: string) => {
  setSelectedId(id);
  reachGoal('slot_select');
};

const tgHref = selected
  ? buildTelegramLink(
      `Привет! Хочу записаться на персональную тренировку. ` +
      `Удобное время: ${selected.day}, ${selected.time}. ` +
      `Зал у дома (Приморский пр., 56).`
    )
  : undefined;

// Кнопка «Занять» — <a href target="_blank">, не <button>:
// — пока ничего не выбрано: рендерим <button disabled> с теми же классами .btn.btn-slot,
//   чтобы не было «битого» якоря.
// — когда есть selected: рендерим <a href={tgHref} target="_blank" rel="noopener noreferrer"
//   onClick={() => reachGoal('slot_take')}>.
// Это даёт корректную семантику (внешняя ссылка) + отслеживаемое событие до навигации.
```

**Запреты (из §9.1 спеки, критично):**
- В DOM **никогда** не появляется текст «забронировано», «занято», «зарезервировано», «ваш слот», «место за вами». Тест должен это проверять явно.
- Бейдж «свободно» (зелёный glow) — только для слотов, которые тренер реально держит (на MVP — все слоты в `slots-data.ts` имеют `status:'free'`, это и есть слова тренера).
- После клика «Занять» состояние чипа не меняется на «забронированный».

### 3.4. Данные — плейсхолдеры под согласование

**`lib/slots-data.ts` (новый, с пометкой TODO):**
```ts
import type {Slot} from './types';

// TODO: согласовать с тренером перед продом — НЕ выдумывать «свободно»
export const SLOTS: Slot[] = [
  { id: 'tue-19', day: 'Вторник', time: '19:00', label: 'Персональная · 60 мин · зал у дома', status: 'free', walkMinutes: 4 },
  { id: 'wed-08', day: 'Среда',   time: '08:00', label: 'Персональная · 60 мин · зал у дома', status: 'free', walkMinutes: 4, profileHint: 'energy' },
  { id: 'thu-19', day: 'Четверг', time: '19:00', label: 'Персональная · 60 мин · зал у дома', status: 'free', walkMinutes: 4, profileHint: 'health' },
  { id: 'sat-10', day: 'Суббота', time: '10:00', label: 'Парная · 60 мин · зал у дома',        status: 'free', walkMinutes: 4, profileHint: 'body'   },
  { id: 'sun-11', day: 'Воскресенье', time: '11:00', label: 'Персональная · 60 мин · зал у дома', status: 'free', walkMinutes: 4 },
];
```

**Расширение `CONTENT` в `lib/quiz-data.ts`:**
```ts
map: {
  kicker: 'ЗАЛ У ДОМА — УДОБНО И РЕАЛЬНО',
  h2: 'Тренировки рядом с вами',
  body: 'Тренажёрный зал на Приморском проспекте, 56. ' +
        'От большинства ЖК района — 4-10 минут пешком. ' +
        'Это и есть главная причина не сорваться.',
  gymLabel: 'ЗАЛ · ПРИМОРСКИЙ ПР., 56',
  // TODO: сверить минуты и названия ЖК с Яндекс.Картами перед продом
  points: [
    { name: 'ЖК Морской каскад',     walkMinutes: 4,  accentVar: '--color-cyan',   x: 30, y: 28 },
    { name: 'ЖК Светлый мир Внутри', walkMinutes: 6,  accentVar: '--color-violet', x: 72, y: 36 },
    { name: 'ЖК Промикс',            walkMinutes: 8,  accentVar: '--color-green',  x: 22, y: 70 },
    { name: 'ЖК Сампсониевский',     walkMinutes: 10, accentVar: '--color-cyan',   x: 78, y: 76 },
  ],
},
booking: {
  kicker: 'ВЫБЕРИ УДОБНОЕ ВРЕМЯ',
  h2: 'Запишемся прямо сейчас',
  body: 'Свободные окна на ближайшие дни. Жми на удобное — продолжим в Telegram.',
  pillGym: 'зал у дома · Приморский, 56',
  ctaLabel: 'Занять слот',
  honestyNote: 'Откроется Telegram с выбранным временем — подтвердим лично.',
},
```

**Bridges — добавить мостик Quiz → BookingSlot:**
```ts
toBooking: {
  question: 'Тогда давай прямо сейчас выберем время.',
  cta: 'выбрать слот',
  href: '#booking',
},
```
Bridge `toObjections` сдвигается — теперь идёт после booking, не сразу после quiz.

### 3.5. Что НЕ правим

- `lib/quiz-logic.ts` — reducer и tie-break без изменений.
- `lib/telegram.ts` — `buildTelegramLink` универсален.
- `lib/analytics.ts` — реализация без изменений (только тип `Goal` расширяется в `types.ts`).

---

## 4. Тесты, visual gate, DoD

### 4.1. Новые тесты (TDD: red → green → refactor)

**`tests/components/BookingSlot.test.tsx`** (Vitest + RTL):
```ts
describe('BookingSlot', () => {
  it('кнопка disabled пока ничего не выбрано', () => {…});
  it('выбор чипа → у него aria-pressed=true', () => {…});
  it('выбор чипа → href ссылки содержит выбранный день и время (encoded)', () => {…});
  it('выбор чипа → reachGoal(\'slot_select\') вызывается', () => {…});
  it('клик «Занять» → reachGoal(\'slot_take\') вызывается', () => {…});
  it('честность: после клика «Занять» в DOM нет слов забронировано/занято/зарезервировано', () => {…});
  it('подпись честности про Telegram всегда видна в DOM', () => {…});
});
```
Последние два — критичные смысловые тесты §9 спеки.

**`tests/lib/slots-data.test.ts`** (новый, опц.):
```ts
describe('SLOTS', () => {
  it('у всех слотов status === \'free\'', () => {…});  // защита от случайного 'busy'
  it('все id уникальны', () => {…});
  it('каждое поле day/time/label непусто', () => {…});
});
```

**Регрессия:** все существующие тесты из `tests/` после рестайла должны **остаться зелёными**. Это сетка безопасности при перестройке UI — если ре-стайл что-то ломает, значит тронули неверный класс/data-attribute, на который полагается тест.

**E2E (Playwright):**
- Расширить `quiz-flow.spec.ts`: после прохождения квиза проверить, что bridge ведёт к `#booking`.
- Новый `tests/e2e/booking-slot.spec.ts`: выбрать чип → `href` ссылки содержит время; клик ведёт на `https://t.me/...`.
- Расширить `reduced-motion.spec.ts`: радар на LocationMap не анимируется при reduced-motion.
- `mobile-sticky.spec.ts` — без изменений.

### 4.2. Visual Gate — обязательный шаг review

После каждой секции (или пачки):
1. `npm run dev`, открыть страницу в браузере.
2. Открыть `VISUAL-REFERENCE.html` рядом.
3. Сверить по чек-листу 5 приёмов:
   - [ ] Градиентный фон body виден (не плоский `#0E1117`)?
   - [ ] Карточка имеет видимый «подъём» (многослойная тень `--lift`)?
   - [ ] Карточка имеет верхнюю кромку-highlight?
   - [ ] Радиус карточки 30-42px (не 8-12px по умолчанию)?
   - [ ] Hairline-разделители 1px внутри (если применимо)?
   - [ ] Glow на акцентах **светится** (box-shadow с alpha), не плоский кружок?
   - [ ] Воздух между секциями 64-96px (не 16-32)?
   - [ ] Заголовок — Gerhaus / Georgia fallback, uppercase, letter-spacing отрицательный?
   - [ ] Kicker — JetBrains Mono, uppercase, трекинг ≥+2.4?
4. Хоть один «нет» — секция не принята, возвращаемся.

### 4.3. Definition of Done спринта 2

**Код:**
- [ ] `tsc --noEmit` чисто.
- [ ] `npm run lint` чисто.
- [ ] `npm run test` (Vitest) — все тесты зелёные, включая новые на BookingSlot.
- [ ] `npm run test:e2e` (Playwright) — все e2e сценарии проходят.
- [ ] `npm run build` — собирается без warnings.

**Визуал:**
- [ ] Visual gate (§4.2) пройден по каждой из 8 секций.
- [ ] Скриншоты прикреплены к итоговому отчёту/PR.

**Аналитика:**
- [ ] Новые цели `slot_select`, `slot_take` срабатывают (проверить через `window.ym` mock в тестах + DevTools network в браузере).

**Контент-плейсхолдеры (помечены TODO, не блокируют DoD спринта, но блокируют деплой):**
- [ ] `lib/slots-data.ts` — `// TODO: согласовать с тренером перед продом`.
- [ ] `CONTENT.map.points` — `// TODO: сверить с Яндекс.Картами`.

**Доступность:**
- [ ] `prefers-reduced-motion` глушит радар и reveal.
- [ ] Контраст `--tx2` (`#9AA3B5`) на `#141925` — проверить инструментом, должно быть AA.
- [ ] Все интерактивные элементы имеют `aria-label` или говорящий текст; чипы слотов — `aria-pressed`.
- [ ] Touch-цели ≥44×44px.

**Что НЕ входит в DoD спринта 2 (фаза 2):**
- Реальная бронь слотов через бэк.
- Серверный приём заявок.
- Замена плейсхолдеров на финальный контент тренера и Яндекс.Карт.

---

## 5. Сводка изменений в файлах

| Файл | Действие | Что меняется |
|---|---|---|
| `app/globals.css` | переписать | производные токены + `@layer components` (.card, .btn-*, .pill, .kicker, .hairline) + body-градиент + reduced-motion |
| `app/layout.tsx` | править | подключить Gerhaus через `next/font/local`, проверить отсутствие inline bg |
| `app/page.tsx` | править | новый порядок секций, замена `<Map>` → `<LocationMap>`, добавить `<BookingSlot>`, bridge Quiz→Booking, ре-стайл inline `<footer>` (сейчас плоский `border-t bg-bg2` → премиум: `.hairline` сверху, открытый блок на градиенте body, моно-копирайт) |
| `components/sections/Map.tsx` | удалить | заменён LocationMap |
| `components/sections/LocationMap.tsx` | создать | §3.2 |
| `components/sections/BookingSlot.tsx` | создать | §3.3 |
| `components/sections/Hero.tsx` | ре-стайл | `.card` где уместно, `.btn-primary`/`.btn-secondary`, премиум-pills |
| `components/sections/Problem.tsx` | ре-стайл | `.card`, hairline между болями |
| `components/sections/Transformation.tsx` | ре-стайл | `.card`, BAB-блоки с glow-акцентами |
| `components/sections/Objections.tsx` | ре-стайл | `.card`, hairline между вопросами |
| `components/sections/FinalCta.tsx` | ре-стайл | `.card`, `.btn-primary` |
| `components/quiz/*.tsx` | ре-стайл | `.card`, профили с glow по цвету |
| `components/ui/Pill.tsx` | ре-стайл | использует `.pill` класс |
| `components/ui/GlassCard.tsx` | ре-стайл | обёртка над `.card` |
| `components/ui/StickyCta.tsx` | ре-стайл | премиум кнопка |
| `components/ui/Bridge.tsx` | ре-стайл | премиум pill + arrow |
| `lib/types.ts` | расширить | `Slot`, `MapPoint`, `LeadPayload`, новые `Goal` |
| `lib/slots-data.ts` | создать | плейсхолдеры с TODO |
| `lib/quiz-data.ts` | расширить | `CONTENT.map`, `CONTENT.booking`, `BRIDGES.toBooking` |
| `tests/components/BookingSlot.test.tsx` | создать | §4.1 |
| `tests/lib/slots-data.test.ts` | создать (опц.) | §4.1 |
| `tests/e2e/booking-slot.spec.ts` | создать | §4.1 |
| `tests/e2e/quiz-flow.spec.ts` | расширить | проверка перехода → #booking |
| `tests/e2e/reduced-motion.spec.ts` | расширить | проверка статичности радара |

---

*Конец дизайн-документа спринта 2. Следующий шаг — `superpowers:writing-plans` для детального implementation plan.*
