# Cookie consent redesign: Privacy capsule + dialog

Date: 2026-06-29

Status: approved design

## Goal

Replace the current persistent bottom cookie banner with the selected “Privacy capsule + dialog” design. The passive consent UI must not cover the fixed mobile CTA or footer legal links. Analytics must remain disabled until explicit consent.

## Success criteria

- With no stored decision, the page shows a small liquid-glass capsule: “Cookies выключены · Настроить”.
- The passive capsule never overlaps the fixed mobile CTA or footer legal links.
- Activating the capsule opens a bottom-sheet dialog on mobile and a centered dialog on desktop.
- The first dialog layer exposes equally prominent “Отказаться” and “Принять” actions.
- Closing the dialog without choosing leaves analytics disabled and keeps the capsule available.
- Accepting enables Yandex Metrika and Webvisor through the existing consent gate.
- Declining persists the refusal and keeps analytics disabled.
- After either decision, the capsule disappears; “Настройки cookies” in the footer remains available.
- No new dependency or consent-storage format is introduced.

## Interaction design

### Passive state

When `decision === null`, render a compact fixed capsule near the top-right safe area:

- mobile: `12px` from the right and at least `12px` below `env(safe-area-inset-top)`;
- desktop: `20px` from the top and right;
- maximum width: `240px` on mobile and `280px` on desktop;
- copy: “Cookies выключены · Настроить”;
- liquid-glass surface using the project’s existing glass tokens;
- small enough to avoid the hero’s primary reading path while remaining clearly actionable.

The capsule remains visible until the visitor accepts or declines. Analytics stays disabled while the visitor ignores it.

### Open state

Activating the capsule opens a native modal dialog:

- mobile: bottom sheet with safe-area padding and rounded top corners;
- desktop: centered panel with a constrained readable width;
- visible title: “Настройки cookies”;
- short explanation that Yandex Metrika and Webvisor are disabled without consent;
- links to `/cookies/` and `/privacy/`;
- equal-width and equal-weight “Отказаться” and “Принять” buttons;
- visible close button.

The dialog opens only after a user action. While it is open, the background is intentionally inert. This is the sole exception to the no-overlap rule: the user-invoked modal may visually cover background content, including the CTA, until it is closed or a decision is made. No passive consent layer may do so.

The dialog supports:

- focus moved inside when opened;
- focus trapped inside while modal;
- `Escape` and the close button to dismiss without choosing;
- focus returned to the capsule or footer settings button after dismissal.

### Decision state

On “Принять”:

1. Persist `accepted` through the existing `writeConsent` contract.
2. Close the dialog.
3. Remove the capsule.
4. Mount the existing Yandex Metrika integration.

On “Отказаться”:

1. Persist `declined` through the existing `writeConsent` contract.
2. Close the dialog.
3. Remove the capsule.
4. Keep Yandex Metrika unmounted.

### Reopening settings

The existing footer button opens the dialog immediately. To preserve the current privacy-first behavior, reopening settings clears the stored decision and unmounts analytics before the dialog appears. Closing without a new choice therefore leaves analytics disabled and restores the passive capsule.

## Component design

### `ConsentProvider`

Keep consent persistence and analytics gating in `components/analytics/ConsentProvider.tsx`.

Add one transient UI state, `settingsOpen`, alongside `decision`:

- initial unresolved visitor: `decision === null`, `settingsOpen === false`;
- capsule activation: `settingsOpen = true`;
- dialog dismissal: `settingsOpen = false`, decision unchanged;
- accept or decline: persist decision and set `settingsOpen = false`;
- footer `reopen`: clear the stored decision, set `decision = null`, then set `settingsOpen = true`.

Extend the consent UI contract only as needed to open and close settings. Do not change the local-storage key, version, TTL, or stored payload.

### `CookieBanner`

Keep `components/legal/CookieBanner.tsx` as the implementation file to minimize file churn, but change its presentation from a bottom banner to:

1. passive capsule trigger;
2. controlled native `<dialog>`;
3. mobile bottom-sheet and desktop centered-panel styling.

The component remains responsible only for consent presentation and user actions. It does not load analytics or access storage directly.

### `CookieSettingsButton`

Keep the existing footer control and visible label. Its `reopen` action must open the dialog directly rather than leaving the visitor at the passive capsule.

### Styling

Reuse existing colors, glass backgrounds, borders, radii, shadows, and typography. Add only selectors that cannot be expressed cleanly with existing utilities, primarily:

- safe-area capsule positioning;
- dialog backdrop;
- bottom-sheet geometry on mobile;
- centered dialog geometry on desktop.

Do not introduce new global design tokens or restyle unrelated cards and buttons.

## Data flow

```text
hydrate consent
  ├─ accepted → mount Metrika; no capsule
  ├─ declined → no Metrika; no capsule
  └─ unset → no Metrika; show capsule
                    │
                    └─ user opens dialog
                         ├─ close/Escape → no decision; show capsule
                         ├─ decline → persist declined; close UI
                         └─ accept → persist accepted; mount Metrika; close UI
```

## Failure behavior

- If local storage is unavailable, existing `writeConsent` behavior remains authoritative. The UI closes for the current session after the chosen action, but no unsupported persistence mechanism is added.
- Dialog dismissal never implies consent.

## Accessibility requirements

- Capsule and close controls are semantic buttons with accessible names.
- Dialog has a visible title and an accessible label relationship.
- Keyboard focus is visible and cannot move behind an open modal.
- `Escape` dismisses without changing consent.
- Focus returns to the control that opened the dialog.
- Accept and decline are available on the first layer and have comparable visual prominence.
- Motion respects `prefers-reduced-motion`.

## Verification plan

Update component tests to cover:

1. Unset consent renders the capsule, not an open dialog.
2. Capsule activation opens a dialog containing both policy links and both decision actions.
3. Close and `Escape` preserve the unset decision and return to the capsule.
4. Accept persists once, closes the UI, and mounts Metrika.
5. Decline persists once, closes the UI, and keeps Metrika unmounted.
6. Footer settings clears the prior decision and opens the dialog immediately.
7. Passive mobile consent UI does not share the bottom fixed position used by `StickyCta`.

Run the targeted consent/component tests, TypeScript check, lint, and production build. Complete a mobile and desktop browser pass for capsule placement, dialog focus, safe-area spacing, CTA visibility, and footer legal-link access.

## Out of scope

- Changing consent storage format, policy version, or TTL.
- Adding granular vendor toggles beyond the current single analytics category.
- Changing Yandex Metrika configuration.
- Restyling the fixed CTA, footer, or legal pages.
- Applying liquid-glass styling to unrelated sections.
