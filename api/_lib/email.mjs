/**
 * email.mjs — the one way this repository sends mail
 * (PAYER-GETS-SOMETHING, 2026-08-24).
 *
 * Resend over plain `fetch`, matching every other outbound call here: no SDK,
 * no new dependency, and the variable names (`RESEND_API_KEY`, `OPS_EMAIL`)
 * were already written into `.env.example` as a documented future need. This
 * is that future.
 *
 * ─── WHY IT NEVER THROWS, AND NEVER LIES EITHER ───────────────────────────
 * A throw inside the webhook would turn a delivered confirmation into a 500
 * and a Razorpay retry storm. So this returns an outcome instead — and the
 * outcome distinguishes the two failures that need opposite responses:
 *
 *   permanent  : nothing is configured. Retrying cannot help; retrying only
 *                gets the webhook disabled by Razorpay, which would cost us
 *                the payment record too. The caller records the failure where
 *                a human will see it and returns 200.
 *   transient  : the provider was reachable and said no, or the network
 *                failed. Retrying is exactly right; the caller returns 500 and
 *                Razorpay redelivers.
 *
 * Never logs the body, never logs the key, never logs a recipient address
 * beyond what the caller already put in the record.
 */

export const NOT_CONFIGURED = 'no-email-provider-configured';

const ENDPOINT = 'https://api.resend.com/emails';

/** Sender identity. Overridable because the verified domain is an ops fact. */
export function sender() {
  return process.env.MAIL_FROM ?? 'AI Workspace <founder@aiworkspacehq.com>';
}

/** Where the founder's own alerts go. */
export function opsRecipient() {
  return process.env.OPS_EMAIL ?? '';
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * @param {{ to: string, subject: string, text: string, replyTo?: string,
 *           idempotencyKey?: string }} message
 * @returns {Promise<{ sent: boolean, reason: string | null, permanent: boolean }>}
 */
export async function sendEmail(message) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, reason: NOT_CONFIGURED, permanent: true };
  }
  if (!message?.to) {
    return { sent: false, reason: 'no-recipient', permanent: true };
  }

  const headers = {
    'content-type': 'application/json',
    authorization: `Bearer ${apiKey}`,
  };
  // Belt and braces on double-sending: the caller already refuses to send
  // twice for one payment, and this asks the provider to enforce the same
  // thing at its end. A provider that ignores the header is no worse off.
  if (message.idempotencyKey) headers['Idempotency-Key'] = message.idempotencyKey;

  try {
    const upstream = await fetch(ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: sender(),
        to: [message.to],
        subject: message.subject,
        text: message.text,
        ...(message.replyTo ? { reply_to: [message.replyTo] } : {}),
      }),
    });

    if (upstream.ok) return { sent: true, reason: null, permanent: false };

    // 4xx other than 429 will not fix themselves on a redelivery — a rejected
    // sender domain or a malformed address is an ops problem, not a blip.
    const permanent = upstream.status >= 400 && upstream.status < 500 && upstream.status !== 429;
    return { sent: false, reason: `provider-${upstream.status}`, permanent };
  } catch (error) {
    return { sent: false, reason: `network: ${error.message}`, permanent: false };
  }
}
