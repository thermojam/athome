# Graph Report - .  (2026-06-22)

## Corpus Check
- 97 files · ~72,203 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 236 nodes · 331 edges · 40 communities (27 shown, 13 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Entry Tests|App Entry Tests]]
- [[_COMMUNITY_Landing Spec Evolution|Landing Spec Evolution]]
- [[_COMMUNITY_Quiz Logic|Quiz Logic]]
- [[_COMMUNITY_Dev Tooling|Dev Tooling]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Telegram CTA|Telegram CTA]]
- [[_COMMUNITY_Booking Analytics|Booking Analytics]]
- [[_COMMUNITY_Shared Content Types|Shared Content Types]]
- [[_COMMUNITY_Layout Metadata Fonts|Layout Metadata Fonts]]
- [[_COMMUNITY_Graphify Tooling|Graphify Tooling]]
- [[_COMMUNITY_Glass Card UI|Glass Card UI]]
- [[_COMMUNITY_Privacy Page|Privacy Page]]
- [[_COMMUNITY_Vercel Deployment|Vercel Deployment]]
- [[_COMMUNITY_Visual System v3.1|Visual System v3.1]]
- [[_COMMUNITY_Goal Driven Work|Goal Driven Work]]
- [[_COMMUNITY_Surgical Simplicity|Surgical Simplicity]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Gerhaus License|Gerhaus License]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_About Photo Asset|About Photo Asset]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]
- [[_COMMUNITY_Globe Icon Asset|Globe Icon Asset]]
- [[_COMMUNITY_Window Icon Asset|Window Icon Asset]]
- [[_COMMUNITY_Frame Law|Frame Law]]

## God Nodes (most connected - your core abstractions)
1. `CONTENT` - 19 edges
2. `compilerOptions` - 16 edges
3. `buildTelegramLink()` - 12 edges
4. `scripts` - 10 edges
5. `reachGoal()` - 8 edges
6. `MVP Landing Specification` - 7 edges
7. `BookingSlot()` - 5 edges
8. `AboutTrainer()` - 4 edges
9. `FinalCta()` - 4 edges
10. `TrackedLink()` - 4 edges

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
- **Landing MVP Conversion Flow** — spec_page_flow, spec_quiz_segmentation, spec_telegram_deeplink, spec_yandex_metrika, spec_trener_u_doma_v3_bookingslot [EXTRACTED 1.00]
- **Graphify Default Pipeline** — graphify_skill_graphify_pipeline, graphify_skill_ast_extraction, graphify_skill_semantic_extraction, graphify_skill_graph_outputs [EXTRACTED 1.00]
- **Sprint Evolution To v3.3 Landing** — spec_mvp_landing, spec_trener_u_doma_v3_specification, spec_trener_u_doma_v3_1_specification, plans_2026_05_29_athome_mvp_mvp_implementation_plan, plans_2026_05_31_sprint_2_sprint_2_plan, plans_2026_06_01_sprint_3_sprint_3_plan, landing_final_static_landing [INFERRED 0.85]
- **Booking To Telegram Pattern** — sections_bookingslot_bookingslot, lib_telegram_buildtelegramlink, specs_2026_05_31_sprint_2_design_honest_booking_mvp, spec_telegram_deeplink [INFERRED 0.95]

## Communities (40 total, 13 thin omitted)

### Community 0 - "App Entry Tests"
Cohesion: 0.14
Nodes (10): size, CONTENT, Hero(), HeroBackground(), LocationMap(), Objections(), ICONS, Transformation() (+2 more)

### Community 1 - "Landing Spec Evolution"
Cohesion: 0.09
Nodes (24): Next.js Local Docs Rule, Premium CSS Architecture, Four-Complex Location Map, Quiz Runtime Flow, Slot Runtime Flow, Static Landing Final, MVP Implementation Plan, Sprint 2 Implementation Plan (+16 more)

### Community 2 - "Quiz Logic"
Cohesion: 0.18
Nodes (14): BRIDGES, PROFILE_PRIORITY, PROFILES, QUESTIONS, Action, initialState, quizReducer(), resolveResult() (+6 more)

### Community 3 - "Dev Tooling"
Cohesion: 0.10
Nodes (20): devDependencies, eslint, eslint-config-next, jsdom, @playwright/test, prettier, prettier-plugin-tailwindcss, tailwindcss (+12 more)

### Community 4 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 5 - "Package Dependencies"
Cohesion: 0.11
Nodes (18): dependencies, lucide-react, next, react, react-dom, name, private, scripts (+10 more)

### Community 6 - "Telegram CTA"
Cohesion: 0.21
Nodes (10): buildTelegramLink(), readUsername(), Goal, Profile, profileGlow, QuizResult(), AboutTrainer(), FinalCta() (+2 more)

### Community 7 - "Booking Analytics"
Cohesion: 0.22
Nodes (8): reachGoal(), Window, SLOTS, BookingSlot(), DAY_ABBR, Analytics Flow Once Per Visit, Honest Booking MVP, Metrics Preserved v3.3

### Community 8 - "Shared Content Types"
Cohesion: 0.18
Nodes (10): BridgeContent, LeadPayload, MapPoint, ProblemIcon, QuizOption, SiteContent, Slot, ICON_MAP (+2 more)

### Community 9 - "Layout Metadata Fonts"
Cohesion: 0.25
Nodes (6): YandexMetrika(), gerhaus, jbm, metadata, nunito, viewport

### Community 10 - "Graphify Tooling"
Cohesion: 0.50
Nodes (4): AST Extraction, Graph Outputs, Graphify Pipeline, Semantic Extraction

### Community 13 - "Vercel Deployment"
Cohesion: 0.67
Nodes (3): Vercel Logo, Next.js Starter Project, Vercel Deployment

### Community 14 - "Visual System v3.1"
Cohesion: 0.67
Nodes (3): Cyan Button System, Lucide Icons, Specification v3.1

## Knowledge Gaps
- **100 isolated node(s):** `gerhaus`, `nunito`, `jbm`, `metadata`, `viewport` (+95 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CONTENT` connect `App Entry Tests` to `Quiz Logic`, `Telegram CTA`, `Booking Analytics`, `Shared Content Types`, `Layout Metadata Fonts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Tooling` to `Package Dependencies`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `gerhaus`, `nunito`, `jbm` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Entry Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.13538461538461538 - nodes in this community are weakly interconnected._
- **Should `Landing Spec Evolution` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Dev Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._