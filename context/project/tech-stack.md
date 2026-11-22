# Tech Stack

Captured by `/onboard` on 2026-11-22.

| Area | Choice | Version | Notes |
|---|---|---|---|
| Language | JavaScript (JSX) | ES2020+ via Babel | No TypeScript, no tsconfig |
| Runtime | Browser (SPA); Node for tooling | Node v24.19.0 locally | No `.nvmrc` / `engines` [UNVERIFIED minimum] |
| Framework | React + react-dom | 19.2.4 | `createRoot`, no StrictMode (`src/index.js`) |
| Build tooling | Create React App (`react-scripts`) | 5.0.1 | Unmaintained; do not eject |
| Database / ORM | none | - | Client-only app |
| Test framework | Jest (via react-scripts) + React Testing Library | RTL 16.3.x, jest-dom 6, user-event 13 | user-event v13 is an old major |
| Lint / format | ESLint `react-app`, `react-app/jest` | bundled with react-scripts | Config in `package.json` `eslintConfig`; no Prettier |
| Package manager | npm | 11.x (lockfile v3) | Canonical. `yarn.lock` is legacy, to be removed |
| CI | none | - | |

## Key libraries

| Library | Purpose | Usage rule |
|---|---|---|
| `react-select-async-paginate` (+ `react-select` 5) | City autocomplete (`src/components/search/search.js`) | Style via the JS `styles` object, not global CSS |
| `react-accessible-accordion` 5 | 5-day forecast list (`src/components/forecast/forecast.js`) | Default CSS not imported; style `.accordion__*` in component CSS |
| native `fetch` | HTTP calls to GeoDB / OpenWeatherMap | No axios; do not add an HTTP library |
| native `Date` | Date/time formatting | No date library installed |
| `web-vitals` | CRA boilerplate; currently a no-op | Leave as is |

## External services

| Service | Base URL | Defined in |
|---|---|---|
| GeoDB Cities (RapidAPI) | `https://wft-geo-db.p.rapidapi.com/v1/geo` | `src/api.js` |
| OpenWeatherMap 2.5 (`/weather`, `/forecast`) | `https://api.openweathermap.org/data/2.5` | `src/api.js`, called in `src/App.js` |
| Google Fonts (Inter) | fonts.googleapis.com / fonts.gstatic.com | `public/index.html` |

## Stack-specific best practices to enforce

- Function components and hooks only; no class components.
- Hooks follow the Rules of Hooks (enforced by `eslint-plugin-react-hooks` in `react-app`).
- Stable, unique `key` props in lists. Do not add new array-index keys when an id or timestamp (`dt`) exists.
- Encode user input placed in URLs with `encodeURIComponent` / `URLSearchParams`.
- Check `response.ok` before using a fetch result in new or changed code; render an error/empty state instead of crashing.
- No `console.log` left in committed code paths (debugging only).
- Reference `public/` assets consistently with existing code; do not import large images into the JS bundle.
- Env config, if added, uses `process.env.REACT_APP_*`. These values are public in the client bundle.

## Security-relevant facts

- Auth mechanism: none (no user accounts).
- Secrets management: **none.** RapidAPI key and OpenWeatherMap key are hardcoded in `src/api.js` and are in git history. Known issue; rotation plus a proxy is a separate change (risk gate).
- `.gitignore` covers `.env.local` / `.env.*.local` but not `.env`.
- Input validation library: none. User search text goes unencoded into the GeoDB URL (`src/components/search/search.js`). Known issue.
- Data stores holding PII: none. No `dangerouslySetInnerHTML` in the codebase.
