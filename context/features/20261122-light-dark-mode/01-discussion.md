# Discussion Log: Light and dark mode

- Feature ID: 20261122-light-dark-mode
- Participants: user (TNK-git-hub), AI agent
- Started: 2026-11-22

## Original request

> make light and dark mode for the page

## Restatement (confirmed)

Visitors to AtmosLens can switch the whole page between a light theme (today's look: bright background photo, white glass cards, dark text) and a dark theme (dark surfaces, light text). The theme covers the landing and results screens, including the search dropdown, 5-day accordion and hourly chart, so the app is comfortable to use at night or in a dark room.

## Q&A

| # | Question | Answer | Impact on spec |
|---|---|---|---|
| 1 | How does the user pick a theme? (toggle with OS default / Light-Dark-System / OS only) | Two-state toggle; first visit follows OS `prefers-color-scheme` | US-01, US-02; AC-01..AC-04 |
| 2 | Remember the choice across visits? | Yes, in browser storage (localStorage); fall back to OS default if storage is blocked | US-03; AC-05..AC-07 |
| 3 | Where is the toggle? | Navbar, next to the logo, on both landing and results screens | AC-08; UI table |
| 4 | Dark-mode page background? | Same `bg02.jpg` photo with a stronger dark overlay; no new assets | BR-04; AC-10 |
| 5 | (clarify) Follow OS changes live before an explicit choice? | Yes; after an explicit choice the saved value wins | AC-03, AC-06, BR-03 |
| 6 | (clarify) Prevent the light flash on reload? | Yes; apply the theme before first paint (inline script in `public/index.html`) | AC-01, AC-06, NFR-03 |
| 7 | (clarify) Accessibility bar for dark mode? | WCAG 2.1 AA: text 4.5:1 (large 3:1), icons/toggle 3:1 | NFR-01, NFR-02 |

## Decisions

| # | Decision | Options considered | Rationale |
|---|---|---|---|
| D1 | Two-state toggle, OS preference as initial default | 3-way Light/Dark/System; OS only | Smallest UI that still respects OS preference (user choice) |
| D2 | Persist explicit choice in localStorage | No persistence | User choice; storage failures must not break the page |
| D3 | Toggle in the navbar on both screens | Results screen only | Theme is page-wide, so the control is available everywhere (user choice) |
| D4 | Reuse `bg02.jpg` with a darker overlay | Solid gradient; new photo | No new assets; keeps the brand look (user choice) |
| D5 | Replace the stale CRA test in `src/App.test.js` with TC-16 (landing heading renders) | Keep the failing test; delete it | The old assertion checks text the app never renders; the replacement asserts real behavior. Approved at Gate 2 |

## Out of scope (explicitly agreed)

- A third "System" option in the UI.
- New background photos or new icon sets.
- Theming the PWA `manifest.json` or the OS-level browser chrome.

## Risks and assumptions

- Assumption: no theme preference is sent to any server; it stays in the browser.
- Risk: the UI glyph SVGs in `public/icons/g_cons/` are dark-coloured and may disappear on dark cards. The spec requires them to stay visible.
- Risk: colours are hardcoded hex literals across 5 CSS files and in JS (`search.js` react-select styles, `hourly.js` SVG chart), so every surface must be checked.
- Risk: CRA renders after JS loads, so a dark-mode user may briefly see the light theme on reload (see clarification Q5).
