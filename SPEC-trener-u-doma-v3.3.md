# Техническая спецификация v3.3 · Лендинг «Тренер у дома»
### Next.js 16 · TypeScript · Tailwind · разработка через Superpowers

**Проект:** Каменский Никита — персональные силовые тренировки в шаговой доступности (СПб, Приморский пр., 56)
**Статус:** готова к спринту 3
**Что нового в v3.3 (после серии UX-правок):**
1. **Порядок воронки:** «О тренере» НАВЕРХ (после hero); финал → короткий CTA «первый шаг». Зона рассказа (без рамок) → зона виджетов (в рамках). См. §6.
2. **Правило рамок — ПУТЬ A (закон):** рамку получают только виджеты/объекты; повествовательные секции — без рамки (§5.8).
3. **Hero — фирменный фон:** сетка-клетка full-bleed, гаснет к центру; интерактивный cyan-glow за курсором (десктоп) (§5.9).
4. **Карта:** full-width без рамки, залив снизу, 4 ЖК, пины разнесены; порядок Золотая Гавань→Три ветра→Life→Стокгольм (§8).
5. **Transformation:** путь из 4 этапов всеми акцентами (cyan→violet→pink→green), Lucide (§8.5).
6. **Слоты:** 6 дней (кроме субботы), БЕЗ тегов hint/walk, кнопка авто-ширины; сетка 6→3→2 (§9).
7. **Адаптив ≤420px** (покрывает 320/360/390/414); юр-документ в футере.

**Синхронизация:** контент — `CONTENT-trener-u-doma.md`, раздел C (дельта v3.3, приоритет). Эталон вида/поведения — `landing-final.html`.

**Открытые вопросы (НЕ блокируют):** логотип (монолайн, не финал); подход к карте (тайлы/SVG/Static Maps); названия ЖК и минуты ⚠️ примерные; фото тренера — для прода реальное.

**Живые референсы:** `landing-final.html` (эталон v3.3) · `BRAND-BOOK.html` · `VISUAL-REFERENCE.html`.
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
| Иконки | **Lucide** (`lucide-react`) | tree-shakeable, `currentColor` подхватывает cyan и размеры; свои SVG не плодим |
| Сборка | Turbopack | |
| Анимации | CSS (reveal/radar) + IntersectionObserver; Motion только если нужно | обязательны для прода; `prefers-reduced-motion` отключает |
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
│   │   └── AboutTrainer.tsx     # бывший FinalCta: фото + факты + контакт (§8.6)
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

**Зависимости (рантайм):** `next`, `react`, **`lucide-react`** (иконки). Всё. UI-кит не ставим. Dev: TS, Tailwind, Vitest/RTL, Playwright, ESLint/Prettier.

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
  /* layout + кнопки (v3.1) */
  --container:1080px;            /* ЕДИНАЯ ширина всех секций */
  --space-section:64px;          /* вертикальный ритм между секциями */
  --btn-lg-pad:16px 30px; --btn-lg-fs:17px;
  --btn-md-pad:13px 24px; --btn-md-fs:15px;
  --btn-sm-pad:10px 18px; --btn-sm-fs:13px;
  --ease-soft:cubic-bezier(.2,.7,.2,1);   /* кривая появления */
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

### 5.4. Кнопки — система размеров, чистый cyan (v3.1)
Одно главное действие = один цвет (cyan). Глаз учится: cyan = «жми сюда». Мутные многоцветные градиенты запрещены.
- **Размеры** (на токенах): `lg` 16/30·17px — главные CTA (hero, финал); `md` 13/24·15px — внутри блоков, слот, мостики; `sm` 10/18·13px — второстепенное.
- **Главная (primary):** `linear-gradient(100deg,var(--color-cyan),#22B4E6)`, текст `#06121b`, glow + светящееся кольцо `0 0 0 1px rgba(44,230,255,.5)`.
- **Вторичная (secondary):** жидкое стекло — `rgba(255,255,255,.05)` + `backdrop-filter:blur(10px)` + бордер `--line` + `--edge-highlight`. На фоне-сетке (hero) даёт frosted-эффект: сетка размывается и тонируется под кнопкой, не просвечивает грязно.
- **Кнопка «Занять слот» — `md`, чистый cyan** (как primary), ширина ограничена (≤340px), НЕ во всю карточку. Старый градиент violet→blue→cyan отменён (мутный).
- Hover: `translateY(-2px)` + усиление glow.
- Правило: никогда две главные рядом; размеры только из токенов, не «на глаз».
```css
.btn{ display:inline-flex; align-items:center; justify-content:center; gap:9px;
  font-family:var(--font-body); font-weight:700; border:none; cursor:pointer; border-radius:40px;
  transition:transform .15s ease, box-shadow .25s ease, border-color .2s ease; }
.btn-lg{ padding:var(--btn-lg-pad); font-size:var(--btn-lg-fs); }
.btn-md{ padding:var(--btn-md-pad); font-size:var(--btn-md-fs); }
.btn-sm{ padding:var(--btn-sm-pad); font-size:var(--btn-sm-fs); }
.btn-primary{ background:linear-gradient(100deg,var(--color-cyan),#22B4E6); color:#06121b;
  box-shadow:0 0 0 1px rgba(44,230,255,.5),0 8px 28px rgba(44,230,255,.32); }
.btn-secondary{ background:rgba(255,255,255,.02); border:1px solid var(--line); color:var(--color-tx); box-shadow:var(--edge-highlight); }
```

### 5.5. Иконки — Lucide (v3.1)
- Библиотека **`lucide-react`**. Свои SVG-иконки не плодим — выкидываем.
- Tree-shakeable: импортировать поштучно `import { HeartPulse, Zap } from 'lucide-react'` (не весь набор) — в бандл попадают только использованные.
- Цвет через `currentColor` → подхватывает наш cyan; размер через `size`/CSS. Стиль `stroke-width` ~1.6–2 для соответствия линейному виду системы.
- Иконки болей (Problem) и UI-иконки — из Lucide, в скруглённом «чипе» с тонким cyan-бордером и внутренним свечением (см. `redesign-sprint3.html`).
- Эмодзи как иконки **запрещены** (кринж).

### 5.6. Движение — обязательно для прода (v3.1)
Анимации появления — часть DoD, без них в прод не идём. Реализация плавная, скролл нативный.
- **Появление:** `IntersectionObserver` (threshold ~0.1–0.15) добавляет класс → CSS `transition` (fade + `translateY(24px→0)`).
- **Кривая:** `--ease-soft` = `cubic-bezier(.2,.7,.2,1)`, длительность 0.6–0.7s.
- **Stagger:** в группах карточек — задержка ~90ms между элементами.
- **Запрет:** никакого scroll-jacking, нативный скролл не перехватываем. Только `transform`/`opacity` (GPU).
- **`prefers-reduced-motion: reduce`** — отключает все анимации и `scroll-behavior` (контент сразу видим).
```css
.reveal{ opacity:0; transform:translateY(24px); transition:opacity .7s var(--ease-soft), transform .7s var(--ease-soft); }
.reveal.in{ opacity:1; transform:none; }
@media(prefers-reduced-motion:reduce){ .reveal{ opacity:1; transform:none; transition:none; } html{ scroll-behavior:auto; } }
```

### 5.7. Ширина и ритм (v3.1, обновлено v3.3)
- **Единый контейнер `--container:1080px`** для ВСЕХ секций. Узкие элементы центрируются внутри — края не «гуляют».
- Между секциями — `--space-section:88px` (v3.3, было 64 — добавлен воздух); мостик прижат к своему блоку.
- **Мостики — плавный скролл до якоря**: `html{ scroll-behavior:smooth }` + якорные `<a href="#...">`. Отключается при reduced-motion.

### 5.8. Правило рамок — ПУТЬ A (закон, v3.3)
Рамку (стекло+бордер `.card`) получают **только интерактивные виджеты и обособленные объекты:** квиз, слот, аккордеон, карточки болей, узлы пути. **Повествовательные секции** (hero, обо мне, transformation-обёртка, финал, карта-секция) — **БЕЗ рамки**, на градиентном фоне, разделены воздухом.
- Зачем: рамка становится языком («тут объект/действие»), а не случайностью. Фон-градиент проявляется между секциями — премиум-воздух работает.
- Проверка нового блока: «это виджет или рассказ?». Виджет → рамка. Рассказ → без.
- Карта-объект внутри секции имеет свою рамку (`.map-box`), но секция-обёртка — без `.card`.

### 5.9. Hero — фирменный фон (v3.3)
- Сетка-клетка (48px шаг, rgba синий) во всю ширину экрана (full-bleed), гаснет к центру радиальной маской — заголовок Gerhaus читаем.
- Контент (текст, кнопки) — в `--container:1080px`, не расплывается; фон-сетка шире контента.
- **Интерактив:** glow-слой (та же сетка, ярко-cyan) виден только в пятне ~180px вокруг курсора через radial-маску на CSS-переменных `--mx/--my`; пятно следует за `pointermove`. Появляется на `.hero:hover`.
- **Только десктоп:** `@media (hover:none){ display:none }` (тач — чистый фон), плюс отключение при `prefers-reduced-motion`. Обновление — только запись CSS-переменных (GPU, без reflow).

---

## 6. Структура страницы и продающие формулы

Каркас **AIDA**; боль по **PMHS** (один раз); трансформация по **BAB**; оффер **Свойства→Преимущества→Выгоды**. Между секциями — интерактивные «мостики» (вопрос + кнопка-якорь).

```
Hero            → главная (#test) + вторичная «Записаться» (#booking); фирменный фон-сетка (§5.9)
AboutTrainer (#about) → фото + факты + 2 CTA; kicker «знакомство»; БЕЗ рамки. (наверху — знакомство до болей)
Problem (#pain) → 3 боли (карточки в рамках, Lucide); bridge → #map
LocationMap (#map) → карта full-width БЕЗ рамки, залив снизу, 4 ЖК (§8); bridge → #bab
Transformation (#bab) → путь из 4 этапов, все акценты (§8.5); bridge → #test
   ─── выше: зона рассказа (секции без рамок) ───
Quiz (#test)    → 3 вопроса → профиль → оффер → CTA в Telegram; bridge → #objections
Objections (#objections) → аккордеон (снимаем страх ДО записи); bridge → #booking
BookingSlot (#booking) → слот, 6 дней (§9)
FinalCta (#final) → короткий CTA «первый шаг»: 2 кнопки, БЕЗ рамки
   ─── ниже Quiz: зона виджетов (в рамках) ───
Footer (+ юр-ссылка /privacy) + sticky CTA (mobile → #test)
```
> v3.3: «О тренере» наверху (знакомство усиливает старт), финал — отдельный короткий CTA (закрывает воронку). Между About и Problem — мостик; между Hero и About — без мостика (плавный переход). Зона рассказа без рамок, зона виджетов в рамках (§5.8).

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

## 8. Карта локации (`LocationMap.tsx`)

Premium-замена плоской Map. Эталон верстки — `landing-final.html`, блок #map.

**Состав (3 колонки на десктопе, стек на мобиле):**
- Левая: kicker «ГЛАВНОЕ ПРЕИМУЩЕСТВО» + H2 «Близость — не удобство, а условие» + текст.
- Центр: квадратная стеклянная карта —
  - SVG-подложка: сетка улиц + диагональный проспект + **силуэт залива слева с линией берега** (cyan-контур, заливка rgba синего);
  - радар: 3 кольца вокруг зала, мягкая пульсация (отключается при `prefers-reduced-motion`);
  - центр: «дом-зал» — залитый центральный круг радара (градиент violet→cyan, glow), «НК» внутри, БЕЗ квадратной рамки; внешние круги пульсируют вокруг; подпись «ЗАЛ · Приморский 56» под кругом;
  - **4 пина ЖК** по реальной географии (берег залива = запад): Life/Стокгольм/Три ветра ближе к берегу, Золотая Гавань севернее. Цвета cyan/violet/green/orange.
- Правая: список 4 ЖК с цветными засечками-glow, временем (моно), названием.

**Данные:** `CONTENT.map.points` (4 элемента: name + time + tick-цвет, см. контент C2). ⚠️ названия и минуты примерные — сверить по Яндекс.Картам.
**Логики нет** — чистая верстка, может быть Server Component.

### 8.5. Transformation (`Transformation.tsx`) — путь из 4 этапов
Замена колонкам «было/стало». Горизонтальная линия-прогресс + 4 узла с **нарастающим свечением** (от приглушённого к зелёному). Иконки — **Lucide**.
- Узлы (`CONTENT.transformation.steps`, см. C3): `clock` (сейчас, muted) → `circle-plus` (1–2 нед, cyan-dim) → `zap` (3–6 нед, cyan) → `circle-check-big` (2–3 мес, green+glow).
- Линия-прогресс под узлами: градиент tx3→cyan; на мобиле (<860px) скрывается, узлы в столбик.
- Тон узла (`tone`) управляет цветом иконки/бордера/свечения: muted → cyan-dim → cyan → green.
- Эталон — `landing-final.html`, блок #bab.

### 8.6. О тренере (`AboutTrainer.tsx`) — бывший финал
Довод доверия + контакт. 2 колонки (фото | текст), на мобиле стек.
- Фото тренера (`CONTENT.about.photo`) в стеклянной рамке `--radius-xl`, `object-fit:cover` с `object-position:50% 6%` (голова целиком с зазором сверху, низ уходит под обрез), градиент-затемнение снизу, cyan-бейдж «зал у дома · спб». ⚠️ для прода — реальное фото (на демо сгенерировано).
- Справа: kicker «ПЕРВЫЙ ШАГ», H2 «Никита Каменский», intro, 3 факта (крупная cyan-цифра + текст, hairline между), оффер про бесплатную встречу.
- 2 CTA: главная «Пройти разбор» (#test) + вторичная «Сразу написать» (Telegram direct). Микрокопи «отвечаю лично».
- Данные — `CONTENT.about` (см. C6). Эталон — `landing-final.html`, блок #about.

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
- Кнопка «Занять слот →» — **`md`, чистый cyan** (как главная, см. §5.4), ширина ≤340px → deep link.
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
- [ ] **Единая ширина 1080px** — все секции в одном контейнере, края не «гуляют».
- [ ] **Иконки только Lucide**, импорт поштучно; своих SVG-иконок и эмодзи нет.
- [ ] **Кнопки** — только размеры lg/md/sm из токенов; главная всегда cyan; «Занять слот» ≤340px, не во всю ширину.
- [ ] **Анимации появления** работают (IntersectionObserver + ease-soft) и отключаются при `prefers-reduced-motion`; мостики — плавный скролл до якоря.
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
