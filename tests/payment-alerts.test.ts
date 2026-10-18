import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import {
  DEFAULT_MAIL_FROM,
  DEFAULT_OPS_EMAIL,
  opsRecipient,
  sender,
} from "../src/lib/email.server";
import { handleRazorpayWebhook } from "../src/routes/api/razorpay/webhook";

const WEBHOOK_SECRET = "whsec_test_only";
const RESEND_KEY = "re_test_placeholder";

type SentMail = {
  from: string;
  to: string[];
  subject: string;
  authorization: string | null;
  idempotencyKey: string | null;
};

let sent: SentMail[] = [];
let notes: Map<string, Record<string, string>> = new Map();
let resendMode: "ok" | "throw" = "ok";
const realFetch = globalThis.fetch;

function sign(raw: string): string {
  return createHmac("sha256", WEBHOOK_SECRET).update(raw).digest("hex");
}

function capturedEvent(paymentId: string, eventName: string) {
  return {
    event: eventName,
    payload: {
      payment: {
        entity: {
          id: paymentId,
          status: "captured",
          email: "buyer@example.com",
          amount: 99900,
          currency: "INR",
          contact: "+910000000000",
          created_at: 1_720_000_000,
          subscription_id: "sub_Test123",
        },
      },
      subscription: { entity: { id: "sub_Test123" } },
    },
  };
}

function webhookRequest(body: unknown, signature?: string): Request {
  const raw = JSON.stringify(body);
  return new Request("https://aiworkspacehq.com/api/razorpay/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-razorpay-signature": signature ?? sign(raw),
    },
    body: raw,
  });
}

function installFetch(): void {
  sent = [];
  notes = new Map();
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url === "https://api.resend.com/emails") {
      if (resendMode === "throw") throw new Error("resend down");
      const body = JSON.parse(String(init?.body)) as {
        from: string;
        to: string[];
        subject: string;
      };
      const headers = new Headers(init?.headers);
      sent.push({
        from: body.from,
        to: body.to,
        subject: body.subject,
        authorization: headers.get("authorization"),
        idempotencyKey: headers.get("Idempotency-Key"),
      });
      return new Response(JSON.stringify({ id: "email_test" }), { status: 200 });
    }

    const paymentMatch = url.match(/\/payments\/(pay_[A-Za-z0-9]+)/);
    if (paymentMatch) {
      const id = paymentMatch[1]!;
      if ((init?.method ?? "GET").toUpperCase() === "PATCH") {
        const body = JSON.parse(String(init?.body)) as { notes?: Record<string, string> };
        notes.set(id, { ...(notes.get(id) ?? {}), ...(body.notes ?? {}) });
      }
      return new Response(JSON.stringify({ id, notes: notes.get(id) ?? {} }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response("unexpected fetch", { status: 500 });
  }) as typeof fetch;
}

beforeEach(() => {
  process.env["RAZORPAY_WEBHOOK_SECRET"] = WEBHOOK_SECRET;
  process.env["RAZORPAY_KEY_ID"] = "rzp_test_dummy";
  process.env["RAZORPAY_KEY_SECRET"] = "dummy_secret";
  process.env["RESEND_API_KEY"] = RESEND_KEY;
  delete process.env["OPS_EMAIL"];
  delete process.env["MAIL_FROM"];
  resendMode = "ok";
  installFetch();
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("payment alert emails", () => {
  test("buyer and admin both sent", async () => {
    const cases = [
      ["payment.captured", "pay_Captured1"],
      ["subscription.charged", "pay_Charged1"],
      ["subscription.activated", "pay_Activated1"],
    ] as const;

    for (const [eventName, paymentId] of cases) {
      const response = await handleRazorpayWebhook(
        webhookRequest(capturedEvent(paymentId, eventName)),
      );
      expect(response.status).toBe(200);
    }

    expect(sent).toHaveLength(6);
    for (const [, paymentId] of cases) {
      const mails = sent.filter(
        (mail) => mail.idempotencyKey === paymentId || mail.idempotencyKey === `${paymentId}:ops`,
      );
      expect(mails.map((mail) => mail.to[0])).toEqual(["buyer@example.com", DEFAULT_OPS_EMAIL]);
      expect(mails.every((mail) => mail.from === DEFAULT_MAIL_FROM)).toBe(true);
      expect(mails.every((mail) => mail.authorization === `Bearer ${RESEND_KEY}`)).toBe(true);
      expect(mails[0]?.subject).toContain("payment received");
      expect(mails[1]?.subject).toContain("buyer@example.com");
    }
    expect(opsRecipient()).toBe(DEFAULT_OPS_EMAIL);
    expect(sender()).toBe(DEFAULT_MAIL_FROM);
  });

  test("no send on bad signature", async () => {
    let calls = 0;
    globalThis.fetch = (async () => {
      calls += 1;
      throw new Error("fetch should not be called");
    }) as typeof fetch;

    const response = await handleRazorpayWebhook(
      webhookRequest(capturedEvent("pay_BadSig1", "subscription.charged"), "a".repeat(64)),
    );
    expect(response.status).toBe(400);
    expect(calls).toBe(0);
    const payload = (await response.json()) as { error?: string };
    expect(payload.error).toBe("invalid signature");
  });

  test("no duplicate on replay", async () => {
    const body = capturedEvent("pay_Replay1", "subscription.charged");
    const first = await handleRazorpayWebhook(webhookRequest(body));
    const second = await handleRazorpayWebhook(webhookRequest(body));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(sent).toHaveLength(2);
    expect(sent.map((mail) => mail.to[0])).toEqual(["buyer@example.com", DEFAULT_OPS_EMAIL]);
    expect(notes.get("pay_Replay1")?.["aiwhq_welcome"]).toBe("sent");
    expect(notes.get("pay_Replay1")?.["aiwhq_alert"]).toBe("sent");
  });

  test("email failure does not fail the webhook", async () => {
    resendMode = "throw";
    const errors: string[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => {
      errors.push(args.map((part) => String(part)).join(" "));
    };
    try {
      const response = await handleRazorpayWebhook(
        webhookRequest(capturedEvent("pay_Fail1", "payment.captured")),
      );
      expect(response.status).toBe(200);
      expect(((await response.json()) as { ok?: boolean }).ok).toBe(true);
      expect(sent).toHaveLength(0);
      expect(errors.some((line) => line.includes("buyer email NOT sent"))).toBe(true);
      expect(errors.some((line) => line.includes("admin email NOT sent"))).toBe(true);
    } finally {
      console.error = original;
    }
  });

  test("OPS_EMAIL overrides the admin recipient", async () => {
    process.env["OPS_EMAIL"] = "ops@example.com";
    const response = await handleRazorpayWebhook(
      webhookRequest(capturedEvent("pay_OpsOverride1", "subscription.charged")),
    );
    expect(response.status).toBe(200);
    expect(sent.map((mail) => mail.to[0])).toEqual(["buyer@example.com", "ops@example.com"]);
  });
});
