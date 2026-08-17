/**
 * POST /api/razorpay/create-order — Vercel serverless function.
 *
 * The site is `output: 'static'` (astro.config.ts §8: "Static output only. No
 * adapter, no SSR, no API routes"), so order creation cannot run in Astro. It
 * runs here, in Vercel's zero-config functions directory, alongside the static
 * artefact.
 *
 * The amount is validated SERVER-SIDE. An amount that arrives from the browser
 * is a request, not an instruction.
 *
 * TEST KEYS ONLY while this is unreleased: RAZORPAY_KEY_ID must start with
 * `rzp_test_`, and this handler refuses to run otherwise. That refusal is
 * deliberate — a live key reaching an unfinished checkout is the failure this
 * whole slice is written to prevent.
 */
import { validateOrderRequest } from '../_lib/razorpay.mjs';

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

  const validated = validateOrderRequest(request.body);
  if (!validated.ok) {
    return response.status(400).json({ error: validated.error });
  }

  try {
    const upstream = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      },
      body: JSON.stringify(validated.value),
    });

    const payload = await upstream.json();

    if (upstream.status === 401) {
      // Logged, not swallowed: a 401 means the keys are wrong, and a silent
      // retry loop against a rejected credential helps nobody.
      console.error('razorpay: authentication failed', payload?.error?.description ?? '');
      return response.status(401).json({ error: 'payment provider rejected the credentials' });
    }
    if (!upstream.ok) {
      console.error(
        'razorpay: order creation failed',
        upstream.status,
        payload?.error?.description ?? '',
      );
      return response.status(500).json({ error: 'payment provider error' });
    }

    // Only the fields the browser needs. The secret never leaves this process.
    return response.status(200).json({
      order_id: payload.id,
      amount: payload.amount,
      currency: payload.currency,
      key_id: keyId,
    });
  } catch (error) {
    console.error('razorpay: order creation threw', error);
    return response.status(500).json({ error: 'payment provider error' });
  }
}
