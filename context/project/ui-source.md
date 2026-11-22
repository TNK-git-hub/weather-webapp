# UI source

Visual source of truth for this project. Confirmed at `/onboard`. Features with no UI skip this file.

| Field | Value |
|---|---|
| mode | `codebase` |
| Confirmed | 2026-11-22 by the user at `/onboard` (no Figma Dev Mode MCP connected) |

## figma

Not used (mode is `codebase`).

## codebase

| Role | Path | Notes |
|---|---|---|
| Components | `src/components/` | `search/`, `current-weather/`, `forecast/` (`forecast.js`, `hourly.js`) |
| Tokens | `src/index.css` `:root[data-theme='dark']` block (dark theme only) | Light theme still uses the literals below; dark overrides use the tokens (`--surface`, `--text-strong`, `--text-muted`, `--accent`, ...) |
| App shell | `src/App.js`, `src/App.css`, `public/index.html`, `src/index.css` | Navbar, landing/results switch, global font and background |
| Reference screen | `src/App.js` (landing) + `src/App.css` | Brand heading "AtmosLens", centred search |
| Reference screen | `src/App.js` (results, detail cards) + `src/App.css` | Glass card grid: feels-like, wind, humidity, pressure |
| Reference screen | `src/components/current-weather/current-weather.js` + `.css` | Hero card, icon, temperature, °C/°F toggle |
| Reference screen | `src/components/forecast/forecast.js` + `forecast.css` | Accordion list pattern |
| Reference screen | `src/components/forecast/hourly.js` + `hourly.css`; `src/components/search/search.js` | SVG chart with horizontal scroll; react-select styling in JS |

### De-facto visual tokens (from code)

- Font: Inter (Google Fonts, `public/index.html`), set in `src/index.css`.
- Primary / accent: `#1a8fc4`. Chart accent: `#ffb300`.
- Text: `#1a2a3a`, `#1a1a2e`. Secondary text: `#3a6a8a`, `#6a8a9a`, `#40535c`, `#5a7a8a`. Light text on photo: `#c8e2ef`.
- Glass card: `background: rgba(255,255,255,0.65)` + `backdrop-filter: blur(12px)` with rounded corners (see `App.css`, `current-weather.css`, `forecast.css`, `hourly.css`).
- Breakpoints: `900px`, `600px`.
- Background: `public/background/bg02.jpg` (inline style in `public/index.html`).
- Icons: `public/icons/<owm-code>.png` for conditions, `public/icons/g_cons/*.svg` for UI glyphs.

## Rules

- `none`: this project has no UI. Do not invent screens.
- `figma`: the node named in the spec is the layout source. Read it through the connected Figma Dev Mode MCP during BUILD. Generated code from that MCP is a reference, not production code. When Code Connect maps the node to a repo component, use that component. Paths in "repo chrome" supply buttons, inputs, and the shell.
- `codebase`: reuse layout, components, and tokens from the reference paths. A new visual pattern is a review finding.
- If the named node or reference file cannot be read, stop and ask. Do not design the screen from memory.
