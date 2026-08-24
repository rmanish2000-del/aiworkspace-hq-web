/**
 * razorpay-note.mjs — capture a run outcome AT THE SOURCE
 * (R4-SELF-EVIDENCING-CLOSE, 2026-08-19; made additive under
 * PAYER-GETS-SOMETHING, 2026-08-24).
 *
 * This repository has no datastore, and inventing one silently is the failure
 * the fleet keeps naming. But the run does not need a new store: Razorpay is
 * already the durable ledger, and its objects carry writable `notes`. So the
 * return path, the webhook and the delivery step stamp their own outcome onto
 * the PAYMENT — the one object all of them can name — and the run record reads
 * it back.
 *
 * ─── WHY THIS NOW READS BEFORE IT WRITES (2026-08-24) ─────────────────────
 * `PATCH /v1/payments/:id` REPLACES the notes object; it does not merge. With
 * one writer that was invisible. With three it is not: the webhook stamp would
 * erase the return stamp, and — the reason it had to be fixed today — an
 * idempotency marker that a later stamp can erase is not an idempotency marker
 * at all. It would let a redelivered webhook email a customer twice.
 *
 * So every stamp is now read-modify-write. Stated honestly: read-modify-write
 * is NOT atomic, and Razorpay offers no compare-and-set. Two deliveries
 * arriving within the same few hundred milliseconds could still both observe
 * "not yet sent". That residual race is why the mail send also carries an
 * `Idempotency-Key` — the two together are what make a double send unlikely
 * rather than merely improbable.
 *
 * Identifiers and outcomes only. Never card data, never anything a processor
 * would call sensitive, never a secret.
 *
 * Best-effort by construction: a failure here must never break a visitor's
 * return from the bank, so every call is wrapped and logged, not thrown.
 */

/** Razorpay's documented ceiling on the notes object. */
const MAX_NOTES = 15;

const PAYMENT_ID = /^pay_[A-Za-z0-9]+$/;

function auth() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;
}

/**
 * Read a payment's current notes.
 *
 * Returns `{ ok: false }` rather than an empty object on failure: "we could
 * not look" and "nothing is there" lead to opposite decisions, and a caller
 * that cannot tell them apart will happily re-send an email it already sent.
 *
 * @param {string} paymentId
 * @returns {Promise<{ ok: true, notes: Record<string, string> } | { ok: false, reason: string }>}
 */
export async function readPaymentNotes(paymentId) {
  const authorization = auth();
  if (!authorization || !PAYMENT_ID.test(paymentId ?? '')) {
    return { ok: false, reason: 'not-configured-or-bad-id' };
  }
  try {
    const upstream = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: { authorization },
    });
    if (!upstream.ok) {
      console.error('razorpay note: read failed', upstream.status);
      return { ok: false, reason: `read-${upstream.status}` };
    }
    const payment = await upstream.json();
    return { ok: true, notes: payment?.notes ?? {} };
  } catch (error) {
    console.error('razorpay note: read threw', error);
    return { ok: false, reason: `read-threw: ${error.message}` };
  }
}

/**
 * Merge `notes` into whatever the payment already carries.
 *
 * @param {string} paymentId
 * @param {Record<string, string>} notes
 * @returns {Promise<boolean>} true only if Razorpay accepted the write
 */
export async function stampPaymentNote(paymentId, notes) {
  const authorization = auth();
  if (!authorization || !PAYMENT_ID.test(paymentId ?? '')) return false;

  const existing = await readPaymentNotes(paymentId);
  // A failed read is not treated as "no notes" — that would silently discard
  // every earlier stamp on the object. Write only the new keys instead, and
  // say in the log that the merge could not be performed.
  if (!existing.ok) {
    console.error(`razorpay note: writing without merge (${existing.reason})`);
  }
  let merged = { ...(existing.ok ? existing.notes : {}), ...notes };

  const keys = Object.keys(merged);
  if (keys.length > MAX_NOTES) {
    // Keep the keys being written now plus as many older ones as fit, and name
    // what was lost. Silent truncation of an evidence record is worse than a
    // loud one.
    const incoming = Object.keys(notes);
    const kept = [...incoming, ...keys.filter((key) => !incoming.includes(key))].slice(
      0,
      MAX_NOTES,
    );
    const dropped = keys.filter((key) => !kept.includes(key));
    console.error(`razorpay note: notes ceiling reached, dropped ${dropped.join(', ')}`);
    merged = Object.fromEntries(kept.map((key) => [key, merged[key]]));
  }

  try {
    const upstream = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', authorization },
      body: JSON.stringify({ notes: merged }),
    });
    if (!upstream.ok) {
      console.error('razorpay note: stamp failed', upstream.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error('razorpay note: stamp threw', error);
    return false;
  }
}
