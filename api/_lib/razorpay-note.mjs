/**
 * razorpay-note.mjs — capture a run outcome AT THE SOURCE
 * (R4-SELF-EVIDENCING-CLOSE, 2026-08-19).
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
 */
export async function stampPaymentNote(paymentId, notes) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret || !/^pay_[A-Za-z0-9]+$/.test(paymentId ?? '')) return false;

  try {
    const upstream = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      },
      body: JSON.stringify({ notes }),
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
