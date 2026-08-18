/**
 * POST /api/razorpay/create-subscription — Vercel serverless function
 * (R4-CHECKOUT, 2026-08-18).
 *
 * Creates a monthly Warrant Guardian subscription at the FOUNDER-SEALED price
 * and returns its id for the checkout modal. The amount is never taken from
 * the browser at all here — the plan is resolved server-side from the sealed
 * pair recorded in docs/governance/PRICING-SEAL.json (₹999/mo, founder act
 * "OK B", 2026-08-18). GST is added by Razorpay per their merchant settings.
 *
 * The plan is created once and reused: we look it up by the exact amount and
 * period before creating, so replays do not mint duplicate plans.
 *
 * TEST KEYS ONLY while unreleased — refuses any key not starting rzp_test_.
 */

const SEALED_INR = 999; // must equal the sealed amount; the pricing gate holds the page, this holds the charge
const PLAN_PERIOD = 'monthly';
const PLAN_ITEM = {
  name: 'Warrant Guardian — monthly',
  amount: SEALED_INR * 100, // paise
  currency: 'INR',
  description: 'Warrant Guardian subscription at the founder-sealed price (PRICING-SEAL.json)',
};

async function razorpay(path, keyId, keySecret, options = {}) {
  const upstream = await fetch(`https://api.razorpay.com/v1/${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      ...(options.headers ?? {}),
    },
  });
  const payload = await upstream.json();
  return { status: upstream.status, ok: upstream.ok, payload };
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'method not allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.error('razorpay: credentials are not configured');
    return response.status(500).json({ error: 'payments are not configured' });
  }
  if (!keyId.startsWith('rzp_test_')) {
    console.error('razorpay: refusing a non-test key — this integration is unreleased');
    return response.status(500).json({ error: 'payments are not configured' });
  }

  try {
    // 1. Find or create the plan for the sealed amount. Lookup first so a
    //    replayed call cannot mint plan duplicates.
    const plans = await razorpay('plans?count=100', keyId, keySecret);
    if (plans.status === 401) {
      console.error('razorpay: authentication failed', plans.payload?.error?.description ?? '');
      return response.status(401).json({ error: 'payment provider rejected the credentials' });
    }
    if (!plans.ok) {
      console.error('razorpay: plan lookup failed', plans.status);
      return response.status(500).json({ error: 'payment provider error' });
    }
    let plan = (plans.payload.items ?? []).find(
      (candidate) =>
        candidate.period === PLAN_PERIOD &&
        candidate.item?.amount === PLAN_ITEM.amount &&
        candidate.item?.currency === 'INR',
    );
    if (!plan) {
      const created = await razorpay('plans', keyId, keySecret, {
        method: 'POST',
        body: JSON.stringify({ period: PLAN_PERIOD, interval: 1, item: PLAN_ITEM }),
      });
      if (!created.ok) {
        console.error(
          'razorpay: plan creation failed',
          created.status,
          created.payload?.error?.description ?? '',
        );
        return response.status(500).json({ error: 'payment provider error' });
      }
      plan = created.payload;
    }

    // 2. Create the subscription. total_count 120 = ten years of monthly
    //    renewals, Razorpay's way of saying "ongoing".
    const subscription = await razorpay('subscriptions', keyId, keySecret, {
      method: 'POST',
      body: JSON.stringify({
        plan_id: plan.id,
        total_count: 120,
        customer_notify: 1,
        notes: { surface: 'aiworkspacehq.com/checkout', seal: 'PRICING-SEAL 2026-08-18 OK B' },
      }),
    });
    if (!subscription.ok) {
      console.error(
        'razorpay: subscription creation failed',
        subscription.status,
        subscription.payload?.error?.description ?? '',
      );
      return response.status(500).json({ error: 'payment provider error' });
    }

    // Only what the modal needs. The secret never leaves this process.
    return response.status(200).json({
      subscription_id: subscription.payload.id,
      key_id: keyId,
      amount_inr: SEALED_INR,
    });
  } catch (error) {
    console.error('razorpay: create-subscription threw', error);
    return response.status(500).json({ error: 'payment provider error' });
  }
}
