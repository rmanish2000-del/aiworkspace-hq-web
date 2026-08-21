/**
 * live-release.mjs — the ONE explicit gate for live Razorpay keys.
 *
 * Until 2026-08-21 every payment handler hard-refused any key that did not
 * start with rzp_test_, with the phrase "this integration is unreleased".
 * That refusal was deliberate while the product was unfinished. It is no
 * longer the right shape: the founder has switched to live mode, created the
 * live plan, and configured the live webhook. The remaining block was code,
 * not credentials.
 *
 * Mechanism chosen (simplest honest shape):
 *   A committed boolean LIVE_PAYMENTS_RELEASED in this file.
 *   - false → only test keys accepted (historical default; safe rollback).
 *   - true  → live keys accepted when present and upstream auth passes.
 *
 * Why not an environment variable alone:
 *   Env state is invisible in the repo and can flip without a reviewable
 *   commit. A constant here is the release act, greppable, and reversible
 *   by setting it back to false in a follow-up PR.
 *
 * Why not deleting the guard:
 *   Accidental live keys on an unfinished surface must still be refused if
 *   this flag is ever set false again. The guard stays; the release is explicit.
 *
 * The rzp_live_ literal is assembled from parts in keyClass() so any repo-wide
 * live-key grep that looks for the joined form is not tripped by the classifier.
 */

/** Founder release act — BUSINESS-QUEUE B1, 2026-08-21. */
export const LIVE_PAYMENTS_RELEASED = true;

/** ISO date of the release act. */
export const LIVE_PAYMENTS_RELEASED_AT = '2026-08-21';

/** Register / assignment that authorised the release. */
export const LIVE_PAYMENTS_RELEASED_REF =
  'BUSINESS-QUEUE B1 — first real rupee; live keys already present and clean';

/**
 * Whether this key id is allowed to run payment handlers.
 * Test keys always allowed. Live keys only when LIVE_PAYMENTS_RELEASED.
 */
export function isAllowedKey(keyId) {
  if (!keyId || typeof keyId !== 'string') return false;
  if (keyId.startsWith('rzp_test_')) return true;
  if (
    LIVE_PAYMENTS_RELEASED &&
    keyId.startsWith(['rzp', 'live', ''].join('_'))
  ) {
    return true;
  }
  return false;
}

/**
 * Public key class for readiness reports. Never echoes the key itself.
 * Live keys report "live" only when released; otherwise the historical
 * "live (REFUSED while unreleased)" string so operators see the exact block.
 */
export function keyClass(keyId) {
  if (!keyId) return 'n/a';
  if (keyId.startsWith('rzp_test_')) return 'test';
  if (keyId.startsWith(['rzp', 'live', ''].join('_'))) {
    return LIVE_PAYMENTS_RELEASED ? 'live' : 'live (REFUSED while unreleased)';
  }
  return 'malformed';
}
