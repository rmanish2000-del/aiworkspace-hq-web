/**
 * GET /api/razorpay/run-record — "did an end-to-end run happen, and did it
 * verify?" (R4-SELF-EVIDENCING-CLOSE, 2026-08-19).
 *
 * The closing evidence for R4 used to depend on a human transcribing a screen
 * correctly, once, on a phone. This removes that joint: the run is
 * reconstructed from Razorpay's own ledger — the authority — plus the
 * outcome notes the return path and the webhook stamp onto the payment.
 * Nothing here depends on a browser tab staying open.
 *
 * HONESTY RULES this endpoint obeys:
 *   - No run yet reads as NO RUN YET. It never renders an empty green.
 *   - Anything it cannot see is named in `cannot_see`, on the surface itself,
 *     rather than being quietly omitted.
 *   - It reads only. It never creates, charges, or retries anything.
 *
 * ?id=sub_… inspects one subscription; with no id it takes the most recent
 * subscription on the account that got past `created`.
 */
const CANNOT_SEE = [
  "Razorpay's webhook 'Recent deliveries' HTTP status — that log is dashboard-only and has no API for a key-holder. If the run record below says webhook_verified: false, check Razorpay Dashboard -> Webhooks -> your endpoint -> Recent deliveries before concluding the webhook never fired.",
  'Anything in test mode proves the plumbing, not real money movement. Live mode is a separate founder act.',
];

async function razorpay(path, keyId, keySecret) {
  const upstream = await fetch(`https://api.razorpay.com/v1/${path}`, {
    headers: {
      authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
    },
  });
  return { ok: upstream.ok, status: upstream.status, payload: await upstream.json() };
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'method not allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret || !keyId.startsWith('rzp_test_')) {
    return response.status(500).json({
      verdict: 'CANNOT CHECK — payments are not configured on this deployment',
      cannot_see: CANNOT_SEE,
    });
  }

  const requested = typeof request.query?.id === 'string' ? request.query.id : '';
  const wanted = /^sub_[A-Za-z0-9]+$/.test(requested) ? requested : '';

  try {
    let subscription = null;
    if (wanted) {
      const one = await razorpay(`subscriptions/${wanted}`, keyId, keySecret);
      subscription = one.ok ? one.payload : null;
    } else {
      const list = await razorpay('subscriptions?count=25', keyId, keySecret);
      if (!list.ok) {
        return response.status(502).json({
          verdict: 'CANNOT CHECK — the payment provider did not answer',
          cannot_see: CANNOT_SEE,
        });
      }
      // The most recent subscription that got past `created` — i.e. one where
      // a human actually completed authentication.
      subscription =
        (list.payload.items ?? [])
          .filter((item) => item.status !== 'created')
          .sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0))[0] ?? null;
    }

    if (!subscription) {
      return response.status(200).json({
        verdict:
          'NO RUN YET — no subscription has got past "created", so nobody has completed a payment on this account',
        run_detected: false,
        cannot_see: CANNOT_SEE,
      });
    }

    // The payment behind it, via the invoice Razorpay raises per cycle.
    let payment = null;
    const invoices = await razorpay(
      `invoices?subscription_id=${encodeURIComponent(subscription.id)}&count=10`,
      keyId,
      keySecret,
    );
    const paymentId = (invoices.ok ? (invoices.payload.items ?? []) : [])
      .map((invoice) => invoice.payment_id)
      .find(Boolean);
    if (paymentId) {
      const one = await razorpay(`payments/${paymentId}`, keyId, keySecret);
      payment = one.ok ? one.payload : null;
    }

    const notes = payment?.notes ?? {};
    const returnVerified = notes.aiwhq_return === 'verified';
    const webhookVerified =
      typeof notes.aiwhq_webhook === 'string' && notes.aiwhq_webhook.includes('verified');
    const paid = subscription.status === 'active' || subscription.status === 'authenticated';
    const captured = payment?.status === 'captured' || payment?.status === 'authorized';

    const verdict = !paid
      ? `NO COMPLETE RUN — the newest subscription is "${subscription.status}", which means authentication was not finished`
      : returnVerified && webhookVerified
        ? 'END-TO-END RUN VERIFIED — payment completed, the return signature verified, and the webhook arrived and verified'
        : returnVerified
          ? 'RUN COMPLETED, RETURN VERIFIED — the webhook has not stamped this payment; see cannot_see before concluding it never fired'
          : webhookVerified
            ? 'RUN COMPLETED, WEBHOOK VERIFIED — the return path did not stamp this payment (the payer may have closed the tab before returning)'
            : 'RUN COMPLETED AT THE PROVIDER, NOT SELF-EVIDENCED — the subscription is live at Razorpay but neither our return path nor our webhook stamped it; this is the state a payment made BEFORE this record existed leaves behind';

    return response.status(200).json({
      verdict,
      run_detected: paid,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        paid_count: subscription.paid_count ?? null,
        created_at: subscription.created_at ?? null,
        current_end: subscription.current_end ?? null,
      },
      payment: payment
        ? {
            id: payment.id,
            status: payment.status,
            amount: payment.amount,
            method: payment.method ?? null,
            created_at: payment.created_at,
          }
        : null,
      payment_captured: captured,
      return_path_verified: returnVerified,
      webhook_verified: webhookVerified,
      evidence_notes: notes,
      cannot_see: CANNOT_SEE,
    });
  } catch (error) {
    console.error('razorpay run-record threw', error);
    return response.status(500).json({
      verdict: 'CANNOT CHECK — an error occurred reading the payment provider',
      cannot_see: CANNOT_SEE,
    });
  }
}
