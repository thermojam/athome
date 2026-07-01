# Cookie consent redesign: deep clear glass banner

Date: 2026-07-01

Status: approved visual design

## Goal

Replace the current privacy capsule and modal dialog with a bottom cookie-consent banner based on the behavior of `ksenia-kamenskaya.ru`, adapted to the existing `athome` design system.

The banner must appear only after the visitor's first interaction, preserve the existing analytics consent gate, and use deep transparent glass rather than an opaque or smoky surface.

## Success criteria

- With no stored consent decision, no consent UI appears on initial load.
- The banner appears after the first `scroll`, `touchstart`, `pointerdown`, or `keydown` event.
- The passive capsule and modal dialog are removed.
- The banner uses the selected deep-clear-glass treatment: dark tint around 22%, `7px` backdrop blur, no white haze, and no decorative color indicator.
- The content block contains only the heading, explanatory copy, legal links, and decision buttons.
- On mobile, the fixed CTA remains visible as a cyan glow beneath the glass but cannot receive pointer input until the banner closes.
- On desktop, the banner is full-width and horizontal with `border-radius: 28px 28px 0 0`.
- Accepting persists `accepted`, hides the banner, and mounts Yandex Metrika.
- Declining persists `declined`, hides the banner, and keeps Yandex Metrika unmounted.
- The footer's cookie-settings action remains available and displays the banner immediately when used.
- Consent storage format, version, TTL, and Yandex Metrika configuration remain unchanged.

## Interaction design

### Initial unresolved state

After hydration, an unset consent decision leaves the page unchanged. Register one-time listeners for:

- `scroll`;
- `touchstart`;
- `pointerdown`;
- `keydown`.

The first of these events reveals the banner and removes all remaining reveal listeners. The reveal must happen once per unresolved visit and must not imply consent.

### Banner state

The banner is fixed to the bottom viewport edge and is non-modal. It contains:

1. Heading: `Cookies и аналитика`.
2. Short explanation that cookies and Yandex Metrika are used for anonymized statistics and page improvement.
3. Links to `/cookies/` and `/privacy/`.
4. `Отказаться` and `Принять` actions on the first layer.

There is no violet dot, status lamp, close button, backdrop, focus trap, or secondary settings layer.

The two decision buttons use the existing button system, have equal dimensions, and remain visually comparable. `Принять` may use the existing restrained cyan accent border; it must not visually overpower `Отказаться`.

### Decision state

On `Принять`:

1. Persist `accepted` through the existing consent contract.
2. Hide the banner.
3. Mount the existing Yandex Metrika integration.

On `Отказаться`:

1. Persist `declined` through the existing consent contract.
2. Hide the banner.
3. Keep Yandex Metrika unmounted.

### Reopening from the footer

The existing footer control remains the only persistent way to revisit the decision.

Activating it clears the stored decision through the existing `reopen` flow and displays the banner immediately. It does not wait for another page interaction. Until a new decision is made, analytics remains disabled.

## Responsive visual design

### Shared glass treatment

Use the project's existing dark, cyan, typography, border, and shadow tokens. The selected visual recipe is:

- transparent dark background tint close to `rgba(7, 11, 19, 0.22)`;
- `backdrop-filter: blur(7px) saturate(1.25) contrast(1.04)`;
- a restrained translucent top border and inner edge highlight;
- no white overlay, milky gradient, smoke effect, or decorative violet indicator;
- no new global design tokens unless an existing token cannot express the approved result.

The final values may be adjusted minimally during browser verification if the real page differs from the mockup, but the result must remain visually transparent and free of haze.

### Mobile

- The banner spans the viewport width and sits at the bottom edge.
- The top corners are rounded; the bottom corners remain flush with the viewport.
- Content uses a vertical layout: copy and links first, then two equal-width actions.
- Bottom padding includes the safe-area inset.
- The existing mobile `StickyCta` stays in place underneath the banner.
- The CTA's cyan surface and glow remain visible through the glass as a visual underlayer.
- The banner surface intercepts pointer input across its bounds so the underlying CTA cannot be activated accidentally.
- Once the visitor accepts or declines, the banner disappears and the CTA becomes fully visible and interactive again.

### Desktop

- The banner spans the bottom viewport width.
- The content uses a horizontal layout: copy and links on the left, actions on the right.
- The banner container uses `border-radius: 28px 28px 0 0`.
- The lower edge and bottom corners remain flush with the viewport.
- No desktop sticky CTA is introduced; the existing `StickyCta` remains mobile-only.

## Component design

### `ConsentProvider`

Keep consent persistence and analytics gating in `components/analytics/ConsentProvider.tsx`.

Replace the modal-specific `settingsOpen` state with the minimum transient state needed to control banner visibility and delayed reveal:

- accepted decision: no banner, Metrika mounted;
- declined decision: no banner, Metrika unmounted;
- unresolved before first interaction: no banner, Metrika unmounted;
- unresolved after first interaction: banner visible, Metrika unmounted;
- footer reopen: unresolved and banner visible immediately.

Do not change the local-storage key, payload, version, or TTL.

### `CookieBanner`

Keep `components/legal/CookieBanner.tsx` as the presentation component to minimize file churn.

It becomes a non-modal bottom region responsible for:

- rendering the approved content;
- invoking accept and decline callbacks;
- preventing interaction with visually covered content;
- applying accessible region labeling.

It must not access consent storage or initialize analytics directly.

### `CookieSettingsButton`

Keep the current footer label and control. Its `reopen` action reveals the banner immediately.

### Styling

Remove obsolete capsule, dialog, backdrop, close-button, and bottom-sheet selectors. Add only the selectors required for:

- deep transparent glass;
- mobile vertical and desktop horizontal layouts;
- safe-area padding;
- top-only corner radii;
- controlled entry motion.

Do not restyle the fixed CTA, footer, legal pages, or unrelated glass components.

## Accessibility

- The banner is a semantic region with an accessible consent label.
- Accept and decline are native buttons available on the first layer.
- Policy links remain keyboard accessible and visibly underlined.
- Focus styles use the existing design system.
- The banner does not trap focus because it is not modal.
- Entry motion respects `prefers-reduced-motion`.
- Covered mobile CTA content is not pointer-interactive while the banner is present.

## Data flow

```text
hydrate consent
  |-- accepted -> no banner; mount Metrika
  |-- declined -> no banner; keep Metrika unmounted
  `-- unset -> attach first-interaction listeners
                 |
                 `-- first interaction -> show bottom banner
                                            |-- decline -> persist declined; hide
                                            `-- accept -> persist accepted; hide; mount Metrika

footer settings -> clear decision -> disable Metrika -> show banner immediately
```

## Verification plan

Update or add tests for:

1. Unset consent does not render the banner before interaction.
2. Each supported first-interaction event can reveal the banner.
3. Revealing once removes all remaining listeners and does not duplicate the banner.
4. The banner has no capsule trigger, modal dialog, backdrop, close button, or violet status indicator.
5. Accept persists once, hides the banner, and mounts Metrika.
6. Decline persists once, hides the banner, and keeps Metrika unmounted.
7. Existing accepted and declined decisions do not attach reveal behavior unnecessarily.
8. Footer settings clears the prior decision and shows the banner immediately.
9. Mobile CSS preserves the fixed CTA beneath the glass while the banner occupies the interactive top layer.
10. Desktop CSS uses a horizontal layout and `28px 28px 0 0` corner radii.
11. Reduced-motion and safe-area rules remain present.

Before implementation, read the relevant installed Next.js guide under `node_modules/next/dist/docs/` as required by the repository instructions. Then run targeted tests, type checking, lint, production build, and mobile/desktop browser verification.

## Out of scope

- Changing consent storage format, policy version, or TTL.
- Changing Yandex Metrika or Webvisor configuration.
- Adding granular vendor or analytics-category controls.
- Adding a desktop sticky CTA.
- Restyling footer controls, legal pages, or the existing mobile CTA.
- Refactoring unrelated analytics or design-system code.
