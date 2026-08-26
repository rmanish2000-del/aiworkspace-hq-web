/**
 * PAYER-GETS-SOMETHING (2026-08-24) — a paid customer must actually receive
 * something, and we must be able to reach them.
 *
 * These tests exist because the failure they guard against is not a crash. It
 * is a 200 OK with a silent nothing behind it: money taken, no confirmation
 * sent, no alert raised, and no way to tell afterwards which of those happened.
 * So the whole webhook is driven here against a stubbed Razorpay and a stubbed
 * mail provider, and every assertion is about what a real person receives.
 *
 * The stub keeps state: a PATCH to the payment updates the notes a later GET
 * returns. That is what lets the duplicate-delivery test be a real second
 * invocation of the handler rather than a claim about one.
 */
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  alreadyWelcomed,
  formatAmount,
  founderAlertEmail,
  payerFromEvent,
  welcomeEmail,
  REPLY_TO,
  RESPONSE_WINDOW,
} from '../../api/_lib/payer.mjs';
import { NOT_CONFIGURED, sendEmail } from '../../api/_lib/email.mjs';
import readiness from '../../api/razorpay/readiness.mjs';
import webhook from '../../api/razorpay/webhook.mjs';

const WEBHOOK_SECRET = 'whsec_for_unit_tests_only';
const PAYMENT_ID = 'pay_TESTPAYER01';

const CAPTURED = {
  event: 'payment.captured',
  payload: {
    payment: {
      entity: {
        id: PAYMENT_ID,
        status: 'captured',
        amount: 99900,
        currency: 'INR',
        email: 'buyer@example.com',
        contact: '+919000000000',
        created_at: 1_755_000_000,
        subscription_id: 'sub_TESTPAYER01',
      },
    },
  },
};

/* -------------------------------------------------------------------------- */
/* Harness                                                                    */
/* -------------------------------------------------------------------------- */

interface Call {
  url: string;
  method: string;
  body: unknown;
  headers: Record<string, string>;
}

let calls: Call[] = [];
let storedNotes: Record<string, string> = {};
let razorpayReadStatus = 200;
let resendStatus = 200;

function installFetch() {
  vi.stubGlobal('fetch', async (url: string, init: RequestInit = {}) => {
    const method = (init.method ?? 'GET').toUpperCase();
    const body = init.body ? JSON.parse(String(init.body)) : null;
    calls.push({ url, method, body, headers: (init.headers ?? {}) as Record<string, string> });

    if (url.startsWith('https://api.razorpay.com/v1/payments/')) {
      if (method === 'GET') {
        if (razorpayReadStatus !== 200) {
          return { ok: false, status: razorpayReadStatus, json: async () => ({}) };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({ id: PAYMENT_ID, notes: storedNotes }),
        };
      }
      if (method === 'PATCH') {
        storedNotes = { ...((body as { notes?: Record<string, string> })?.notes ?? {}) };
        return {
          ok: true,
          status: 200,
          json: async () => ({ id: PAYMENT_ID, notes: storedNotes }),
        };
      }
    }
    if (url === 'https://api.resend.com/emails') {
      return { ok: resendStatus < 400, status: resendStatus, json: async () => ({}) };
    }
    throw new Error(`unstubbed fetch: ${method} ${url}`);
  });
}

function request(event: unknown, signature?: string) {
  const raw = JSON.stringify(event);
  const sig =
    signature ?? createHmac('sha256', WEBHOOK_SECRET).update(Buffer.from(raw)).digest('hex');
  return {
    method: 'POST',
    headers: { 'x-razorpay-signature': sig, 'x-razorpay-event-id': 'evt_TEST01' },
    async *[Symbol.asyncIterator]() {
      yield Buffer.from(raw);
    },
  };
}

function response() {
  const out = {
    code: 0,
    payload: null as unknown,
    status(code: number) {
      out.code = code;
      return out;
    },
    json(payload: unknown) {
      out.payload = payload;
      return out;
    },
  };
  return out;
}

const emailsSent = () => calls.filter((call) => call.url === 'https://api.resend.com/emails');
const recipientsOf = () => emailsSent().map((call) => (call.body as { to: string[] }).to[0]);

beforeEach(() => {
  calls = [];
  storedNotes = {};
  razorpayReadStatus = 200;
  resendStatus = 200;
  process.env.RAZORPAY_WEBHOOK_SECRET = WEBHOOK_SECRET;
  process.env.RAZORPAY_KEY_ID = 'rzp_test_unitkey';
  process.env.RAZORPAY_KEY_SECRET = 'unit_test_secret';
  process.env.RESEND_API_KEY = 're_unit_test_key';
  process.env.OPS_EMAIL = 'founder@aiworkspacehq.com';
  installFetch();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/* -------------------------------------------------------------------------- */
/* The four the assignment names                                              */
/* -------------------------------------------------------------------------- */

describe('readiness: mail configuration presence', () => {
  it('reports both mail variables as present without disclosing either value', async () => {
    const res = response();
    await readiness({ method: 'GET' }, res);

    expect(res.code).toBe(200);
    expect(res.payload).toMatchObject({ resend_api_key: 'present', ops_email: 'present' });
    expect(JSON.stringify(res.payload)).not.toContain(process.env.RESEND_API_KEY);
    expect(JSON.stringify(res.payload)).not.toContain(process.env.OPS_EMAIL);
  });

  it('reports both mail variables as absent', async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.OPS_EMAIL;
    const res = response();
    await readiness({ method: 'GET' }, res);

    expect(res.code).toBe(200);
    expect(res.payload).toMatchObject({ resend_api_key: 'absent', ops_email: 'absent' });
  });
});

describe('webhook: a verified payment produces a record and an email', () => {
  it('records the payer and writes to them', async () => {
    const res = response();
    await webhook(request(CAPTURED), res);

    expect(res.code).toBe(200);
    expect(res.payload).toMatchObject({ verified: true, delivered: true });

    // Written to the payer, and to the founder.
    expect(recipientsOf()).toEqual(['buyer@example.com', 'founder@aiworkspacehq.com']);

    // The record survives on the payment object, which is the store.
    expect(storedNotes.aiwhq_welcome).toBe('sent');
    expect(storedNotes.aiwhq_alert).toBe('sent');
    expect(storedNotes.aiwhq_welcome_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    // The webhook's own receipt is not erased by the delivery stamp.
    expect(storedNotes.aiwhq_webhook).toContain('verified');
  });

  it('hands the mail provider an idempotency key derived from the payment', async () => {
    await webhook(request(CAPTURED), response());
    const keys = emailsSent().map((call) => call.headers['Idempotency-Key']);
    expect(keys).toEqual([PAYMENT_ID, `${PAYMENT_ID}:ops`]);
  });
});

describe('webhook: a duplicate delivery produces one record and one email', () => {
  it('suppresses the second delivery of the same payment', async () => {
    await webhook(request(CAPTURED), response());
    const afterFirst = emailsSent().length;

    // Razorpay redelivers — and it redelivers a DIFFERENT event carrying the
    // same payment, which is exactly why the marker is keyed on the payment.
    const second = response();
    await webhook(request({ ...CAPTURED, event: 'subscription.charged' }), second);

    expect(second.code).toBe(200);
    expect(second.payload).toMatchObject({ outcome: 'already-sent' });
    expect(emailsSent().length).toBe(afterFirst);
    expect(recipientsOf().filter((to) => to === 'buyer@example.com')).toHaveLength(1);
  });
});

describe('webhook: a bad signature is rejected', () => {
  it('refuses the event and delivers nothing', async () => {
    const res = response();
    await webhook(request(CAPTURED, 'deadbeef'), res);

    expect(res.code).toBe(400);
    expect(res.payload).toEqual({ verified: false });
    expect(emailsSent()).toHaveLength(0);
    expect(storedNotes).toEqual({});
  });

  it('refuses an event with no signature at all', async () => {
    const raw = JSON.stringify(CAPTURED);
    const res = response();
    await webhook(
      {
        method: 'POST',
        headers: {},
        async *[Symbol.asyncIterator]() {
          yield Buffer.from(raw);
        },
      },
      res,
    );
    expect(res.code).toBe(400);
    expect(emailsSent()).toHaveLength(0);
  });
});

describe('webhook: a store failure is surfaced, not swallowed', () => {
  it('refuses to send blind and asks for redelivery when the record cannot be read', async () => {
    razorpayReadStatus = 500;
    const res = response();
    await webhook(request(CAPTURED), res);

    // 500 so Razorpay retries — and NOT a quiet 200.
    expect(res.code).toBe(500);
    expect(String((res.payload as { outcome: string }).outcome)).toContain('record-unreadable');
    expect(emailsSent()).toHaveLength(0);
    expect(console.error).toHaveBeenCalled();
  });

  it('asks for redelivery when the mail provider fails transiently', async () => {
    resendStatus = 503;
    const res = response();
    await webhook(request(CAPTURED), res);

    expect(res.code).toBe(500);
    expect(storedNotes.aiwhq_welcome).toContain('FAILED');
    expect(storedNotes.aiwhq_welcome).toContain('provider-503');
    expect(console.error).toHaveBeenCalled();
  });

  it('does NOT retry-storm a permanent misconfiguration, but records it against the payment', async () => {
    delete process.env.RESEND_API_KEY;
    const res = response();
    await webhook(request(CAPTURED), res);

    // 200, because redelivering a missing credential only gets the webhook
    // disabled — which would cost the payment record too.
    expect(res.code).toBe(200);
    expect(emailsSent()).toHaveLength(0);
    expect(storedNotes.aiwhq_welcome).toBe(`FAILED — ${NOT_CONFIGURED}`);
    expect(storedNotes.aiwhq_alert).toContain('FAILED');
    expect(console.error).toHaveBeenCalled();
  });

  it('still alerts the founder when the payer carries no email', async () => {
    const noEmail = structuredClone(CAPTURED);
    noEmail.payload.payment.entity.email = '';
    const res = response();
    await webhook(request(noEmail), res);

    expect(recipientsOf()).toEqual(['founder@aiworkspacehq.com']);
    expect(storedNotes.aiwhq_welcome).toContain('razorpay-reported-no-email');
    const alert = emailsSent()[0]?.body as { subject: string; text: string };
    expect(alert.subject).toContain('NO EMAIL');
    expect(alert.text).toContain('cannot be contacted');
  });
});

describe('webhook: only a captured payment is a customer', () => {
  it('acknowledges an authorized-but-uncaptured payment without claiming a sale', async () => {
    const authorized = structuredClone(CAPTURED);
    authorized.payload.payment.entity.status = 'authorized';
    const res = response();
    await webhook(request(authorized), res);

    expect(res.code).toBe(200);
    expect(res.payload).toMatchObject({ delivered: false });
    expect(emailsSent()).toHaveLength(0);
  });

  it('acknowledges an event with no payment at all', async () => {
    const res = response();
    await webhook(request({ event: 'subscription.activated', payload: {} }), res);
    expect(res.code).toBe(200);
    expect(emailsSent()).toHaveLength(0);
  });
});

/* -------------------------------------------------------------------------- */
/* What the customer actually reads                                           */
/* -------------------------------------------------------------------------- */

describe('the confirmation a payer receives', () => {
  const payer = payerFromEvent(CAPTURED);
  const mail = welcomeEmail(payer);

  it('states what was taken, in rupees, with the identifier they can quote', () => {
    expect(mail.subject).toBe('Warrant Guardian — payment received (₹999)');
    expect(mail.text).toContain('₹999 per month');
    expect(mail.text).toContain(PAYMENT_ID);
    expect(mail.text).toContain('sub_TESTPAYER01');
  });

  it('says access is set up by hand rather than implying an automatic delivery', () => {
    expect(mail.text).toContain('private beta build');
    expect(mail.text).toContain('Linux host');
    expect(mail.text).toContain('Docker');
    expect(mail.text).toContain('your own domain');
    expect(mail.text).toContain('ports 80 and 443');
    expect(mail.text).toContain('not a hosted service');
    expect(mail.text).toContain('single sign-on');
    expect(mail.text).toContain('Setup is done by hand');
    expect(mail.text).toContain(RESPONSE_WINDOW);
  });

  it('promises nothing that does not exist', () => {
    // Each of these would be a lie today: nothing in this repository mints a
    // key, grants repo access, or serves a download.
    for (const invention of [
      'licence key',
      'license key',
      'activation code',
      'download',
      'dashboard',
      'log in',
      'your account',
    ]) {
      expect(mail.text.toLowerCase()).not.toContain(invention);
    }
  });

  it('gives a real reply address and the policies that protect the buyer', () => {
    expect(mail.text).toContain(REPLY_TO);
    expect(mail.text).toContain('https://aiworkspacehq.com/delivery');
    expect(mail.text).toContain('https://aiworkspacehq.com/refunds');
    expect(mail.text).toContain('refunded in');
  });

  it('carries the same operating entity the site publishes', () => {
    expect(mail.text).toContain('Kartavya CSC Digital Seva');
    expect(mail.text).toContain('23AKZPP1502D1ZB');
  });
});

describe('the email is pinned to the pages it quotes', () => {
  it('uses the response window the site actually commits to', () => {
    const contact = readFileSync('src/legal/contact.md', 'utf8');
    expect(contact).toContain('3 business days');
    expect(RESPONSE_WINDOW).toBe('within 3 business days');
  });

  it('uses the reply address the site actually publishes', () => {
    expect(readFileSync('src/legal/contact.md', 'utf8')).toContain(REPLY_TO);
  });

  it('leans on a non-delivery clause that really is in the Delivery Policy', () => {
    const delivery = readFileSync('src/legal/delivery.md', 'utf8');
    expect(delivery).toContain('if you pay and access is not provisioned');
    expect(delivery).toContain('refund the charge in full');
  });
});

describe("the founder's alert", () => {
  it('carries everything needed to act without opening a dashboard', () => {
    const alert = founderAlertEmail(payerFromEvent(CAPTURED), 'sent');
    expect(alert.subject).toContain('₹999');
    expect(alert.subject).toContain('buyer@example.com');
    expect(alert.text).toContain(PAYMENT_ID);
    expect(alert.text).toContain('+919000000000');
    expect(alert.text).toContain('Confirmation to the payer: sent');
  });

  it('says outright when the confirmation failed', () => {
    const alert = founderAlertEmail(payerFromEvent(CAPTURED), 'FAILED — provider-503');
    expect(alert.text).toContain('FAILED — provider-503');
  });
});

/* -------------------------------------------------------------------------- */
/* Units                                                                      */
/* -------------------------------------------------------------------------- */

describe('payerFromEvent', () => {
  it('reads the five fields the record needs', () => {
    expect(payerFromEvent(CAPTURED)).toMatchObject({
      paymentId: PAYMENT_ID,
      email: 'buyer@example.com',
      amountPaise: 99900,
      status: 'captured',
      createdAtIso: new Date(1_755_000_000_000).toISOString(),
    });
  });

  it.each([
    ['an uncaptured payment', { status: 'authorized' }],
    ['a failed payment', { status: 'failed' }],
    ['a malformed id', { id: 'not_a_payment' }],
  ])('returns null for %s', (_label, patch) => {
    const event = structuredClone(CAPTURED);
    Object.assign(event.payload.payment.entity, patch);
    expect(payerFromEvent(event)).toBeNull();
  });

  it('returns null when there is no payment on the event', () => {
    expect(payerFromEvent({ event: 'subscription.activated', payload: {} })).toBeNull();
  });
});

describe('formatAmount', () => {
  it.each([
    [99900, 'INR', '₹999'],
    [150050, 'INR', '₹1,500.50'],
    [1_00_00_000, 'INR', '₹1,00,000'],
    [99900, 'USD', '999 USD'],
  ])('formats %i %s as %s', (paise, currency, expected) => {
    expect(formatAmount(paise as number, currency as string)).toBe(expected);
  });

  it('does not invent a number Razorpay did not report', () => {
    expect(formatAmount(null as unknown as number)).toContain('did not report');
  });
});

describe('alreadyWelcomed', () => {
  it.each([
    [{ aiwhq_welcome: 'sent' }, true],
    [{ aiwhq_welcome: 'sent at 10:00' }, true],
    [{ aiwhq_welcome: 'FAILED — provider-503' }, false],
    [{}, false],
    [null, false],
  ])('reads %o as %s', (notes, expected) => {
    expect(alreadyWelcomed(notes as Record<string, string> | null)).toBe(expected);
  });

  it('does not treat a failed attempt as delivered', () => {
    // The whole point: a failure must be RETRIED, not remembered as success.
    expect(alreadyWelcomed({ aiwhq_welcome: `FAILED — ${NOT_CONFIGURED}` })).toBe(false);
  });
});

describe('sendEmail', () => {
  it('reports a missing provider as permanent, and never as sent', async () => {
    delete process.env.RESEND_API_KEY;
    const result = await sendEmail({ to: 'a@b.test', subject: 's', text: 't' });
    expect(result).toEqual({ sent: false, reason: NOT_CONFIGURED, permanent: true });
  });

  it('classifies a 4xx as permanent and a 5xx as worth retrying', async () => {
    process.env.RESEND_API_KEY = 're_unit_test_key';
    resendStatus = 403;
    expect(await sendEmail({ to: 'a@b.test', subject: 's', text: 't' })).toMatchObject({
      sent: false,
      permanent: true,
    });
    resendStatus = 502;
    expect(await sendEmail({ to: 'a@b.test', subject: 's', text: 't' })).toMatchObject({
      sent: false,
      permanent: false,
    });
  });

  it('never puts the API key in the outcome it returns', async () => {
    resendStatus = 401;
    const result = await sendEmail({ to: 'a@b.test', subject: 's', text: 't' });
    expect(JSON.stringify(result)).not.toContain('re_unit_test_key');
  });
});
