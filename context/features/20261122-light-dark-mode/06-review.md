# Review: Light and dark mode

| Field | Value |
|---|---|
| Feature ID | 20261122-light-dark-mode |
| Diff base | `cf711721e4528a984990e401790ee3bd565b42eb` |
| Result | PASS |

## Round 1 (2026-11-22)

- Reviewers: `code-reviewer` and `security-reviewer` subagents with fresh context.
- Both were read-only (Read/Grep/Glob) and received a scoped bundle: the diff, the new files, the spec, the test cases and the project rules. Isolation: full.
- Out-of-scope dirty files were not reviewed: `testing.md`, `6da1d4be-testing_Truong_harness.drawio`. Both are untracked and were not created by this feature.

### Automated checks

| Check | Command | Result |
|---|---|---|
| Tests | `npm test -- --watchAll=false` | 22 passed, 0 failed (BUILD evidence); 23 passed after Minor fixes |
| Lint | `npx eslint src` | clean |
| Typecheck | n/a (plain JS) | n/a |
| Build | `npm run build` | compiled |
| Security scan | semgrep / gitleaks / npm audit | not installed: no scanner hits |

### Findings

| ID | Severity | Dimension | Location | Problem | Fix | Status |
|---|---|---|---|---|---|---|
| R-01 | Minor | Structure | `src/utils/theme.js` | `structure.md` described `src/utils/` as pure helpers only; `useTheme` is a hook | Amended the `structure.md` row to "Shared helper or custom hook" | fixed |
| R-02 | Minor | Conventions / tests | `src/App.test.js:5-12` | `Search` is mocked in App tests, but the convention said "mock only at the network boundary" (approved in TC-14, not documented) | Documented the exception in `conventions.md` | fixed |
| R-03 | Minor | Test quality | spec section 10 | No test for the edge case "rapid toggling ends on the last click" | Added a hook test (3 toggles: theme, storage and `data-theme` all `dark`) in `src/utils/theme.test.js` | fixed |
| R-04 | Minor | Test quality | `src/utils/theme.test.js:147` | `process.cwd()` makes TC-17..TC-19 depend on Jest's cwd | Switched to `path.resolve(__dirname, '../../public/index.html')` | fixed |
| R-05 | Minor | Conventions | `src/utils/theme.js:29,37` | Media query string duplicated | One `DARK_QUERY` const above `getSystemTheme`, used in both places | fixed |
| R-06 | Minor | Necessary code | `src/index.css`, `theme-toggle.css:34` | `--search-*` tokens duplicated base token values; hover hard-coded | Search tokens aliased to base tokens; added `--surface-strong`, used by the menu and the toggle hover. Resolved values are unchanged | fixed |
| R-07 | Info | UI source | `context/project/ui-source.md` | Tokens row said "none" | Points at the dark token block in `src/index.css` | fixed |
| R-08 | Info | Accessibility | `theme-toggle.js:11-12` | The toggle changes its label and also uses `aria-pressed` (APG discourages combining them). This is what AC-04/05 and NFR-02 require | Needs a spec change; see follow-ups | follow-up |
| R-09 | Info | Stack | `theme.js:43-45` | `data-theme` is written in `useEffect`; on an OS-driven change there may be one frame of mismatch | Optional `useLayoutEffect` | follow-up |
| R-10 | Info | Necessary code | `theme.js:5,40-41` | `isValidTheme` export used only internally and in tests; storage read twice on mount | Optional tidy-up | follow-up |

Security review: no findings. Checked:
- The inline `theme-init` script only accepts the allow-listed values `light` / `dark`, and only sets an attribute.
- `theme.js` stores no sensitive data.
- The `search.js` `var()` values are constants.
- There is no `dangerouslySetInnerHTML`.
- No new dependencies or secrets.

Reviewer notes, verified:
- `.navbar-icon-btn` already existed, unused, in `src/App.css` (the reviewer could not see it).
- The glyph, chart and navbar dark rendering was confirmed in the browser check (CK-01, `05-implementation-log.md`).

### Summary

- Critical: 0 | Major: 0 | Minor: 6 (all fixed) | Info: 4 (1 fixed, 3 follow-ups)
- Decision: pass. Minor fixes were verified with the full suite (23 passed), lint (clean) and build (compiled). Round limit not reached (1 of 3).

## Follow-ups (minor, not fixed)

- **R-08:** consider a fixed toggle label ("Dark mode") with `aria-pressed`, per the WAI-ARIA APG. Needs a spec change to AC-04/05.
- **R-09:** consider `useLayoutEffect` for the `data-theme` write, to avoid a possible one-frame mismatch on OS changes.
- **R-10:** un-export `isValidTheme` and read storage once on mount.
- **CSP (security reviewer note):** if a strict CSP is added later, allow the inline `theme-init` script by its sha256 hash.
- **Pre-existing, out of scope:** GeoDB free-tier rate limit (HTTP 429) makes city search fail when typing quickly. It was seen during the browser check.
