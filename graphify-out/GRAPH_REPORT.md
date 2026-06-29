# Graph Report - .  (2026-06-29)

## Corpus Check
- 42 files · ~84,969 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 320 nodes · 480 edges · 44 communities (28 shown, 16 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Section Tests|UI Section Tests]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Analytics Consent Runtime|Analytics Consent Runtime]]
- [[_COMMUNITY_Quiz Analytics Logic|Quiz Analytics Logic]]
- [[_COMMUNITY_Consent SEO Plan|Consent SEO Plan]]
- [[_COMMUNITY_Product Plans Prototype|Product Plans Prototype]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Booking Telegram Flow|Booking Telegram Flow]]
- [[_COMMUNITY_Legal Policy Pages|Legal Policy Pages]]
- [[_COMMUNITY_Search Metadata Routes|Search Metadata Routes]]
- [[_COMMUNITY_SVG Brand Identity|SVG Brand Identity]]
- [[_COMMUNITY_Transparent Brand Identity|Transparent Brand Identity]]
- [[_COMMUNITY_Graphify Pipeline|Graphify Pipeline]]
- [[_COMMUNITY_Mobile CSS Tests|Mobile CSS Tests]]
- [[_COMMUNITY_Glass Card UI|Glass Card UI]]
- [[_COMMUNITY_Vercel Starter Assets|Vercel Starter Assets]]
- [[_COMMUNITY_Engineering Goal Discipline|Engineering Goal Discipline]]
- [[_COMMUNITY_Simplicity Surgical Changes|Simplicity Surgical Changes]]
- [[_COMMUNITY_ESLint Configuration|ESLint Configuration]]
- [[_COMMUNITY_Gerhaus Font License|Gerhaus Font License]]
- [[_COMMUNITY_Next.js Configuration|Next.js Configuration]]
- [[_COMMUNITY_PostCSS Configuration|PostCSS Configuration]]
- [[_COMMUNITY_Trainer Photography|Trainer Photography]]
- [[_COMMUNITY_TDD Testability|TDD Testability]]
- [[_COMMUNITY_Reveal Animation|Reveal Animation]]
- [[_COMMUNITY_Document Asset Icon|Document Asset Icon]]
- [[_COMMUNITY_Globe Asset Icon|Globe Asset Icon]]
- [[_COMMUNITY_Window Asset Icon|Window Asset Icon]]
- [[_COMMUNITY_Tailwind Design System|Tailwind Design System]]
- [[_COMMUNITY_Frame Law|Frame Law]]

## God Nodes (most connected - your core abstractions)
1. `CONTENT` - 20 edges
2. `compilerOptions` - 16 edges
3. `buildTelegramLink()` - 12 edges
4. `scripts` - 10 edges
5. `reachGoal()` - 9 edges
6. `writeConsent()` - 9 edges
7. `MVP Landing Specification` - 7 edges
8. `clearConsent()` - 7 edges
9. `Three-Profile Quiz` - 7 edges
10. `Specification v3.0` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Honest Booking MVP` --rationale_for--> `BookingSlot()`  [EXTRACTED]
  docs/superpowers/specs/2026-05-31-sprint-2-design.md → components/sections/BookingSlot.tsx
- `Analytics Flow Once Per Visit` --references--> `reachGoal()`  [EXTRACTED]
  docs/superpowers/specs/2026-05-29-athome-mvp-design.md → lib/analytics.ts
- `Metrics Preserved v3.3` --references--> `reachGoal()`  [EXTRACTED]
  docs/superpowers/specs/2026-06-01-v3.3-update-design.md → lib/analytics.ts
- `Telegram Safe Fallback` --rationale_for--> `buildTelegramLink()`  [EXTRACTED]
  docs/superpowers/specs/2026-05-29-athome-mvp-design.md → lib/telegram.ts
- `Vercel Logo` --conceptually_related_to--> `Vercel Deployment`  [INFERRED]
  public/vercel.svg → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Landing Conversion Funnel** — readme_conversion_flow, readme_quiz_profiling, readme_telegram_deep_link, landing_final_quiz_engine, landing_final_telegram_booking [INFERRED 0.85]
- **Analytics Consent Flow** — athome_codex_cli_cookies_robots_sitemap_plan_versioned_consent, athome_codex_cli_cookies_robots_sitemap_plan_consent_provider, athome_codex_cli_cookies_robots_sitemap_plan_conditional_metrika, athome_codex_cli_cookies_robots_sitemap_plan_goal_consent_guard, athome_codex_cli_cookies_robots_sitemap_plan_cookie_controls [EXTRACTED 1.00]
- **Static Search Metadata Delivery** — athome_codex_cli_cookies_robots_sitemap_plan_robots_route, athome_codex_cli_cookies_robots_sitemap_plan_sitemap_route, athome_codex_cli_cookies_robots_sitemap_plan_static_export_verification, readme_static_rendering_seo [INFERRED 0.85]

## Communities (44 total, 16 thin omitted)

### Community 0 - "UI Section Tests"
Cohesion: 0.11
Nodes (18): size, BRIDGES, CONTENT, BridgeContent, AboutTrainer(), FinalCta(), Hero(), HeroBackground() (+10 more)

### Community 1 - "Runtime Dependencies"
Cohesion: 0.05
Nodes (38): dependencies, lucide-react, next, react, react-dom, devDependencies, eslint, eslint-config-next (+30 more)

### Community 2 - "Analytics Consent Runtime"
Cohesion: 0.09
Nodes (21): ConsentContext, ConsentContextValue, ConsentProvider(), ConsentState, useConsent(), YandexMetrika(), gerhaus, jbm (+13 more)

### Community 3 - "Quiz Analytics Logic"
Cohesion: 0.10
Nodes (24): reachGoal(), Window, PROFILE_PRIORITY, PROFILES, QUESTIONS, Action, initialState, quizReducer() (+16 more)

### Community 4 - "Consent SEO Plan"
Cohesion: 0.10
Nodes (31): Consent Browser Smoke Test, Consent-Only Yandex Metrika Loading, ConsentProvider State Machine, Cookie Banner and Settings Control, Cookie Policy Page, Explicit Consent Before Analytics, Consent Guard for reachGoal, Consent Cookies and Search Metadata Implementation Plan (+23 more)

### Community 5 - "Product Plans Prototype"
Cohesion: 0.08
Nodes (26): Next.js Local Docs Rule, Premium CSS Architecture, Four-Complex Location Map, Quiz Runtime Flow, Slot Runtime Flow, Static Landing Final, MVP Implementation Plan, Sprint 2 Implementation Plan (+18 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 7 - "Booking Telegram Flow"
Cohesion: 0.20
Nodes (10): SLOTS, buildTelegramLink(), readUsername(), Profile, profileGlow, QuizResult(), BookingSlot(), DAY_ABBR (+2 more)

### Community 8 - "Legal Policy Pages"
Cohesion: 0.43
Nodes (4): CookiesPage(), metadata, metadata, PrivacyPage()

### Community 10 - "SVG Brand Identity"
Cohesion: 0.50
Nodes (5): НК Brand Mark, Dark Background, House Outline, Neon Blue Gradient, НК Monogram

### Community 11 - "Transparent Brand Identity"
Cohesion: 0.50
Nodes (5): Cyan-to-Blue Glowing Gradient, Home-Oriented Brand Identity, House-Shaped Outline, Abstract Interior Monogram, Transparent Logo Image

### Community 12 - "Graphify Pipeline"
Cohesion: 0.50
Nodes (4): AST Extraction, Graph Outputs, Graphify Pipeline, Semantic Extraction

### Community 13 - "Mobile CSS Tests"
Cohesion: 0.67
Nodes (3): css, max560Rule(), mediaRule()

### Community 15 - "Vercel Starter Assets"
Cohesion: 0.67
Nodes (3): Vercel Logo, Next.js Starter Project, Vercel Deployment

## Knowledge Gaps
- **116 isolated node(s):** `gerhaus`, `nunito`, `jbm`, `metadata`, `viewport` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CONTENT` connect `UI Section Tests` to `Analytics Consent Runtime`, `Quiz Analytics Logic`, `Booking Telegram Flow`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `reachGoal()` connect `Quiz Analytics Logic` to `UI Section Tests`, `Analytics Consent Runtime`, `Booking Telegram Flow`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `gerhaus`, `nunito`, `jbm` to the rest of the system?**
  _125 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Section Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.10801393728222997 - nodes in this community are weakly interconnected._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Analytics Consent Runtime` be split into smaller, more focused modules?**
  _Cohesion score 0.09246088193456614 - nodes in this community are weakly interconnected._
- **Should `Quiz Analytics Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.10227272727272728 - nodes in this community are weakly interconnected._