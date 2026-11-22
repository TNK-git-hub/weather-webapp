# Project Structure

Captured by `/onboard` on 2026-11-22. Create React App layout; no router, no service layer.

## Layout

```
weather-webapp/
├── public/                       static files served as-is
│   ├── index.html                HTML shell; Google Fonts (Inter); inline body background image
│   ├── manifest.json, robots.txt, favicon.ico, logo192.png, logo512.png   (CRA defaults)
│   ├── background/               full-page background photos (bg02.jpg in use)
│   └── icons/
│       ├── <owm-code>.png        OpenWeatherMap condition icons (01d … 50n)
│       └── g_cons/*.svg          UI glyphs (logo, wind, humidity, pressure1, feels-like, forecast, hourly)
├── src/
│   ├── index.js                  entry: createRoot -> <App/>
│   ├── index.css                 global reset, body font/colour
│   ├── App.js                    app shell: navbar, state, data fetching, landing + results screens, detail cards
│   ├── App.css                   navbar, landing, results layout, detail-card grid, breakpoints
│   ├── App.test.js               app-level test (currently stale CRA default; see commands.md)
│   ├── api.js                    API base URLs, keys, fetch option objects (named exports, constants only)
│   ├── setupTests.js             imports @testing-library/jest-dom
│   ├── reportWebVitals.js        CRA boilerplate
│   └── components/
│       ├── search/               search.js + search.css: city autocomplete (calls GeoDB)
│       ├── current-weather/      current-weather.js + .css: city, icon, temp, °C/°F toggle
│       └── forecast/             forecast.js + .css (5-day accordion); hourly.js + hourly.css (3-hourly SVG chart)
├── package.json, package-lock.json   npm is canonical
└── yarn.lock                     legacy; to be removed in a separate change
```

## Placement rules

Reviewers reject files placed outside these rules.

| Kind of file | Location | Naming | Test location |
|---|---|---|---|
| UI component | `src/components/<kebab-name>/` | `<kebab-name>.js`, PascalCase component, default export | `src/components/<kebab-name>/<kebab-name>.test.js` |
| Component styles | same folder as the component | `<kebab-name>.css`, imported by that component | - |
| Sub-component tightly tied to a feature | same folder as its parent (e.g. `forecast/hourly.js`) | `<kebab-name>.js` + `.css` | same folder, `<kebab-name>.test.js` |
| App shell / top-level state / screen switching | `src/App.js`, `src/App.css` | - | `src/App.test.js` |
| API URLs, keys, request options | `src/api.js` | named `UPPER_SNAKE` or camelCase exports | - |
| API calls (fetch) | inline in the component that needs the data (current pattern: `App.js`, `search.js`) | - | test via the component with a mocked `fetch` |
| Shared helper or custom hook (`use<Name>`, e.g. `useTheme` in `src/utils/theme.js`) | `src/utils/<kebab-name>.js` (named exports) | `<kebab-name>.js` | `src/utils/<kebab-name>.test.js` |
| Global styles | `src/index.css` | - | - |
| Weather condition icon | `public/icons/<owm-code>.png` | OpenWeatherMap code | - |
| UI glyph | `public/icons/g_cons/<kebab-name>.svg` | kebab-case, no spaces | - |
| Background image | `public/background/` | lowercase | - |
| Test fixtures (API response samples) | [PROPOSED] `src/__fixtures__/<name>.json` with fake data only | - | - |
| Config / migrations / backend | none exist; adding any needs the risk gate | - | - |

## Layering / dependency rules

- `index.js` -> `App.js` -> `components/*`. Components never import `App.js`.
- Components receive data through props from `App.js`; there is no global store or context. Do not add one without a spec that needs it.
- `api.js` holds constants only and imports nothing from components.
- Static assets are referenced by relative string paths (`icons/...`, `background/...`), matching existing code.

## Do not touch

- Generated code: `build/`, `node_modules/` (gitignored).
- Do not run `npm run eject`.
- Vendored code: none.
