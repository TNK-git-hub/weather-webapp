# Commands

All commands run from the repository root. Verified on 2026-11-22 (Node v24.19.0, npm 11.17.0, Windows PowerShell). npm is the canonical package manager.

| Purpose | Command |
|---|---|
| Install deps | `npm ci` (clean, from `package-lock.json`) or `npm install` |
| Run all tests (single run) | `npm test -- --watchAll=false` (set `CI=true` to avoid watch mode; PowerShell: `$env:CI='true'`) |
| Run tests in watch mode | `npm test` |
| Run a single test file | `npm test -- src/components/search/search.test.js --watchAll=false` |
| Run tests matching a name | `npm test -- -t "<test name>" --watchAll=false` |
| Lint | `npx eslint src` (uses `eslintConfig` in `package.json`) |
| Format | none. No formatter installed; follow `conventions.md` |
| Typecheck / compile | none (plain JS). `npm run build` also fails on compile errors |
| Build | `npm run build` (outputs `build/`) [UNVERIFIED: not run during onboarding] |
| Run locally | `npm start` (http://localhost:3000) |
| Security scan (optional) | `npm audit --omit=dev`; `gitleaks detect` if installed [UNVERIFIED: not installed] |

Do not run `npm run eject`.

## Baseline

- Tests: 1 suite, 1 test, **1 failed**, exit 1. Known: `src/App.test.js` "renders learn react link" is the stale CRA default and does not match the AtmosLens UI.
- Lint: `npx eslint src` is clean, exit 0.
- Noise: "Browserslist: caniuse-lite is outdated" warning on stderr; harmless.

## Environment notes

- The repo path contains "Tài liệu" (Unicode). In Git Bash, `cd` to the absolute path can fail; use PowerShell or relative paths from the repo root.
