/**
 * The one way this site sends mail. Port of api/_lib/email.mjs from
 * web/guardian-concrete-example (PAYER-GETS-SOMETHING, 2026-08-24).
 *
 * Resend over fetch: no SDK. RESEND_API_KEY is read from the environment at
 * send time and is never hardcoded. A missing key or a provider error returns
 * an outcome — this function does not throw, because a throw inside the
 * Razorpay webhook would turn a delivered payment into a retry storm.
 */

export const NOT_CONFIGURED = "no-email-provider-configured";

/** Documented default. The address must be a verified sender in Resend. */
export const DEFAULT_MAIL_FROM = "AI Workspace <founder@aiworkspacehq.com>";

/**
 * Documented default for the founder payment alert. Published on /contact.
 * Override with OPS_EMAIL when the alert should go somewhere else.
 */
export const DEFAULT_OPS_EMAIL = "founder@aiworkspacehq.com";

const ENDPOINT = "https://api.resend.com/emails";

export function sender(): string {
  const configured = process.env["MAIL_FROM"]?.trim();
  return configured || DEFAULT_MAIL_FROM;
}

export function opsRecipient(): string {
  const configured = process.env["OPS_EMAIL"]?.trim();
  return configured || DEFAULT_OPS_EMAIL;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env["RESEND_API_KEY"]);
}

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  idempotencyKey?: string;
};

export type SendEmailResult = {
  sent: boolean;
  reason: string | null;
  permanent: boolean;
};

export async function sendEmail(message: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    return { sent: false, reason: NOT_CONFIGURED, permanent: true };
  }
  if (!message.to) {
    return { sent: false, reason: "no-recipient", permanent: true };
  }

  const headers: Record<string, string> = {
    "content-type": "application/json",
    authorization: `Bearer ${apiKey}`,
  };
  if (message.idempotencyKey) headers["Idempotency-Key"] = message.idempotencyKey;

  const body: Record<string, unknown> = {
    from: sender(),
    to: [message.to],
    subject: message.subject,
    text: message.text,
  };
  if (message.replyTo) body["reply_to"] = [message.replyTo];

  try {
    const upstream = await fetch(ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (upstream.ok) return { sent: true, reason: null, permanent: false };
    const permanent = upstream.status >= 400 && upstream.status < 500 && upstream.status !== 429;
    return { sent: false, reason: `provider-${upstream.status}`, permanent };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown";
    return { sent: false, reason: `network: ${detail}`, permanent: false };
  }
}
