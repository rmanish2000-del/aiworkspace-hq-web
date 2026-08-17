/**
 * razorpay.ts — the pure, testable half of the payment path (RAZORPAY-INTEGRATION,
 * 2026-08-14). No credential is read here and nothing in this module talks to the
 * network: the serverless handlers under `api/` supply the secret and the I/O.
 *
 * This split exists so the security-critical logic — amount validation and
 * signature verification — can be unit-tested without keys, a browser, or a
 * network round trip.
 *
 * ⚠ This module must never be imported by an `.astro` page. The site is
 * `output: 'static'`; a page import would bundle payment logic into a client
 * artefact. `tests/unit/razorpay.test.ts` asserts that no built document
 * mentions the secret's variable name.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

/** Razorpay's own floor: ₹1.00, expressed in paise. */
export const MIN_AMOUNT_PAISE = 100;

export interface OrderRequest {
  /** Integer paise. Never taken from the browser without passing this check. */
  amount: number;
  currency: string;
  receipt: string;
}

/**
 * Validates an order request SERVER-SIDE. The browser is not trusted with the
 * amount: a client that posts `amount: 1` must be refused here, not charged.
 */
export function validateOrderRequest(input: unknown):
  | { ok: true; value: OrderRequest }
  | {
      ok: false;
      error: string;
    } {
  if (typeof input !== 'object' || input === null)
    return { ok: false, error: 'body must be an object' };
  const { amount, currency, receipt } = input as Record<string, unknown>;

  if (typeof amount !== 'number' || !Number.isInteger(amount)) {
    return { ok: false, error: 'amount must be an integer number of paise' };
  }
  if (amount < MIN_AMOUNT_PAISE) {
    return { ok: false, error: `amount must be at least ${MIN_AMOUNT_PAISE} paise` };
  }
  if (typeof currency !== 'string' || !/^[A-Z]{3}$/.test(currency)) {
    return { ok: false, error: 'currency must be a three-letter ISO code' };
  }
  if (typeof receipt !== 'string' || receipt.length === 0 || receipt.length > 40) {
    return { ok: false, error: 'receipt must be a non-empty string of at most 40 characters' };
  }
  return { ok: true, value: { amount, currency, receipt } };
}

/**
 * The signature Razorpay computes over `order_id|payment_id`. Exported so a
 * test can produce a known-good value without calling Razorpay.
 */
export function expectedSignature(orderId: string, paymentId: string, secret: string): string {
  return createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
}

/**
 * Verifies a payment signature in CONSTANT TIME.
 *
 * `===` on a hex digest leaks, through timing, how many leading characters an
 * attacker guessed correctly. `timingSafeEqual` costs nothing and removes the
 * oracle — this is the security-critical line of the whole integration.
 *
 * Returns false (never throws) on any malformed input: a missing field is an
 * unverified payment, not an exception to be caught somewhere else.
 */
export function verifyPaymentSignature(
  fields: {
    razorpay_order_id?: unknown;
    razorpay_payment_id?: unknown;
    razorpay_signature?: unknown;
  },
  secret: string,
): boolean {
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = fields;
  if (
    typeof orderId !== 'string' ||
    typeof paymentId !== 'string' ||
    typeof signature !== 'string'
  ) {
    return false;
  }
  if (!orderId || !paymentId || !signature || !secret) return false;

  const expected = Buffer.from(expectedSignature(orderId, paymentId, secret), 'utf8');
  const actual = Buffer.from(signature, 'utf8');
  // Lengths must match before timingSafeEqual, which throws on a mismatch. A
  // wrong-length signature is simply not valid.
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

/**
 * IDEMPOTENCY KEY — `razorpay_payment_id`.
 *
 * Razorpay issues exactly one payment id per successful payment, and it is
 * stable across retries and webhook replays, so it is the natural key for "has
 * this payment already been honoured?". A replayed verification with the same
 * payment id must grant nothing a second time.
 *
 * NOTE, stated rather than invented: this repository has NO datastore. Until
 * one exists, this function can only report the key a caller must record — it
 * cannot itself remember anything. Nothing in this slice grants an entitlement,
 * so there is nothing yet to double-grant.
 */
export function idempotencyKey(fields: { razorpay_payment_id?: unknown }): string | null {
  return typeof fields.razorpay_payment_id === 'string' && fields.razorpay_payment_id
    ? fields.razorpay_payment_id
    : null;
}
