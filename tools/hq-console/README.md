# hq-console

A local operator console for this repository: one page that shows what the
repository actually is right now — governance gates and open items, routes
against built output, the site's design tokens with computed contrast, recorded
gate results, and git activity.

**Stack:** zero-dependency Node (`node:http`) JSON API + static vanilla
HTML/CSS/JS frontend. No packages were added.

## Run

```bash
node tools/hq-console/server.mjs
```

Then open <http://127.0.0.1:4400>. Optional: run `npm run preview` in another
terminal so route names link into the live site preview.

## What it reads (all live, nothing mocked)

| Endpoint          | Source                                             |
| ----------------- | -------------------------------------------------- |
| `/api/summary`    | `package.json`, `PROJECT_STATE.md`, git, `dist/`   |
| `/api/governance` | `PROJECT_STATE.md` §2 gates, §3 open items         |
| `/api/quality`    | `PROJECT_STATE.md` §6 gate results, §5 facts       |
| `/api/routes`     | `src/pages/`, `dist/*.html` titles and robots meta |
| `/api/tokens`     | `src/styles/tokens.css`, light and dark            |
| `/api/commits`    | `git log`                                          |

## Boundaries

- Binds to `127.0.0.1` only; makes no external request.
- Read-only: it never writes to the repository or anywhere else.
- This is operator tooling, not part of the product surface. It is not built,
  deployed, linked from the site, or covered by the site's copy gates.
- The site's page-scope prohibitions (no fetch, no storage) do not apply here;
  see the scoped override in `eslint.config.js`.
