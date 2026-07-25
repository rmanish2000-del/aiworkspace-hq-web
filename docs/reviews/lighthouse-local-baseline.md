# Lighthouse — LOCAL BASELINE

> ## ⚠️ THIS IS NOT PRODUCTION EVIDENCE
>
> These figures were measured against a **local static preview on `localhost`**.
> They are a **local baseline**: a regression tripwire and a smoke signal.
>
> They do **not** discharge the performance budgets in P0 `08` §8, and they are
> **not** Gate B evidence under P0 `12`. Nothing here may be cited as proof that
> a budget is met.

**Classification:** Local Baseline · indicative only
**Measured:** 2026-07-25T19:18:46Z
**Implementation version:** `0.2.0` · commit `022fb17`
**Assignment:** P1-H
**Routes measured:** `/` only (`index.html`)

---

## 1. Why this cannot be production evidence

P0 `08` §8 defines the budgets against a specific measurement environment. Four
things differ here, and each one flatters the result:

| `08` §8 requires            | This run used                    | Effect on the numbers                          |
| --------------------------- | -------------------------------- | ---------------------------------------------- |
| The deployed production URL | `http://localhost` static server | No DNS, no TLS handshake, no CDN, no real TTFB |
| Mobile emulation            | Desktop, 1350×940, DPR 1         | Larger viewport, fewer layout constraints      |
| 4× CPU throttling           | `cpuSlowdownMultiplier: 1`       | No CPU penalty at all                          |
| Slow 4G                     | 40 ms RTT, 10,240 kbps simulated | Roughly two orders of magnitude faster         |

A server-response time of ~4.7 ms is a property of reading a file from disk. It
says nothing about a host that does not exist yet.

**Re-measure after AG-3**, on the production URL, under the `08` §8 environment.
Only that run can close the budget.

## 2. Category scores

| Category       | Score   | `08` §8 budget | `08` §8 target |
| -------------- | ------- | -------------- | -------------- |
| Performance    | **100** | ≥95            | 100            |
| Accessibility  | **100** | 100            | 100            |
| Best Practices | **100** | ≥95            | 100            |
| SEO            | **100** | 100            | 100            |

## 3. Metrics

| Metric                   | Measured    | `08` §8 budget | `08` §8 target |
| ------------------------ | ----------- | -------------- | -------------- |
| First Contentful Paint   | 226 ms      | —              | —              |
| Largest Contentful Paint | 226 ms      | ≤1.8 s         | ≤1.2 s         |
| Speed Index              | 231 ms      | —              | —              |
| Time to Interactive      | 226 ms      | —              | —              |
| Total Blocking Time      | 0 ms        | —              | —              |
| Cumulative Layout Shift  | **0**       | ≤0.05          | 0              |
| Server response time     | 4.7 ms      | ≤600 ms        | ≤300 ms        |
| Total transferred        | 9,149 B     | ≤60 KB         | ≤35 KB         |
| Requests on first load   | 3           | ≤6             | ≤4             |
| Client JavaScript        | **0 B**     | ≤10 KB         | ≤5 KB          |
| Web fonts                | **0**       | 0              | 0              |
| Third-party requests     | **0**       | 0              | 0              |
| DOM size                 | 63 elements | —              | —              |

Interaction to Next Paint is absent: it is a field metric and needs real
interaction traffic, which does not exist.

### Requests on first load

| Resource           | Type     | Transferred |
| ------------------ | -------- | ----------- |
| `index.html`       | Document | 6,966 B     |
| `site.webmanifest` | Manifest | 1,126 B     |
| `favicon.svg`      | Other    | 1,057 B     |

CSS is inlined into the document (`08` §8 — no render-blocking stylesheet).
There is no JavaScript, no font, and no image.

## 4. Audits scoring below 1.0

| Audit              | Score | Note                                                                                                                                                                              |
| ------------------ | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom-size-insight` | 0     | A diagnostic insight, not a scoring audit — Performance is still 100. The document is 63 elements, which is small. Recorded because "no failing audits" would be the wrong claim. |

Everything else scored 1.0.

## 5. Environment

| Field            | Value                                                |
| ---------------- | ---------------------------------------------------- |
| Lighthouse       | 12.6.1                                               |
| Browser          | HeadlessChrome 150.0.0.0                             |
| Host OS          | Windows 11                                           |
| Node             | 22.14.0 (local; CI pins 22.23.1)                     |
| Form factor      | desktop                                              |
| Throttling       | `simulate`, 40 ms RTT, 10,240 kbps, CPU ×1           |
| Screen emulation | 1350×940, DPR 1                                      |
| Runs             | 3, median reported                                   |
| Config           | [`../../lighthouserc.json`](../../lighthouserc.json) |

## 6. Reproducing this

```bash
npm ci
npm run build
npx astro preview --host 127.0.0.1 --port 4321   # optional; LHCI serves dist/ itself
npm run test:lighthouse
```

Raw reports are written to `.lighthouseci/` (git-ignored — they are large, and
regenerating them is cheap). CI uploads the same directory as a build artifact
on every run, so any historical run remains retrievable from its workflow run.

## 7. What still has to happen

1. Re-measure on the production URL under the `08` §8 environment, after AG-3.
2. Until then, no Lighthouse figure from this repository may be quoted as
   evidence that a budget is met.
3. The manual accessibility obligations are **not** discharged by the
   Accessibility score of 100 — see
   [`manual-accessibility-checks.md`](manual-accessibility-checks.md). axe-core
   and Lighthouse between them cover roughly a third of accessibility defects.
