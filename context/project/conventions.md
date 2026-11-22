# Coding Conventions

Captured by `/onboard` on 2026-11-22. Facts come from the code; `[PROPOSED]` items were accepted by the user as the rule for new and changed code.

## Naming

| Element | Convention | Example |
|---|---|---|
| Component folders and files | kebab-case | `current-weather/current-weather.js` |
| Root CRA files | PascalCase (keep) | `App.js`, `App.css` |
| Components | PascalCase | `CurrentWeather`, `HourlyForecast` |
| Functions / handlers | camelCase; handlers `handle<Event>` / `on<Event>` props | `handleOnSearchChange`, `onSearchChange` |
| Variables | camelCase | `currentWeather`, `forecast` |
| Constants | UPPER_SNAKE | `WEATHER_API_URL`, `WEEK_DAYS` |
| CSS classes | kebab-case, prefixed by component/area | `forecast-row`, `hourly-item`, `detail-card-value` |
| Tests | `<file>.test.js` next to the source | `search.test.js` |

## Code style

- ESLint `react-app` + `react-app/jest` (config in `package.json`) is the source of truth. `npx eslint src` must exit 0.
- [PROPOSED] Formatting for new and changed code: 2-space indent, single quotes in JS, double quotes in JSX attributes, always semicolons.
- Do not reformat untouched files or lines. Existing files mix 2/4 spaces, tabs (`api.js`), quote styles and missing semicolons.
- Function components only. `App` is a `function` declaration. Other components are `const X = ({ ...props }) => { ... }` with one `export default X;` at the bottom.
- Imports: React or library imports first, then local modules, then the component's own `.css`. Relative paths only; no aliases.
- One plain CSS file per component, global scope. No CSS modules, no CSS-in-JS except the `react-select` `styles` object.

## Patterns

- State: `useState` in `App.js`, passed down as props (`data`, `unit`, `setUnit`). The landing/results screen switch is `!currentWeather`.
- Units: data is fetched in metric (`units=metric`); °F is converted on the client. Reuse an existing conversion rather than adding a fifth copy of `convertTemp`; extracting it to a shared helper is in scope only when a spec touches it.
- Data fetching: native `fetch`, inline in the component; weather uses `Promise.all` of `/weather` and `/forecast` (`App.js`).
- Error handling: today's code only logs in `catch` and never checks `response.ok`. New or changed fetch code must check `response.ok` and show a user-visible error or empty state.
- Logging: `console.*` for debugging only. Do not commit new `console.log` calls. Never log API keys or full request URLs that contain keys.
- Configuration: constants in `src/api.js`. If env vars are introduced, use `process.env.REACT_APP_*` and treat them as public.
- Async: `async`/`await` or `.then` both exist; prefer `async`/`await` in new code. Debounce search input through `AsyncPaginate`'s `debounceTimeout`.
- Dates/times: native `Date`. OpenWeatherMap `dt_txt` is UTC and the city offset is in `city.timezone`. New code must not parse `dt_txt` as local time.
- Accessibility: meaningful `alt` on informative images (e.g. the weather description); `alt=""` on decorative glyphs next to a text label. Interactive elements are real `<button>`/`<a>`. Toggles expose state (`aria-pressed` or a label).

## Testing conventions

- Jest + React Testing Library + jest-dom. Query by role/label/text the way a user would; avoid testing implementation details.
- Unit/component tests only; no e2e tooling installed.
- Naming: `test('<does behavior> when <condition>', ...)` or `describe('<Component>') / it('...')`.
- Mock only at the network boundary: stub `global.fetch` (e.g. `jest.spyOn(global, 'fetch')`) and restore it after each test. Do not call real APIs in tests.
- Exception: App-level tests may replace the third-party async `Search` widget (`react-select-async-paginate`) with a stub via `jest.mock('./components/search/search')`, as `src/App.test.js` does. Test the real `Search` in its own component test.
- Browser APIs jsdom lacks (`window.matchMedia`) are mocked per test and removed in `afterEach`.
- Fixtures: fake, minimal OpenWeatherMap/GeoDB-shaped JSON with no real keys or PII ([PROPOSED] location in `structure.md`).
- Coverage expectation: every new or changed behavior has a test. No global threshold is configured.
- Known red baseline: `src/App.test.js` ("renders learn react link") fails. Do not delete or weaken it; replace it through an approved change.

## Git

- Branches: `feat/<YYYYMMDD>-<slug>` for features, `fix/<YYYYMMDD>-<slug>` for bugs; `master` is the main branch.
- Commit messages: short imperative, lowercase subject (history: "add weather web"). [PROPOSED] Keep that style; one logical change per commit.

## Artifact language

- Context docs and code comments: English.
