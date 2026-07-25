# aiworkspace-hq-web

The public product surface. Private repository.

**This build is not deployed and is not deployable.** It runs on `localhost`
only. Deployment requires gate AG-3, which has not been granted. See
[`PROJECT_STATE.md`](PROJECT_STATE.md) for exactly what exists.

---

## Requirements

| Tool    | Version                            | Why pinned                                                                    |
| ------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| Node.js | `22.23.1` (see [`.nvmrc`](.nvmrc)) | ARCH-05 — reproducible build. Two build-time dependencies require `^22.22.3`. |
| npm     | `>=10.9.0`                         | Ships with the pinned Node                                                    |

```bash
nvm use
```

On Windows, `nvm-windows` does not read `.nvmrc`; run `nvm use 22.23.1`.

## Setup

```bash
npm ci
```

Use `npm ci`, not `npm install`. It installs exactly the committed lockfile,
which is what makes the build reproducible.

To run the browser-based checks once:

```bash
npx playwright install --with-deps chromium
```

## Environment variables

Copy the template and leave every value empty:

```bash
cp .env.example .env
```

**No secret exists in this phase, and none is needed.** Every secret-bearing
variable in `.env.example` belongs to a component that is out of scope. The
build reads exactly two variables, both non-secret:

| Variable          | Default when unset          | Effect                                                                                                                          |
| ----------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL` | `https://aiworkspacehq.com` | Origin used to build `<link rel="canonical">` and `og:url`. No request is ever made to it.                                      |
| `ENVIRONMENT`     | _(unset)_                   | Only the literal value `production` makes any route indexable. Anything else, including unset, forces `noindex` on every route. |

`.env` and `.env.local` are git-ignored. If a piece of work turns out to need a
secret, that work is out of scope — stop and escalate rather than provisioning
one.

## Run locally

```bash
npm run dev        # dev server on http://127.0.0.1:4321
npm run build      # static output to dist/
npm run preview    # serve dist/ on http://127.0.0.1:4321
```

Both servers bind to the loopback interface. The site must not be reachable from
another machine.

## Test

```bash
npm test           # everything below, in order
```

Individually:

| Command                   | Gate                                                 |
| ------------------------- | ---------------------------------------------------- |
| `npm run check:types`     | `tsc --noEmit`, 0 errors                             |
| `npm run lint`            | ESLint, 0 errors                                     |
| `npm run format:check`    | Prettier, clean                                      |
| `npm run test:unit`       | Vitest — includes the prohibited-term gate           |
| `npm run build`           | Build exits 0                                        |
| `npm run test:html`       | `html-validate` on `dist/`, 0 errors                 |
| `npm run test:e2e`        | Playwright — axe-core, structure, metadata, boundary |
| `npm run test:lighthouse` | Lighthouse CI — **indicative only**, see below       |
| `npm run audit:deps`      | `npm audit --audit-level=high`, 0 high/critical      |

### The unit tests are the important ones

`tests/unit/copy.test.ts` is the mechanical enforcement of the approved claims
policy. It fails if a prohibited term or claim phrasing enters any visible
string, if a build-time placeholder appears where it should not, or if the
quarantined provisional strings grow. Treat a failure there as a content
governance event, not as a test to be adjusted.

### Lighthouse results here are not evidence

The performance budgets are defined against the **deployed production URL**
under mobile emulation, 4× CPU throttling and Slow 4G. None of that exists
locally. A local pass is a smoke signal. Real measurement happens after AG-3.

## External requests

The build and the page make none.

- Zero web fonts, zero third-party origins, zero analytics, zero cookies —
  each asserted by an end-to-end test.
- Astro's anonymous build telemetry is disabled via `ASTRO_TELEMETRY_DISABLED=1`
  in CI. Locally, run `npx astro telemetry disable` once.
- The `lychee` link check runs `--offline`: internal links only, no outbound
  resolution.

## Deployment

**There is no deployment procedure, because there is no deployment.**

No hosting account exists, no vendor is connected, no DNS record has been
touched, and no production configuration is present in this repository. The
deployment checklist is a separate document and executes only under a separate
authorization (AG-3) that has not been granted.

## Rollback

Not applicable. Nothing is deployed, so there is nothing to roll back.

The repository is the source of truth; `git revert` is the only reversal
mechanism that currently exists.

## Deletion-request procedure

**Not applicable.** No personal data is collected, stored, or processable by
anything in this repository:

- there is no form;
- there is no submission endpoint;
- there is no database, key-value store, cookie, or client-side storage;
- no real email address appears anywhere, in source or in test data.

A deletion request cannot be fulfilled here because there is nothing to delete.
This section becomes real when the form and the submission store are built, and
it must be written before that work ships, not after.

## Repository layout

```
.github/workflows/   CI, CodeQL
.github/             Dependabot
docs/spec/           Pointers to the governing specifications (not copies)
docs/governance/     Pointers to the governance chain (not copies)
docs/decisions/      Decision records for choices made inside this repository
docs/reviews/        Review and manual-check records
public/              Static assets served at the output root (currently empty)
src/content/copy.ts  Every visible string. Single source.
src/layouts/         Base layout: head, landmarks, skip link
src/components/      Header, hero, principles, footer
src/pages/           Routes: / and /404
src/styles/          Design tokens and the whole stylesheet
tests/unit/          Vitest — the copy and scope gates
tests/e2e/           Playwright — a11y, structure, metadata, boundary
```

## Contributing

One working branch per assignment, cut from `main`, using the Conventional
Commits prefixes `feat/` `fix/` `chore/` `ci/` `test/` `refactor/` `docs/`.
`main` is protected: no direct push, no force push, linear history, required
checks green.

Never commit a secret, a real email address, or personal data of any kind.

---

Operational documentation only. Governance and specifications are cited by
document ID, never copied into this repository — see [`docs/`](docs/).
