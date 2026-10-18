import { describe, expect, test, afterEach, mock } from "bun:test";

import {
  createRateLimiter,
  guardCreateSubscription,
  validateBody,
} from "../src/lib/checkout-guard.server";

const good = { plan: "warrant-guardian-monthly", email: "a@b.co", name: "Asha" };

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://aiworkspacehq.com/api/razorpay/create-subscription", {
    method: "POST",
    headers: {
      host: "aiworkspacehq.com",
      origin: "https://aiworkspacehq.com",
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.7",
      ...headers,
    },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
}
const fresh = () => ({ ip: createRateLimiter(5, 60_000), email: createRateLimiter(3, 60_000) });

describe("validateBody", () => {
  test("rejects empty / missing", () => {
    expect(validateBody(null).ok).toBe(false);
    expect(validateBody({}).ok).toBe(false);
    expect(validateBody([]).ok).toBe(false);
  });
  test("rejects unknown plan, bad email, missing name", () => {
    expect(validateBody({ ...good, plan: "free" }).ok).toBe(false);
    expect(validateBody({ ...good, email: "nope" }).ok).toBe(false);
    expect(validateBody({ ...good, name: "" }).ok).toBe(false);
  });
  test("accepts a valid body and normalises email", () => {
    const r = validateBody({ ...good, email: " A@B.CO " });
    expect(r.ok && r.value.email).toBe("a@b.co");
  });
});

describe("guardCreateSubscription", () => {
  test("empty POST ({}) is rejected with 400", async () => {
    const r = await guardCreateSubscription(req({}), fresh());
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(400);
  });
  test("no body is rejected", async () => {
    const r = await guardCreateSubscription(req(undefined), fresh());
    expect(r.ok === false && r.status).toBe(400);
  });
  test("cross-origin or missing origin is 403", async () => {
    expect(
      (await guardCreateSubscription(req(good, { origin: "https://evil.example" }), fresh())).ok,
    ).toBe(false);
    const r = new Request("https://aiworkspacehq.com/x", {
      method: "POST",
      headers: { host: "aiworkspacehq.com", "content-type": "application/json" },
      body: JSON.stringify(good),
    });
    const g = await guardCreateSubscription(r, fresh());
    expect(g.ok === false && g.status).toBe(403);
  });
  test("non-JSON is 415, bad JSON is 400", async () => {
    const a = await guardCreateSubscription(req(good, { "content-type": "text/plain" }), fresh());
    expect(a.ok === false && a.status).toBe(415);
    const b = await guardCreateSubscription(req("{oops"), fresh());
    expect(b.ok === false && b.status).toBe(400);
  });
  test("valid request passes", async () => {
    expect((await guardCreateSubscription(req(good), fresh())).ok).toBe(true);
  });
  test("per-IP rate limit returns 429", async () => {
    const limits = fresh();
    for (let i = 0; i < 5; i++) {
      await guardCreateSubscription(req({ ...good, email: `u${i}@b.co` }), limits);
    }
    const r = await guardCreateSubscription(req({ ...good, email: "z@b.co" }), limits);
    expect(r.ok === false && r.status).toBe(429);
  });
  test("per-email rate limit returns 429", async () => {
    const limits = fresh();
    for (let i = 0; i < 3; i++) {
      await guardCreateSubscription(req(good, { "x-forwarded-for": `198.51.100.${i}` }), limits);
    }
    const r = await guardCreateSubscription(
      req(good, { "x-forwarded-for": "198.51.100.99" }),
      limits,
    );
    expect(r.ok === false && r.status).toBe(429);
  });
  test("rate window resets", () => {
    let t = 0;
    const l = createRateLimiter(1, 1000, () => t);
    expect(l.hit("k")).toBe(true);
    expect(l.hit("k")).toBe(false);
    t = 1001;
    expect(l.hit("k")).toBe(true);
  });
});

describe("route handler", () => {
  const realFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = realFetch;
  });
  test("empty POST never reaches Razorpay", async () => {
    process.env.RAZORPAY_KEY_ID = "rzp_test_dummy";
    process.env.RAZORPAY_KEY_SECRET = "dummy";
    const spy = mock(async () => new Response("{}"));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.fetch = spy as any;
    const { Route } = await import("../src/routes/api/razorpay/create-subscription");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const post = (Route as any).options.server.handlers.POST;
    const res: Response = await post({ request: req({}) });
    expect(res.status).toBe(400);
    expect(spy).not.toHaveBeenCalled();
  });
});
