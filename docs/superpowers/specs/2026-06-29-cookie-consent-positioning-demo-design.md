# Cookie consent positioning demo HTML

Date: 2026-06-29

Status: approved design

## Goal

Create a standalone HTML demo that visually compares cookie-banner positioning options without changing production behavior. The demo must make it easy to judge visibility, overlap risk, and suitability for both mobile and desktop.

## Success criteria

- One standalone HTML file renders without project build steps or external dependencies.
- The demo includes both mobile and desktop preview modes.
- The demo shows the fixed mobile CTA and footer legal area as collision zones.
- The demo presents 8 positioning variants side by side in a clear comparison layout.
- Each variant includes a short label, visibility rating, and overlap-risk note.
- The banner style stays close to the current liquid-glass visual language.
- The file is safe to review locally and does not affect app routing, consent logic, or analytics behavior.

## Scope

The demo is a static artifact for product and UX review only. It does not integrate with `ConsentProvider`, `CookieBanner`, or any runtime code. It does not need to reproduce the full landing page; it only needs enough surrounding UI to evaluate placement decisions.

## Output

Create one HTML file under a docs-oriented path so it is clearly non-production. The file contains:

- a small header explaining the purpose of the demo;
- a segmented toggle for `Mobile` and `Desktop`;
- a grid of 8 variant cards;
- within each card, a simplified landing-page frame with:
  - hero/content blocks;
  - footer legal links zone;
  - fixed mobile CTA zone when mobile mode is active;
  - one cookie-banner placement variant.

## Variants to show

1. Top-right capsule
2. Top-center mini-card
3. Bottom sheet above CTA
4. Bottom-left floating card
5. Inline top strip
6. Right-side desktop dock
7. Scroll re-prompt strip
8. Pre-quiz intent prompt

These are comparison mockups, not a recommended production shortlist by themselves.

## Visual design

The demo should stay visually close to the current site direction:

- dark atmospheric background;
- frosted or liquid-glass cookie surfaces;
- subtle violet/cyan accent usage;
- rounded cards and soft borders;
- readable labels and compact annotations.

The surrounding mock landing frame should be intentionally simplified so the placement decision remains visually obvious.

## Interaction design

- `Mobile` mode switches cards to a narrow phone-like frame and shows the fixed CTA conflict zone.
- `Desktop` mode switches cards to a wide frame and emphasizes hero/header visibility instead of the bottom CTA conflict.
- No real consent actions are required; buttons may be present visually but do not need stateful behavior.
- The demo may use light inline JavaScript only for the mode toggle.

## Accessibility and robustness

- The demo should remain readable with JavaScript disabled, defaulting to one mode.
- Controls should be semantic buttons.
- Text contrast must stay readable against glass surfaces.
- The file should avoid remote fonts, scripts, images, or network requests.

## Out of scope

- Any change to production React components, CSS, or consent logic.
- Any attempt to measure real consent conversion in this task.
- Browser automation or visual-regression infrastructure for the demo.

## Verification

- Open the HTML file locally in a browser and confirm both modes render.
- Confirm all 8 variants are visible and annotated.
- Confirm mobile mode clearly shows the relationship between cookie UI, fixed CTA, and legal links.
- Confirm desktop mode clearly shows the relationship between cookie UI and primary content visibility.
