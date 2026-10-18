/**
 * Request guards for POST /api/razorpay/create-subscription.
 *
 * Security fix (3 Sep 2026 audit): the endpoint accepted an empty POST from
 * anyone and created a live Razorpay subscription. The site has no user
 * accounts, so "authentication" here means: the request must come from this
 * site's own checkout page (same-origin), carry a JSON body naming an
 * allow-listed plan and a buyer identity, and stay under a per-IP and
 * per-email rate limit.
 *
 * Rate limiting is an in-memory fixed window. On Vercel serverless each warm
 * instance keeps its own counters, so this is best-effort; move it to a shared
 * store (Upstash/Vercel KV) if abuse continues.
 */

export const ALLOWED_PLANS = ["warrant-guardian-monthly"] as const;
export type AllowedPlan = (typeof ALLOWED_PLANS)[number];

export type CheckoutRequest = { plan: AllowedPlan; email: string; name: string };

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

export type GuardResult<T> = { ok: true; value: T } | { ok: false; status: number; error: string };

export function validateBody(body: unknown): GuardResult<CheckoutRequest> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400, error: "request body is required" };
  }
  const { plan, email, name } = body as Record<string, unknown>;
  if (typeof plan !== "string" || !(ALLOWED_PLANS as readonly string[]).includes(plan)) {
    return { ok: false, status: 400, error: "unknown plan" };
  }
  if (typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email.trim())) {
    return { ok: false, status: 400, error: "a valid email is required" };
  }
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
    return { ok: false, status: 400, error: "name is required" };
  }
  return {
    ok: true,
    value: { plan: plan as AllowedPlan, email: email.trim().toLowerCase(), name: name.trim() },
  };
}

/** Only this site's own pages may start a checkout. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

type Window = { count: number; resetAt: number };

export function createRateLimiter(limit: number, windowMs: number, now: () => number = Date.now) {
  const buckets = new Map<string, Window>();
  return {
    /** Returns true when the call is allowed. */
    hit(key: string): boolean {
      const t = now();
      if (buckets.size > 10_000) {
        for (const [k, w] of buckets) if (w.resetAt <= t) buckets.delete(k);
      }
      const w = buckets.get(key);
      if (!w || w.resetAt <= t) {
        buckets.set(key, { count: 1, resetAt: t + windowMs });
        return true;
      }
      w.count += 1;
      return w.count <= limit;
    },
  };
}

/** 5 checkout starts per IP and 3 per email per 15 minutes. */
export const ipLimiter = createRateLimiter(5, 15 * 60_000);
export const emailLimiter = createRateLimiter(3, 15 * 60_000);

export async function guardCreateSubscription(
  request: Request,
  limits = { ip: ipLimiter, email: emailLimiter },
): Promise<GuardResult<CheckoutRequest>> {
  if (!isSameOrigin(request)) return { ok: false, status: 403, error: "forbidden" };
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return { ok: false, status: 415, error: "expected application/json" };
  }
  if (!limits.ip.hit(`ip:${clientIp(request)}`)) {
    return { ok: false, status: 429, error: "too many requests" };
  }
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 2048) return { ok: false, status: 413, error: "request too large" };
    body = text ? JSON.parse(text) : null;
  } catch {
    return { ok: false, status: 400, error: "invalid JSON" };
  }
  const checked = validateBody(body);
  if (!checked.ok) return checked;
  if (!limits.email.hit(`email:${checked.value.email}`)) {
    return { ok: false, status: 429, error: "too many requests" };
  }
  return checked;
}
