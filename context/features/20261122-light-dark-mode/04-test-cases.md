# Test Cases: Light and dark mode

`matchMedia` is mocked in every jsdom test (jsdom has none). All fixtures are minimal fake JSON inline in the test file, with no real keys.

| ID | Covers | Level | Preconditions | Input / action | Expected result | Test file | Status |
|---|---|---|---|---|---|---|---|
| TC-01 | AC-01, BR-02 | unit | storage empty; `matchMedia` dark=true | `resolveInitialTheme()` | `'dark'` | `src/utils/theme.test.js` | todo |
| TC-02 | AC-02, BR-02 | unit | storage empty; `matchMedia` dark=false | `resolveInitialTheme()` | `'light'` | `src/utils/theme.test.js` | todo |
| TC-03 | AC-02, NFR-04 | unit | storage empty; `window.matchMedia` undefined | `getSystemTheme()`, `resolveInitialTheme()` | `'light'`, no throw | `src/utils/theme.test.js` | todo |
| TC-04 | AC-08, BR-01 | unit | storage `atmoslens-theme='blue'`; OS dark | `readSavedTheme()`, `resolveInitialTheme()` | `null`; `'dark'` | `src/utils/theme.test.js` | todo |
| TC-05 | AC-06, BR-02 | unit | storage `'dark'`; OS light | `resolveInitialTheme()` | `'dark'` | `src/utils/theme.test.js` | todo |
| TC-06 | AC-07 | unit | `getItem` and `setItem` throw | `readSavedTheme()`; `saveTheme('dark')` | returns `null`; neither throws | `src/utils/theme.test.js` | todo |
| TC-06b | AC-07 | unit (hook) | `setItem` throws; OS light | `renderHook(useTheme)`, `toggleTheme()` | theme becomes `'dark'`; no error thrown | `src/utils/theme.test.js` | todo |
| TC-07 | AC-03, BR-03 | unit (hook) | storage empty; OS light | dispatch OS `change` to dark | theme `'dark'`; `setItem` not called | `src/utils/theme.test.js` | todo |
| TC-08 | AC-06 | unit (hook) | storage empty; OS light | `toggleTheme()`, then OS `change` to light | theme stays `'dark'`; storage holds `'dark'` | `src/utils/theme.test.js` | todo |
| TC-09 | AC-04 | unit (hook) | OS dark | render the hook, then `toggleTheme()` | `<html data-theme>` is `'dark'`, then `'light'` | `src/utils/theme.test.js` | todo |
| TC-10 | AC-04, NFR-02 | component | `theme='light'` | render; click | button named "Switch to dark mode", `aria-pressed="false"`; `onToggle` called once | `src/components/theme-toggle/theme-toggle.test.js` | todo |
| TC-11 | AC-05, NFR-02 | component | `theme='dark'` | render | button named "Switch to light mode", `aria-pressed="true"` | `src/components/theme-toggle/theme-toggle.test.js` | todo |
| TC-12 | AC-04, AC-05, NFR-02 | component | `theme='light'` | Tab to the button, then press Enter, then Space | button has focus; `onToggle` called exactly twice | `src/components/theme-toggle/theme-toggle.test.js` | todo |
| TC-13 | AC-04 | integration | storage empty; OS light | render `<App/>` on landing; click "Switch to dark mode" | `<html data-theme="dark">`; button now named "Switch to light mode" | `src/App.test.js` | todo |
| TC-14 | AC-09 | integration | storage `'dark'`; Search mocked; `fetch` stubbed with fake weather + forecast (`list: []`) | render `<App/>`; trigger search | results screen shown (city heading); toggle present, named "Switch to light mode", `aria-pressed="true"`; `<html data-theme="dark">` | `src/App.test.js` | todo |
| TC-16 | BR-05 (replaces stale CRA test) | integration | OS light | render `<App/>` | heading "AtmosLens" visible on the landing screen | `src/App.test.js` | todo |
| TC-17 | AC-01, NFR-03, BR-04 | unit (static script) | storage empty; OS dark | evaluate the `#theme-init` script from `public/index.html` | `<html data-theme="dark">` | `src/utils/theme.test.js` | todo |
| TC-18 | AC-06, AC-07, AC-08, NFR-03 | unit (static script) | cases: saved `'dark'` + OS light; saved `'blue'` + OS light; storage throws + OS dark | evaluate the script | `'dark'`; `'light'`; `'dark'` with no throw | `src/utils/theme.test.js` | todo |
| TC-19 | NFR-05 | unit (static) | none | read `public/index.html` | the script uses exactly `THEME_STORAGE_KEY` (`'atmoslens-theme'`) | `src/utils/theme.test.js` | todo |

TC-15 was merged into TC-06b during planning; the ID is intentionally unused.

## Checks (visual / non-Jest)

| ID | Covers | Method | Pass condition | Task |
|---|---|---|---|---|
| CK-01 | AC-10, NFR-01, BR-04, NFR-03 | Run `npm start`. In dark mode, check the landing and results screens (a searched city): background, navbar, search input and open menu, current-weather card, hourly chart, 4 detail cards, accordion collapsed and expanded, glyph icons. Reload in dark: no light flash. Compute WCAG contrast ratios for every dark text/background pair. | Every surface is dark with light text. Text >= 4.5:1 (large >= 3:1). Icons, chart strokes and the toggle >= 3:1 (the toggle also in light). Ratios recorded in `05-implementation-log.md` | T-06, T-07 |
| CK-02 | BR-05 | `git diff <diffBase> -- '*.css' public/index.html src/components/search/search.js` | CSS: additions only. `search.js`: each changed line keeps its old literal as the `var()` fallback. Light-mode screens look unchanged apart from the toggle | T-06, T-07 |
| CK-03 | Spec section 10 edge case | Open the search menu and toggle theme; expand an accordion item and toggle theme | The open element re-styles immediately and stays open | T-06, T-07 |

Status values: `todo` -> `red` (failing test written) -> `green` (passing) -> `verified` (full suite green after review).
