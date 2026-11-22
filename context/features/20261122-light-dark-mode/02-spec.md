# Spec: Light and dark mode

| Field | Value |
|---|---|
| Feature ID | 20261122-light-dark-mode |
| Status | Approved on 2026-11-22 |
| Discussion | [01-discussion.md](01-discussion.md) |

## 1. Goal

AtmosLens has a single bright theme, which is harsh at night or in dark rooms. Visitors get a dark theme as well as today's light theme. They can switch between them with one click; the page follows their OS preference by default and remembers an explicit choice.

Success: every screen and surface of the app is usable in both themes, and switching never needs a reload.

## 2. Scope

**In scope**
- Light theme (current look, unchanged) and dark theme for the landing and results screens.
- A two-state toggle button in the navbar on both screens.
- Initial theme from the OS `prefers-color-scheme`, followed live until the user makes an explicit choice.
- Persisting the explicit choice in browser storage.
- Applying the theme before first paint (no light flash for dark-mode users).
- Dark styling of: page background overlay, navbar, search input and dropdown menu, current-weather card, hourly chart, detail cards, 5-day accordion, UI glyph icons.

**Out of scope**
- A third "System" option in the UI.
- New background photos or new icon files.
- Theming `manifest.json` or the browser `theme-color` meta.
- Fixing contrast of the existing light theme (it must not regress, but it is not re-audited).

## 3. Actors and permissions

| Actor | Can | Cannot |
|---|---|---|
| Visitor (anonymous) | Switch theme; have the choice remembered in their own browser | Affect any other visitor's theme |

## 4. User stories

- **US-01**: As a visitor, I want the page to match my OS light/dark setting by default, so that it fits my environment without any action.
- **US-02**: As a visitor, I want a toggle in the navbar to switch between light and dark, so that I can override the default.
- **US-03**: As a returning visitor, I want my chosen theme remembered, so that I do not have to switch it again on every visit.
- **US-04**: As a visitor using dark mode, I want every part of the page to be readable, so that dark mode is actually usable.

## 5. Acceptance criteria

| ID | Story | Given | When | Then |
|---|---|---|---|---|
| AC-01 | US-01 | No saved theme; OS prefers dark | The page loads | The page renders in the dark theme, and the theme is already dark at first paint (no light flash) |
| AC-02 | US-01 | No saved theme; OS prefers light or reports no preference | The page loads | The page renders in the light theme |
| AC-03 | US-01 | No saved theme; page open in light theme | The OS switches to dark | The page switches to dark without a reload; nothing is saved |
| AC-04 | US-02 | Page in light theme (landing or results screen) | The visitor activates the toggle (click, Enter or Space) | The whole page switches to dark immediately, and the toggle's accessible name becomes "Switch to light mode" |
| AC-05 | US-02 | Page in dark theme | The visitor activates the toggle | The whole page switches to light, and the toggle's accessible name becomes "Switch to dark mode" |
| AC-06 | US-03 | The visitor chose dark; OS prefers light | The page is reloaded | The page renders dark at first paint; later OS changes do not change the theme |
| AC-07 | US-03 | Browser storage is unavailable (reading or writing throws) | The page loads and the visitor toggles | No error is shown or thrown; the page starts with the OS default and the toggle still switches theme for the current session |
| AC-08 | US-03 | Storage holds an unknown theme value (e.g. `"blue"`) | The page loads | The value is ignored and the OS default is used |
| AC-09 | US-02 | Dark theme on the landing screen | The visitor searches a city and the results screen appears | The results screen is dark, and the toggle is present in its navbar and reports the same state |
| AC-10 | US-04 | Dark theme on the results screen with weather data | The visitor views the page | Background overlay, navbar, search input and open dropdown menu, current-weather card, hourly chart (line, labels, points), detail cards, 5-day accordion (collapsed and expanded) and UI glyph icons all use dark surfaces with light text/strokes, meeting NFR-01 |

## 6. Business rules

- **BR-01**: Allowed theme values are exactly `light` and `dark`.
- **BR-02**: Theme resolution order: saved explicit choice (if valid) > OS `prefers-color-scheme: dark` > `light`.
- **BR-03**: Only an explicit toggle action saves a value. Following the OS never writes to storage.
- **BR-04**: Dark theme keeps the `bg02.jpg` background photo with a darker overlay than light mode (light mode keeps today's overlay).
- **BR-05**: The light theme looks the same as before this feature, apart from the added toggle.

## 7. Data

| Entity / field | Type | Constraints | PII? |
|---|---|---|---|
| Saved theme (browser localStorage, one key) | string | `light` or `dark`; any other value is ignored | No |

Nothing is sent to a server.

## 8. Interfaces

### UI source

Mode `codebase` (see `context/project/ui-source.md`).

| Screen / state | Source (repo path) | May differ by |
|---|---|---|
| Landing, light | `src/App.js` (landing) + `src/App.css` | Adds the toggle button in the navbar only |
| Landing, dark | `src/App.js` (landing) + `src/App.css` | Dark overlay, light text, dark search input/menu; same layout |
| Results, light | `src/App.js` (results) + `src/App.css`, `src/components/*` | Adds the toggle button in the navbar only |
| Results, dark | `src/App.js` (results), `current-weather/`, `forecast/forecast.*`, `forecast/hourly.*`, `search/search.js` | Dark glass cards (same shape, blur, radius, spacing), light text, light chart strokes; same layout |
| Toggle button | Navbar next to `.navbar-logo` in `src/App.js` | New icon button (sun shown in dark mode, moon in light mode), styled like existing navbar items; uses an inline or existing glyph, no new image library |

Empty / loading / error states: none exist today and none are added by this feature.

### API / events

No API changes. Reads the OS colour-scheme preference and listens for its change events.

## 9. Non-functional requirements

| ID | Category | Requirement (measurable) |
|---|---|---|
| NFR-01 | Accessibility | Dark theme: body text on cards, navbar and menus has contrast >= 4.5:1 (large text >= 3:1, WCAG 2.1 AA). Icons, chart strokes and the toggle have contrast >= 3:1 against their background. The toggle meets >= 3:1 in both themes |
| NFR-02 | Accessibility | The toggle is a native `<button>` reachable by Tab, works with Enter and Space, has an accessible name describing the action (AC-04/05), exposes state via `aria-pressed` (true when dark), and has a visible focus outline |
| NFR-03 | Performance | Theme switch is applied in the same frame as the click (no network, no reload); no light flash on load in dark mode (AC-01, AC-06) |
| NFR-04 | Compatibility | Works in the browsers in the `package.json` production browserslist; if `prefers-color-scheme` is unsupported, light is used |
| NFR-05 | Security / privacy | Only the theme value is stored; no new runtime dependency; no data leaves the browser |

## 10. Edge cases

- Storage throws on read or write (private mode, blocked site data): covered by AC-07.
- Invalid saved value: AC-08.
- OS changes theme after an explicit choice: ignored (AC-06).
- Theme switched while the search dropdown or an accordion item is open: the open element re-styles immediately without closing.
- Toggling rapidly several times: the final state matches the last click.

## 11. Open questions

- none
