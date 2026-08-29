/**
 * Razorpay server helpers — the TanStack Start port of the pre-redesign
 * Vercel functions (api/_lib/razorpay.mjs, api/_lib/live-release.mjs and
 * api/_lib/razorpay-note.mjs in the Astro repository).
 *
 * Nothing here is imported by client code. Credentials are read inside the
 * calling handler at request time, never at module scope.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

/** Founder release act — BUSINESS-QUEUE B1, 2026-08-21. */
export const LIVE_PAYMENTS_RELEASED = true;

/** Test keys always allowed; live keys only once the release act is true. */
export function isAllowedKey(keyId: string | undefined): boolean {
  if (!keyId || typeof keyId !== "string") return false;
  if (keyId.startsWith("rzp_test_")) return true;
  if (LIVE_PAYMENTS_RELEASED && keyId.startsWith(["rzp", "live", ""].join("_"))) return true;
  return false;
}

/** Public key class for readiness reports. Never echoes the key itself. */
export function keyClass(keyId: string | undefined): string {
  if (!keyId) return "n/a";
  if (keyId.startsWith("rzp_test_")) return "test";
  if (keyId.startsWith(["rzp", "live", ""].join("_"))) {
    return LIVE_PAYMENTS_RELEASED ? "live" : "live (REFUSED while unreleased)";
  }
  return "malformed";
}

export type Credentials = { keyId: string; keySecret: string };

/** Read and validate credentials inside a handler. Returns null when unusable. */
export function readCredentials(): Credentials | null {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keyId || !keySecret) return null;
  if (!isAllowedKey(keyId)) return null;
  return { keyId, keySecret };
}

export function authHeader({ keyId, keySecret }: Credentials): string {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

export async function razorpay(
  path: string,
  credentials: Credentials,
  options: RequestInit = {},
): Promise<{ ok: boolean; status: number; payload: any }> {
  const upstream = await fetch(`https://api.razorpay.com/v1/${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      authorization: authHeader(credentials),
      ...((options.headers as Record<string, string>) ?? {}),
    },
  });
  let payload: any = null;
  try {
    payload = await upstream.json();
  } catch {
    payload = null;
  }
  return { ok: upstream.ok, status: upstream.status, payload };
}

/** Constant-time HMAC comparison. `===` leaks timing and is wrong here. */
export function signatureMatches(expectedHex: string, actual: string): boolean {
  const expected = Buffer.from(expectedHex, "utf8");
  const given = Buffer.from(actual, "utf8");
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

export function hmacHex(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

const PAYMENT_ID = /^pay_[A-Za-z0-9]+$/;
const MAX_NOTES = 15;

export async function readPaymentNotes(
  paymentId: string,
): Promise<{ ok: true; notes: Record<string, string> } | { ok: false; reason: string }> {
  const credentials = readCredentials();
  if (!credentials || !PAYMENT_ID.test(paymentId ?? "")) {
    return { ok: false, reason: "not-configured-or-bad-id" };
  }
  try {
    const read = await razorpay(`payments/${paymentId}`, credentials);
    if (!read.ok) return { ok: false, reason: `read-${read.status}` };
    return { ok: true, notes: read.payload?.notes ?? {} };
  } catch (error) {
    console.error("razorpay note: read threw", error);
    return { ok: false, reason: "read-threw" };
  }
}

/**
 * Merge notes onto a payment. Razorpay REPLACES the notes object, so this is a
 * read-modify-write. Best-effort by construction: a failure here must never
 * break a payer's return from the bank.
 */
export async function stampPaymentNote(
  paymentId: string,
  notes: Record<string, string>,
): Promise<boolean> {
  const credentials = readCredentials();
  if (!credentials || !PAYMENT_ID.test(paymentId ?? "")) return false;

  const existing = await readPaymentNotes(paymentId);
  if (!existing.ok) console.error(`razorpay note: writing without merge (${existing.reason})`);
  let merged: Record<string, string> = { ...(existing.ok ? existing.notes : {}), ...notes };

  const keys = Object.keys(merged);
  if (keys.length > MAX_NOTES) {
    const incoming = Object.keys(notes);
    const kept = [...incoming, ...keys.filter((key) => !incoming.includes(key))].slice(0, MAX_NOTES);
    const dropped = keys.filter((key) => !kept.includes(key));
    console.error(`razorpay note: notes ceiling reached, dropped ${dropped.join(", ")}`);
    merged = Object.fromEntries(kept.map((key) => [key, merged[key]!]));
  }

  try {
    const written = await razorpay(`payments/${paymentId}`, credentials, {
      method: "PATCH",
      body: JSON.stringify({ notes: merged }),
    });
    if (!written.ok) console.error("razorpay note: stamp failed", written.status);
    return written.ok;
  } catch (error) {
    console.error("razorpay note: stamp threw", error);
    return false;
  }
}
