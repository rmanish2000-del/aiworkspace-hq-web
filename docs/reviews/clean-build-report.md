# Clean-environment reproducibility report — P1-M §5

**Result: PASS.** The repository builds and verifies from nothing but what is
committed. `npm ci` from the lockfile, then all 27 release gates, then a clean
working tree.

**Run:** `bash scripts/clean-verify.sh` — the whole procedure is a committed
script, so this is repeatable rather than a one-off transcript.

---

## Environment

|                          |                                                  |
| ------------------------ | ------------------------------------------------ |
| OS                       | Windows 11 Home Single Language, 10.0.26220, x64 |
| CPU / RAM                | 4 cores / 8.2 GB                                 |
| Node                     | v22.14.0                                         |
| npm                      | 10.9.2                                           |
| Branch                   | `feature/p1-m`                                   |
| Production dependencies  | **0**                                            |
| Development dependencies | 15                                               |

The `.nvmrc` pins 22.23.1 and `engines` requires `>=22.22.3 <23`; the run used
22.14.0, which is **below** the pinned floor. It succeeded, but that mismatch is
recorded rather than glossed — see "Discrepancy" below.

## What was deleted before the run

```
node_modules  dist  .astro  test-results  playwright-report  .lighthouseci
```

Confirmed absent before reinstalling (`node_modules present: no`).

**Not deleted:** the Playwright browser cache in
`%LOCALAPPDATA%\ms-playwright`. That is machine state, not repository state, and
`npx playwright install` is a documented setup step rather than part of the
build. Deleting it would have measured the download, not the reproducibility.

## Steps and results

| #   | Step                                                            | Result                 |
| --- | --------------------------------------------------------------- | ---------------------- |
| 1   | Delete artefacts and dependencies                               | done                   |
| 2   | `npm ci` from the committed lockfile                            | **exit 0, 62s**        |
| 3   | `npm run assets` — regenerate icons and social card from source | done                   |
| 4   | `npm run verify:release` — all 27 gates                         | **exit 0**             |
| 5   | `git status --porcelain`                                        | **empty — clean tree** |

`npm ci` deletes `node_modules` itself and fails outright if the lockfile
disagrees with `package.json`, so a successful `npm ci` is the real proof that
the lockfile is complete and in step.

Step 5 is the one that catches a whole class of problem: a build that quietly
rewrites a committed file, or a generator whose output is not byte-stable.
Regenerating every icon and the social card in step 3 and still finding a clean
tree in step 5 means `npm run assets` is deterministic.

## Gate results

All gates passed, 0 failed, 0 skipped, in **689.4s (11.5 min)**. The run reported 26; a 27th — the Node-version gate below — was added afterwards as a
direct result of what this run surfaced.

| Gate                               | Time            |
| ---------------------------------- | --------------- |
| format                             | 7.7s            |
| lint                               | 34.5s           |
| types                              | 18.8s           |
| unit tests                         | 20.8s           |
| build                              | 7.3s            |
| html validity                      | 3.1s            |
| 14 built-output invariants         | <100ms combined |
| every browser engine launches      | 2.4s            |
| browser matrix (chromium, webkit)  | 403.7s          |
| lighthouse (local baseline)        | 183.7s          |
| dependency audit                   | 7.4s            |
| lockfile in step with package.json | 16ms            |
| `.env.example` carries no values   | 1ms             |

**Test totals:** 88 unit tests across 4 files; **922 browser tests passed, 52
skipped, 0 failed** in 6.7 minutes.

The 52 skips are the WebKit tab-order and `forced-colors` assertions, each
carrying its reason in the skip message and each with replacement coverage —
`known-limitations.md` L-12.

## Firefox

Gate 21 reported, by name:

```
⚠ NOT ALL ENGINES RAN. firefox: browserType.launch: spawn UNKNOWN
  Recorded in docs/reviews/known-limitations.md. CI covers all three.
```

The gate names the engine and the reason rather than dropping it silently, and
**in CI a missing engine is a hard failure**. Full diagnosis in
`known-limitations.md` L-11.

## Discrepancy worth recording

**The run used Node v22.14.0, below the `>=22.22.3` floor in `engines`.**

This is **E-7 in `HANDOFF.md`**, raised at P1-G and marked resolved once CI
demonstrated the pinned 22.23.1 works. It is not a new finding. What is new is
that the local machine is still below the floor, so the clean-run evidence above
was produced one patch series under the pinned runtime.

Everything passed, so nothing is broken — but the pin exists because two
build-time dependencies declare that floor, and a machine below it is not the
environment the lockfile was resolved for. `npm ci` warns rather than refuses,
which is exactly why it went unremarked in the P1-L runs.

**What P1-M changed:** `verify:release` now checks this explicitly as its first
gate — a warning locally, a **hard failure in CI**, where the runtime comes from
`.nvmrc` and there is no excuse. The pin was not loosened to make the warning go
away; that would have been the wrong direction.

```
⚠ Node 22.14.0 is below the >=22.22.3 <23 floor; .nvmrc pins 22.23.1
  Everything may still pass, but this is not the pinned runtime.
```

## Speed observation

The same verification took **57 minutes** before this run and **11.5 minutes**
during it. The only difference was that `node_modules` and the artefact
directories had just been cleared, freeing memory on a machine that had under a
gigabyte spare.

That is worth knowing: the browser matrix on this hardware is memory-bound, not
CPU-bound, and a slow run is a signal that the machine needs clearing rather
than that anything regressed. It is also why the suite's timeouts were
recalibrated — see `release-candidate-report.md` H-11 and H-12.

## What this proves, and what it does not

**Proves:**

- The repository is self-contained. No local state, no leftover build output and
  no hand-installed package is required.
- The lockfile is complete and in step with `package.json`.
- Asset generation is deterministic — regenerating everything leaves no diff.
- The build emits no file that is not already committed or already ignored.

**Does not prove:**

- **Reproducibility on another operating system.** One machine, one OS. CI runs
  the same pipeline on `ubuntu-latest`, which covers the Linux path — including
  Firefox, which cannot run here.
- **Byte-identical builds across machines.** Output was compared for cleanliness
  against the committed tree, not hashed against another machine's build.
- **A cold Playwright install.** The browser cache was reused deliberately.
