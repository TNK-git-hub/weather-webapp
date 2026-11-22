# Implementation Log: Light and dark mode

Deviation from tdd-loop: task checkboxes and TC statuses are tracked here and in STATUS.md, not in `03-plan.md` / `04-test-cases.md`, because the Gate 2 sha256 covers those files byte-for-byte and editing them would drift the approved hash.

| Task | Result | TCs | Evidence |
|---|---|---|---|
| T-01 | done (subagent, 1 attempt; RED: module missing) | TC-01..TC-06 green | `npm test -- src/utils/theme.test.js` exit 0, 6 passed |
| T-02 | done (subagent, 1 attempt; RED: useTheme not exported) | TC-06b, TC-07..TC-09 green | `npm test -- src/utils/theme.test.js` exit 0, 10 passed |
| T-03 | done (subagent, 1 attempt; RED: module missing). Sun rays use stroke=currentColor | TC-10..TC-12 green | `npm test -- src/components/theme-toggle/theme-toggle.test.js` exit 0, 3 passed |
| T-04 | done (subagent, 1 attempt; RED: TC-13/TC-14 no toggle, TC-16 already green). Stale CRA test replaced by TC-16 (Gate 2 D5). App.js CRLF preserved | TC-13, TC-14, TC-16 green | `npm test -- src/App.test.js` exit 0, 3 passed |
| T-05 | done (subagent, 1 attempt; RED: script missing). Extra guard test for the dark background rule | TC-17..TC-19 green | `npm test -- src/utils/theme.test.js` exit 0, 16 passed |
| T-06 | done (inline; CSS/check lane). Dark tokens in `src/index.css`; dark block in `App.css`; `search.js` colours wrapped as `var(--search-*, <old literal>)`. Deviation: `theme-toggle.css` (T-03 file) also gained a light glass background + `#1a2a3a` icon, because `#1a8fc4` on the bright photo was ~1.7:1 (fails NFR-01 toggle >= 3:1 in light). Hover tint lowered to 0.10 so glyphs keep >= 3:1 | CK-01 (landing), CK-02, CK-03 (menu) pass | contrast script 0 failing pairs; browser check |
| T-07 | done (inline). Dark blocks in `current-weather.css`, `hourly.css`, `forecast.css`. `.status-text` switches to `#c8e2ef` in dark (12px text on photo: 4.12 -> 5.18:1) | CK-01 (results), CK-02, CK-03 (accordion) pass | browser check, CSS diff additions only |
| T-08 | done | all | suite 22 passed exit 0; lint exit 0; build exit 0 |

## CK-01 contrast ratios (worst case: dark overlay 0.65 over a pure-white or pure-black photo pixel)

| Pair | Ratio | Need |
|---|---|---|
| `--text-strong` #e8f1f8 on card `--surface` | 12.99 | 4.5 |
| `--text-muted` #a9bfce on card | 7.80 | 4.5 |
| `--text-muted` on expanded accordion panel | 6.51 | 4.5 |
| `--text-muted` on hover tint | 6.17 | 4.5 |
| glyph #1a8fc4 on card / panel / hover | 4.08 / 3.40 / 3.23 | 3 |
| chart #ffb300 on card | 8.27 | 3 |
| toggle icon dark #8cd6f8 on surface | 9.26 | 3 |
| toggle icon light #1a2a3a on light glass | 5.99 | 3 |
| `.status-text` #c8e2ef on dark photo | 5.18 | 4.5 |
| city name #c0cfdf (56px) on dark photo | 4.40 | 3 |

## Browser check notes (2026-11-22, Chrome, localhost:3000)

- OS dark + nothing saved -> page dark on load (AC-01). Toggle -> light, toggle -> dark; aria-label/aria-pressed correct.
- GeoDB returned 429 (free-tier rate limit) for a real search. This is pre-existing and unrelated, so the results screen was checked with `fetch` stubbed in the tab only (fake city/weather/forecast). No code changed.
- Saved dark + reload: served HTML contains `#theme-init` before the app bundle; body background uses the 0.65 overlay; `color-scheme: dark` (AC-06, BR-04, NFR-03).
- The test key `atmoslens-theme` was removed from the browser afterwards.
| Review R1 fixes | inline: R-01..R-07 (Minor/Info) fixed; new edge test for rapid toggling | spec section 10 edge | suite 23 passed exit 0; lint exit 0; build exit 0 |
