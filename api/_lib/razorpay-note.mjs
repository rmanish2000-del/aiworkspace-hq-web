/**
 * razorpay-note.mjs — capture a run outcome AT THE SOURCE
 * (R4-SELF-EVIDENCING-CLOSE, 2026-08-19; RETURN-PATH-DIAGNOSED 2026-08-20).
 *
 * This repository has no datastore, and inventing one silently is the failure
 * the fleet keeps naming. But the run does not need a new store: Razorpay is
 * already the durable ledger, and its objects carry writable `notes`. So the
 * return path and the webhook stamp their own outcome onto the PAYMENT — the
 * one object both of them can name — and the run record reads it back.
 *
 * Identifiers and outcomes only. Never card data, never anything a processor
 * would call sensitive, never a secret.
 *
 * Best-effort by construction: a failure here must never break a visitor's
 * return from the bank, so every call is wrapped and logged, not thrown.
 *
 * MERGE, not replace: a PATCH that sends only the new keys wipes prior notes.
 * That is the defect observed when webhook_verified stayed true and
 * return_path_verified stayed false after the founder completed the redirect
 * (2026-08-20). Always GET current notes, merge, then PATCH.
 */
export async function stampPaymentNote(paymentId, notes) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret || !/^pay_[A-Za-z0-9]+$/.test(paymentId ?? '')) return false;

  const auth = {
    authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
  };

  try {
    // Read existing notes so a later stamp (webhook after return, or the reverse)
    // does not erase the earlier one.
    let existing = {};
    const current = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: auth,
    });
    if (current.ok) {
      const body = await current.json();
      existing = body.notes && typeof body.notes === 'object' ? body.notes : {};
    }

    const merged = { ...existing, ...notes };

    const upstream = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        ...auth,
      },
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
