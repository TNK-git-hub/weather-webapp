# Plan: Light and dark mode

| Field | Value |
|---|---|
| Feature ID | 20261122-light-dark-mode |
| Spec | [02-spec.md](02-spec.md) |
| Test cases | [04-test-cases.md](04-test-cases.md) |
| Status | Approved on 2026-11-22 |
| workType | code |

## 1. Technical design

**Approach:**
- The active theme is a `data-theme="light|dark"` attribute on `<html>`.
- A tiny inline script in `public/index.html` sets it before first paint, using the saved choice, then the OS `prefers-color-scheme`, then `light` (BR-02).
- In React, a `useTheme` hook resolves the same value, keeps the attribute in sync, follows OS changes live until the user toggles, and saves the explicit choice to `localStorage` with every access wrapped in try/catch.
- A `ThemeToggle` button renders in both navbars.
- Dark styling is **additive**. Dark colour tokens are CSS custom properties under `:root[data-theme='dark']` in `src/index.css`. Each component CSS file gets a `[data-theme='dark'] ...` override block at the bottom. Existing light declarations are not edited (BR-05).
- The react-select styles in `search.js` are JS objects. Their colour values become `var(--token, <current literal>)`, so light renders exactly as before and dark only defines the tokens.

**Smallest-design ladder**

| Need | Rung used |
|---|---|
| OS preference | Platform `window.matchMedia('(prefers-color-scheme: dark)')` + `change` event |
| Persistence | Platform `localStorage` |
| Theme switch | CSS attribute selector + custom properties (platform); no theming library |
| Toggle styling | Existing unused `.navbar-icon-btn` rules in `src/App.css` (reuse) |
| Toggle icon | Inline SVG with `fill="currentColor"` (no new asset or library) |
| Glyph icons on dark cards | Unchanged: `#1a8fc4` fill should reach >= 3:1 on dark surfaces (verified in CK-01) |
| Hourly chart line `#ffb300` | Unchanged (high contrast on dark); labels re-coloured via CSS |

**Components touched**

| Component | Change |
|---|---|
| `public/index.html` | Inline pre-paint theme script; dark background overlay rule |
| `src/utils/theme.js` (new) | Storage key, validation, safe read/save, OS lookup, `resolveInitialTheme`, `useTheme` hook |
| `ThemeToggle` (new) | Native `<button>` with `aria-pressed`, accessible name, sun/moon icon |
| `App` | Calls `useTheme()`, renders `<ThemeToggle>` in landing and results navbars |
| `Search` | `customStyles` colour literals become `var(--search-*, <same literal>)` |
| CSS (`index.css`, `App.css`, `current-weather.css`, `hourly.css`, `forecast.css`) | Dark tokens + dark override blocks appended |

**New / changed files** (per `context/project/structure.md`)

| Path | New / Modified | Purpose |
|---|---|---|
| `src/utils/theme.js` | New | Theme logic + hook (shared helper; `[PROPOSED]` utils location from onboarding) |
| `src/utils/theme.test.js` | New | TC-01..TC-09, TC-17..TC-19 |
| `src/components/theme-toggle/theme-toggle.js` | New | Toggle component |
| `src/components/theme-toggle/theme-toggle.css` | New | Toggle-specific styles (focus outline, icon size) |
| `src/components/theme-toggle/theme-toggle.test.js` | New | TC-10..TC-12 |
| `src/App.js` | Modified | Wire hook + toggle |
| `src/App.test.js` | Modified | TC-13, TC-14, TC-16 (TC-16 replaces the stale CRA test; needs approval, see Risks) |
| `public/index.html` | Modified | Pre-paint script + dark background |
| `src/index.css` | Modified | Dark tokens |
| `src/App.css`, `src/components/current-weather/current-weather.css`, `src/components/forecast/hourly.css`, `src/components/forecast/forecast.css` | Modified | Dark override blocks (append only) |
| `src/components/search/search.js` | Modified | Colour literals wrapped in `var()` with identical fallbacks |

**Data / migration changes:** one `localStorage` key, `atmoslens-theme`, value `light` or `dark`. No migration.

**API / interface contracts:**
- `THEME_STORAGE_KEY = 'atmoslens-theme'`
- `isValidTheme(v): boolean`
- `readSavedTheme(): 'light' | 'dark' | null` (never throws)
- `saveTheme(t): void` (never throws)
- `getSystemTheme(): 'light' | 'dark'` (`light` if `matchMedia` is missing)
- `resolveInitialTheme(): 'light' | 'dark'`
- `useTheme(): { theme, toggleTheme }`
- `<ThemeToggle theme onToggle />`

**New dependencies:** none.

**Planned risk kinds:** none (no migration, public API, dependency, authz or secret change).

## 2. Tasks

Run tasks in order. Do not parallelize. Single-test command: `npm test -- <file> --watchAll=false` (PowerShell: `$env:CI='true'`).

### T-01: Theme resolution helpers
- **Makes pass:** TC-01, TC-02, TC-03, TC-04, TC-05, TC-06
- **Files:** `src/utils/theme.js` (create), `src/utils/theme.test.js` (create)
- **UI source:** `n/a`
- **Steps:**
  1. Write failing tests TC-01..TC-06 in `src/utils/theme.test.js`. Mock `window.matchMedia` per test; spy on `Storage.prototype.getItem` / `setItem` to throw for TC-06.
  2. Run `npm test -- src/utils/theme.test.js --watchAll=false`; confirm failure (module missing).
  3. Implement `THEME_STORAGE_KEY`, `isValidTheme`, `readSavedTheme`, `saveTheme`, `getSystemTheme`, `resolveInitialTheme` with try/catch around storage.
  4. Run the test file and confirm it passes; run `npx eslint src`.
- [ ] Done

### T-02: `useTheme` hook
- **Makes pass:** TC-06b, TC-07, TC-08, TC-09
- **Files:** `src/utils/theme.js` (modify), `src/utils/theme.test.js` (modify)
- **UI source:** `n/a`
- **Steps:**
  1. Write failing `renderHook` tests:
     - OS change event while unsaved: follows the OS and writes nothing.
     - After `toggleTheme`: saves the choice and ignores later OS events.
     - Sets `document.documentElement.dataset.theme`.
     - Toggle still works when `setItem` throws.
  2. Run the test file; confirm failure (`useTheme` not exported).
  3. Implement:
     - `useState(resolveInitialTheme)`.
     - An `explicit` flag initialised from `readSavedTheme() !== null`.
     - An effect that sets the attribute.
     - An effect that subscribes to the `matchMedia` `change` event while `!explicit`, with cleanup. Use `addEventListener` when present, else `addListener`.
     - `toggleTheme`, which flips the theme, sets `explicit`, and calls `saveTheme`.
  4. Run the tests and confirm they pass; lint.
- [ ] Done

### T-03: `ThemeToggle` component
- **Makes pass:** TC-10, TC-11, TC-12
- **Files:** `src/components/theme-toggle/theme-toggle.js`, `theme-toggle.css`, `theme-toggle.test.js` (create)
- **UI source:** `src/App.js` navbar + `src/App.css` (`.navbar-icon-btn`, `.navbar-logo`)
- **Reuse:**
  - Class `navbar-icon-btn` from `src/App.css` for size, hover and shape.
  - `theme-toggle.css` adds only a `:focus-visible` outline and the icon size.
- **Steps:**
  1. Write failing tests:
     - Light: name "Switch to dark mode", `aria-pressed="false"`.
     - Dark: name "Switch to light mode", `aria-pressed="true"`.
     - Click, Enter and Space each call `onToggle` once (user-event v13: `userEvent.tab()`, `userEvent.keyboard('{enter}')`, `userEvent.keyboard('{space}')`).
  2. Run; confirm failure.
  3. Implement a `<button type="button">` with an inline sun/moon SVG (`aria-hidden="true"`, `fill="currentColor"`). Default export.
  4. Run the tests and confirm they pass; lint.
- [ ] Done

### T-04: Wire theme into `App`
- **Makes pass:** TC-13, TC-14, TC-16
- **Files:** `src/App.js` (modify), `src/App.test.js` (modify)
- **UI source:** `src/App.js` landing + results navbars
- **Reuse:** `ThemeToggle`, existing `.navbar` / `.results-navbar` flex layout. The toggle sits after `.navbar-logo` (landing: right side of the space-between navbar; results: after the logo).
- **Steps:**
  1. Replace the stale CRA test with TC-16 (landing renders the "AtmosLens" heading). Add TC-13 and TC-14.
     - In TC-14, `jest.mock('./components/search/search')` with a stub button that calls `onSearchChange({ value: '21.03 105.85', label: 'Hanoi, VN' })`.
     - Stub `global.fetch` to return minimal fake `/weather` JSON and `/forecast` JSON with `list: []`.
     - Mock `matchMedia`.
  2. Run `npm test -- src/App.test.js --watchAll=false`; confirm TC-13 and TC-14 fail (no toggle).
  3. In `App.js`: `const { theme, toggleTheme } = useTheme();` then render `<ThemeToggle theme={theme} onToggle={toggleTheme} />` in both navbars.
  4. Run the tests and confirm they pass; lint.
- [ ] Done

### T-05: Pre-paint theme script and dark background
- **Makes pass:** TC-17, TC-18, TC-19
- **Files:** `public/index.html` (modify), `src/utils/theme.test.js` (modify)
- **UI source:** `public/index.html` (global background)
- **Steps:**
  1. Write failing tests:
     - Read `public/index.html` with `fs`.
     - Extract the `<script id="theme-init">`.
     - Run it with `new Function` under mocked `localStorage` / `matchMedia`.
     - Assert `document.documentElement.dataset.theme` for: unsaved+OS dark -> dark; saved dark+OS light -> dark; saved `blue` -> OS value; storage throws -> OS value, no throw.
     - Assert the key used in the script equals `THEME_STORAGE_KEY`.
  2. Run; confirm failure (no script).
  3. Add `<script id="theme-init">` (ES5, try/catch) in `<head>` before the stylesheet.
  4. Add `html[data-theme="dark"] body { ... }` with the same `bg02.jpg` and a darker overlay, plus `!important`, matching the existing rule.
  5. Run the tests and confirm they pass.
- [ ] Done

### T-06: Dark palette: tokens, landing, navbar, search
- **Makes pass:** CK-01 (landing part), CK-02, CK-03 (search menu)
- **Files:** `src/index.css`, `src/App.css`, `src/components/search/search.js` (modify)
- **UI source:** `src/App.js` landing + `src/App.css`; `src/components/search/search.js`
- **Reuse:**
  - Existing glass pattern (same blur, radius and border shape), with dark translucent surfaces.
  - Existing breakpoints.
  - No new layout.
- **Steps:**
  1. Add dark tokens under `:root[data-theme='dark']` in `src/index.css`: `--surface`, `--surface-strong`, `--border`, `--text-strong`, `--text-muted`, `--text-on-photo`, `--accent-hover`, and the `--search-*` set. Add the body text colour override.
  2. Append a `[data-theme='dark']` block to `src/App.css` for landing text, the navbar toggle, detail cards and detail text.
  3. In `search.js`, wrap each colour literal as `var(--search-<role>, <existing literal>)`. Fallbacks must be byte-identical to today's values.
  4. Run `npx eslint src` and `npm test -- --watchAll=false` (no regressions).
  5. Run the app (`npm start`) and check the landing screen and open search menu in both themes. Record CK results and contrast ratios in `05-implementation-log.md`.
- [ ] Done

### T-07: Dark palette: results cards
- **Makes pass:** CK-01 (results part), CK-02, CK-03 (accordion)
- **Files:** `src/components/current-weather/current-weather.css`, `src/components/forecast/hourly.css`, `src/components/forecast/forecast.css` (modify, append only)
- **UI source:** `src/components/current-weather/*`, `src/components/forecast/forecast.*`, `src/components/forecast/hourly.*`
- **Reuse:** dark tokens from T-06; same card geometry.
- **Steps:**
  1. Append `[data-theme='dark']` blocks for:
     - Card surfaces and borders.
     - Status text, city name, temperature, high/low and the °C/°F toggle.
     - The hourly header, date, time, temperature, item borders and scrollbar.
     - The forecast header, rows, panel and labels.
  2. Run lint and the full suite.
  3. Run the app with weather data in dark mode. Check every AC-10 surface, with the accordion expanded and collapsed. Compute contrast ratios and record them in the log.
  4. Run `git diff <diffBase> -- '*.css'`; confirm additions only (CK-02).
- [ ] Done

### T-08: Final verification
- **Makes pass:** all (suite level)
- **Steps:**
  1. `npm test -- --watchAll=false` (expect all green, 0 failed).
  2. `npx eslint src` (exit 0).
  3. `npm run build` (exit 0).
  4. Record suite, lint and build evidence in `status.json`.
- [ ] Done

## 3. Coverage

| AC / NFR / BR | Test cases / checks | Tasks |
|---|---|---|
| AC-01 | TC-01, TC-17 | T-01, T-05 |
| AC-02 | TC-02, TC-03 | T-01 |
| AC-03 | TC-07 | T-02 |
| AC-04 | TC-09, TC-10, TC-12, TC-13 | T-02, T-03, T-04 |
| AC-05 | TC-11, TC-12 | T-03 |
| AC-06 | TC-05, TC-08, TC-18 | T-01, T-02, T-05 |
| AC-07 | TC-06, TC-06b, TC-18 | T-01, T-02, T-05 |
| AC-08 | TC-04, TC-18 | T-01, T-05 |
| AC-09 | TC-14 | T-04 |
| AC-10 | CK-01, CK-03 | T-06, T-07 |
| BR-01, BR-02 | TC-01..TC-05 | T-01 |
| BR-03 | TC-07 | T-02 |
| BR-04 | TC-17 (attribute) + CK-01 (visual) | T-05, T-06 |
| BR-05 | CK-02, TC-16 | T-04, T-06, T-07 |
| NFR-01 | CK-01 | T-06, T-07 |
| NFR-02 | TC-10, TC-11, TC-12 | T-03 |
| NFR-03 | TC-17, TC-18 | T-05 |
| NFR-04 | TC-03 | T-01 |
| NFR-05 | TC-19 (only one key) + design (no new dependency) | T-05 |
| Edge: switch with menu or accordion open | CK-03 | T-06, T-07 |
| Edge: rapid toggling | TC-12 (each press toggles once) | T-03 |

## 4. Risks

- **Stale test:**
  - `src/App.test.js` "renders learn react link" fails today, and the BUILD exit criterion needs a green suite.
  - T-04 replaces it with TC-16, which asserts the real landing heading. This does not weaken the test: the old assertion checks text the app has never shown.
  - **Needs explicit user approval at Gate 2.**
- **Untestable visuals:**
  - AC-10 and NFR-01 are visual, so they use checks: browser run plus computed contrast ratios. Jest/jsdom cannot evaluate CSS cascade or `backdrop-filter`.
- **Duplicated storage key:**
  - The key lives in both `index.html` (a static script that cannot import) and `theme.js`.
  - TC-19 guards against drift.
- **Light-flash test is indirect:**
  - The pre-paint script is tested by evaluating it in jsdom, not in a real browser.
  - Real no-flash behaviour is confirmed manually in CK-01 (reload in dark).
- **Search styling:**
  - react-select inline styles accept `var()` strings. If a browser in the browserslist did not support custom properties, the fallback literal applies, which gives the light look.
