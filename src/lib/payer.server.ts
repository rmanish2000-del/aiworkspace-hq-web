/**
 * Who paid, what they are told, and whether we have already told them.
 * Port of api/_lib/payer.mjs from web/guardian-concrete-example.
 *
 * Pure: no I/O and no environment. The sentences below are the ones already
 * published on the site (contact, delivery, the legal footer). This repository
 * still does not provision access, so the mail says a person sets it up.
 */

export const REPLY_TO = "founder@aiworkspacehq.com";
export const RESPONSE_WINDOW = "within 3 business days";

export const WELCOME_KEY = "aiwhq_welcome";
export const WELCOME_AT_KEY = "aiwhq_welcome_at";
export const ALERT_KEY = "aiwhq_alert";

/** Verified webhook events that can carry a captured subscription payment. */
export const PAYMENT_ALERT_EVENTS = [
  "payment.captured",
  "subscription.charged",
  "subscription.activated",
] as const;

export type PaymentAlertEventName = (typeof PAYMENT_ALERT_EVENTS)[number];

export type PaymentAlertPayer = {
  paymentId: string;
  email: string;
  amountPaise: number | null;
  currency: string;
  status: string;
  createdAtIso: string | null;
  subscriptionId: string | null;
  contact: string;
};

type PaymentEntity = {
  id?: unknown;
  status?: unknown;
  email?: unknown;
  amount?: unknown;
  currency?: unknown;
  created_at?: unknown;
  contact?: unknown;
  subscription_id?: unknown;
};

export type RazorpayWebhookEvent = {
  event?: unknown;
  payload?: {
    payment?: { entity?: PaymentEntity };
    subscription?: { entity?: { id?: unknown } };
  };
};

const PAYMENT_ID = /^pay_[A-Za-z0-9]+$/;

export function isPaymentAlertEvent(eventName: string): eventName is PaymentAlertEventName {
  return (PAYMENT_ALERT_EVENTS as readonly string[]).includes(eventName);
}

/**
 * A captured payment, or null. Authorized-but-uncaptured is not a customer,
 * and mailing one "payment received" would be false.
 */
export function payerFromEvent(event: RazorpayWebhookEvent): PaymentAlertPayer | null {
  const payment = event.payload?.payment?.entity;
  if (!payment || typeof payment.id !== "string" || !PAYMENT_ID.test(payment.id)) return null;
  if (payment.status !== "captured") return null;

  const email = typeof payment.email === "string" ? payment.email.trim() : "";
  const subscriptionFromPayload = event.payload?.subscription?.entity?.id;
  const subscriptionId =
    typeof subscriptionFromPayload === "string"
      ? subscriptionFromPayload
      : typeof payment.subscription_id === "string"
        ? payment.subscription_id
        : null;

  return {
    paymentId: payment.id,
    email,
    amountPaise:
      typeof payment.amount === "number" && Number.isInteger(payment.amount)
        ? payment.amount
        : null,
    currency: typeof payment.currency === "string" ? payment.currency : "INR",
    status: "captured",
    createdAtIso:
      typeof payment.created_at === "number"
        ? new Date(payment.created_at * 1000).toISOString()
        : null,
    subscriptionId,
    contact: typeof payment.contact === "string" ? payment.contact : "",
  };
}

export function formatAmount(amountPaise: number | null, currency = "INR"): string {
  if (!Number.isInteger(amountPaise)) return "an amount Razorpay did not report";
  const major = (amountPaise as number) / 100;
  const grouped = major.toLocaleString("en-IN", {
    minimumFractionDigits: major % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return currency === "INR" ? `₹${grouped}` : `${grouped} ${currency}`;
}

/**
 * Keyed on the payment, not the event. Razorpay emits payment.captured and
 * subscription.charged (and may retry each) for one charge. Both mails have
 * to have succeeded before a replay is suppressed; a failed send stays
 * retryable by the sibling event.
 */
export function alreadyAlerted(notes: Record<string, string> | null | undefined): boolean {
  const welcome = notes?.[WELCOME_KEY];
  const alert = notes?.[ALERT_KEY];
  const welcomeDone =
    welcome === "sent" ||
    (typeof welcome === "string" && welcome.startsWith("FAILED — razorpay-reported-no-email"));
  return welcomeDone && alert === "sent";
}

const ENTITY_BLOCK = [
  "Kartavya CSC Digital Seva, a sole proprietorship of Manish Patel",
  "Tilak Ward, Deori, District Sagar, Madhya Pradesh 470226, India",
  "GSTIN 23AKZPP1502D1ZB · Udyam UDYAM-MP-39-0001250",
].join("\n");

export function welcomeEmail(
  payer: PaymentAlertPayer,
  siteUrl = "https://aiworkspacehq.com",
): { subject: string; text: string } {
  const amount = formatAmount(payer.amountPaise, payer.currency);
  const subject = `Warrant Guardian — payment received (${amount})`;
  const text = [
    "Thank you — your payment went through.",
    "",
    "WHAT WAS TAKEN",
    "  Product     Warrant Guardian, Founder Edition",
    `  Amount      ${amount} per month (GST as applicable)`,
    `  Payment id  ${payer.paymentId}`,
    payer.subscriptionId ? `  Subscription ${payer.subscriptionId}` : null,
    payer.createdAtIso ? `  Date        ${payer.createdAtIso}` : null,
    "",
    "WHAT HAPPENS NEXT — stated plainly, because you paid a stranger",
    "  Founder Edition access is set up by hand, by me. It is not provisioned",
    "  automatically, and I would rather say so than leave you hunting for",
    "  something that is not there. I will email you personally from",
    `  ${REPLY_TO} ${RESPONSE_WINDOW} with your access.`,
    "  Nothing is required from you in the meantime.",
    "",
    "IF THAT DOES NOT HAPPEN",
    "  The Delivery Policy covers exactly this: if you pay and access is not",
    "  provisioned, write to me and it is resolved or the charge is refunded in",
    "  full. Reply to this email and you have done everything you need to.",
    "",
    "YOUR RIGHTS AND THE PAPERWORK",
    `  Delivery Policy   ${siteUrl}/delivery`,
    `  Refunds           ${siteUrl}/refunds`,
    `  Terms             ${siteUrl}/terms`,
    `  Privacy           ${siteUrl}/privacy`,
    `  Contact           ${siteUrl}/contact`,
    "",
    `Reply to this email and it reaches a person: ${REPLY_TO}`,
    "",
    "—",
    ENTITY_BLOCK,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return { subject, text };
}

export function founderAlertEmail(
  payer: PaymentAlertPayer,
  welcomeOutcome: string,
): { subject: string; text: string } {
  const amount = formatAmount(payer.amountPaise, payer.currency);
  const reachable = payer.email !== "";
  const subject = reachable
    ? `PAYMENT — ${amount} from ${payer.email}`
    : `PAYMENT — ${amount} — NO EMAIL ON THE PAYMENT`;

  const text = [
    reachable
      ? "A payment was captured and verified. A real person is now waiting on you."
      : "A payment was captured and verified, but Razorpay reported NO EMAIL for it. " +
        "This payer cannot be contacted from the webhook — open the payment in " +
        "Razorpay and find a contact before anything else.",
    "",
    `  Amount       ${amount}`,
    `  Email        ${payer.email || "(none reported)"}`,
    `  Contact      ${payer.contact || "(none reported)"}`,
    `  Payment id   ${payer.paymentId}`,
    payer.subscriptionId ? `  Subscription ${payer.subscriptionId}` : null,
    payer.createdAtIso ? `  Captured at  ${payer.createdAtIso}` : null,
    `  Status       ${payer.status}`,
    "",
    `  Confirmation to the payer: ${welcomeOutcome}`,
    "",
    `You committed to a personal reply ${RESPONSE_WINDOW}. The clock started at`,
    "the timestamp above, not when you read this.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return { subject, text };
}
