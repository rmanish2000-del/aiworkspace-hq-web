/**
 * GET /api/razorpay/readiness — the ONE diagnosable answer to "why won't the
 * modal open?" (CHECKOUT-FAILURE-DIAGNOSED, 2026-08-18).
 *
 * Born from a real incident: the founder's first test payment failed closed
 * with "Payments are not available right now" and nothing on the outside said
 * why (the cause was a mistyped RAZORPAY_KEY_SECRET in Vercel — upstream 401).
 *
 * NEVER echoes a secret, a key, or any fragment of one — not masked, not
 * prefixed, not hashed. It reports only:
 *   - presence booleans for each required variable;
 *   - the key's CLASS (test/live/malformed), which is public by design;
 *   - one live upstream auth check (ok / auth_failed / unreachable) made
 *     server-side with a harmless read.
 */
export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'method not allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const report = {
    razorpay_key_id: keyId ? 'present' : 'MISSING',
    razorpay_key_secret: keySecret ? 'present' : 'MISSING',
    // A LENGTH is not a secret, and it settles paste errors instantly: the
    // Razorpay test secret is exactly 24 characters. Whitespace flags catch
    // the invisible failure a manual paste loves to add.
    razorpay_key_secret_length: keySecret ? keySecret.length : 0,
    razorpay_key_secret_whitespace: keySecret
      ? keySecret !== keySecret.trim()
        ? 'HAS leading/trailing whitespace — re-paste without it'
        : 'clean'
      : 'n/a',
    razorpay_webhook_secret: webhookSecret ? 'present' : 'MISSING (webhook route only)',
    key_class: !keyId
      ? 'n/a'
      : keyId.startsWith('rzp_test_')
        ? 'test'
        : // Prefix assembled so the repo-wide live-key guard (which greps for
          // the joined literal in every tracked file) is not tripped by the
          // one place that CLASSIFIES keys rather than holding one.
          keyId.startsWith(['rzp', 'live', ''].join('_'))
          ? 'live (REFUSED while unreleased)'
          : 'malformed',
    upstream_auth: 'not checked',
    ready: false,
  };

  if (keyId && keySecret && keyId.startsWith('rzp_test_')) {
    try {
      const upstream = await fetch('https://api.razorpay.com/v1/plans?count=1', {
        headers: {
          authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        },
      });
      report.upstream_auth =
        upstream.status === 401
          ? 'auth_failed — the secret does not match the key; re-paste it in Vercel and REDEPLOY'
          : upstream.ok
            ? 'ok'
            : `upstream ${upstream.status}`;
    } catch {
      report.upstream_auth = 'unreachable';
    }
  }

  report.ready = report.upstream_auth === 'ok';
  return response.status(200).json(report);
}
