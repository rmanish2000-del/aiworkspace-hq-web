import { afterEach, describe, expect, test } from "bun:test";

import { createRateLimiter } from "../src/lib/checkout-guard.server";
import {
  deliverPlanRequest,
  handlePlanRequest,
  validatePlanBody,
  type PlanRequest,
} from "../src/lib/plan-request.server";

const good: PlanRequest = {
  name: "Asha Patel",
  email: "asha@example.com",
  organisation: "Example CSC",
  weeklyWork: "Status follow-ups",
  whoDoesIt: "The centre operator",
  better: "A written receipt each day",
};

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://aiworkspacehq.com/api/plan-request", {
    method: "POST",
    headers: {
      host: "aiworkspacehq.com",
      origin: "https://aiworkspacehq.com",
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.9",
      ...headers,
    },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
}

const logs: string[] = [];
const originalInfo = console.info;
const originalError = console.error;

afterEach(() => {
  console.info = originalInfo;
  console.error = originalError;
  logs.length = 0;
});

function captureLogs() {
  console.info = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
  console.error = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
}

describe("validatePlanBody", () => {
  test("rejects an empty body, a short name and a bad email", () => {
    expect(validatePlanBody(null).ok).toBe(false);
    expect(validatePlanBody({ ...good, name: "A" }).ok).toBe(false);
    expect(validatePlanBody({ ...good, email: "nope" }).ok).toBe(false);
  });

  test("accepts a valid body and normalises email", () => {
    const result = validatePlanBody({ ...good, email: " Asha@Example.com " });
    expect(result.ok && result.value.email).toBe("asha@example.com");
    expect(result.ok && result.value.organisation).toBe("Example CSC");
  });

  test("allows the three questions to be omitted", () => {
    const result = validatePlanBody({ name: "Asha Patel", email: "asha@example.com" });
    expect(result.ok && result.value.weeklyWork).toBe("");
    expect(result.ok && result.value.whoDoesIt).toBe("");
    expect(result.ok && result.value.better).toBe("");
  });
});

describe("handlePlanRequest", () => {
  test("rejects a cross-site request", async () => {
    const response = await handlePlanRequest(req(good, { origin: "https://evil.example" }), {
      limits: { ip: createRateLimiter(5, 60_000) },
      deliver: async () => "logged",
    });
    expect(response.status).toBe(403);
  });

  test("stores a valid request and returns 200", async () => {
    let received: PlanRequest | undefined;
    const response = await handlePlanRequest(req(good), {
      limits: { ip: createRateLimiter(5, 60_000) },
      deliver: async (value) => {
        received = value;
        return "logged";
      },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, delivery: "logged" });
    expect(received?.email).toBe("asha@example.com");
  });

  test("rate limit returns 429", async () => {
    const limits = { ip: createRateLimiter(1, 60_000) };
    const deliver = async () => "logged" as const;
    expect((await handlePlanRequest(req(good), { limits, deliver })).status).toBe(200);
    const blocked = await handlePlanRequest(req(good), { limits, deliver });
    expect(blocked.status).toBe(429);
  });
});

describe("deliverPlanRequest", () => {
  test("logs the request when no mailer is configured", async () => {
    captureLogs();
    const delivery = await deliverPlanRequest(good, { env: {} });
    expect(delivery).toBe("logged");
    expect(logs.join("\n")).toContain("asha@example.com");
    expect(logs.join("\n")).not.toContain("RESEND_API_KEY");
  });

  test("sends through Resend when a key is configured", async () => {
    let auth = "";
    let payload: { to?: string[]; reply_to?: string } = {};
    const fetchImpl: typeof fetch = async (_input, init) => {
      auth = new Headers(init?.headers).get("authorization") ?? "";
      payload = JSON.parse(String(init?.body)) as { to?: string[]; reply_to?: string };
      return new Response(JSON.stringify({ id: "email_1" }), { status: 200 });
    };
    const delivery = await deliverPlanRequest(good, {
      env: { RESEND_API_KEY: "test-key" },
      fetchImpl,
    });
    expect(delivery).toBe("email");
    expect(auth).toBe("Bearer test-key");
    expect(payload.to).toEqual(["founder@aiworkspacehq.com"]);
    expect(payload.reply_to).toBe("asha@example.com");
  });

  test("logs the request when the mailer refuses it, without the key", async () => {
    captureLogs();
    const fetchImpl: typeof fetch = async () => new Response("no", { status: 403 });
    const delivery = await deliverPlanRequest(good, {
      env: { RESEND_API_KEY: "test-key" },
      fetchImpl,
    });
    expect(delivery).toBe("logged");
    const written = logs.join("\n");
    expect(written).toContain("asha@example.com");
    expect(written).not.toContain("test-key");
  });
});
