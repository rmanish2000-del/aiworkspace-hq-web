/**
 * POST /api/plan-request — scoped-plan form.
 *
 * Validates the body, applies a best-effort in-memory rate limit, and delivers
 * the request to founder@aiworkspacehq.com when RESEND_API_KEY is set. When no
 * mailer is configured, or the mailer refuses the message, the request is
 * written to the function log and the caller still receives 200. The API key
 * is read from the environment and is never written into source or logs.
 *
 * The rate limit is per warm instance, same as the checkout guard.
 */

import { createRateLimiter, clientIp, isSameOrigin } from "@/lib/checkout-guard.server";
import { EMAIL } from "@/content/caid";

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const MAX_BODY = 16_384;

export type PlanRequest = {
  name: string;
  email: string;
  organisation: string;
  weeklyWork: string;
  whoDoesIt: string;
  better: string;
};

export type PlanResult<T> = { ok: true; value: T } | { ok: false; status: number; error: string };

type MailEnv = { RESEND_API_KEY?: string; RESEND_FROM?: string };

export const planIpLimiter = createRateLimiter(5, 15 * 60_000);

function textField(
  value: unknown,
  max: number,
  label: string,
  required: boolean,
): PlanResult<string> {
  if (value == null || value === "") {
    if (required) return { ok: false, status: 400, error: `${label} is required` };
    return { ok: true, value: "" };
  }
  if (typeof value !== "string") return { ok: false, status: 400, error: `${label} must be text` };
  const trimmed = value.trim();
  if (required && trimmed.length < 2)
    return { ok: false, status: 400, error: `${label} is required` };
  if (trimmed.length > max) return { ok: false, status: 400, error: `${label} is too long` };
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(trimmed)) {
    return { ok: false, status: 400, error: `${label} contains characters we cannot accept` };
  }
  return { ok: true, value: trimmed };
}

export function validatePlanBody(body: unknown): PlanResult<PlanRequest> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400, error: "request body is required" };
  }
  const record = body as Record<string, unknown>;
  const name = textField(record["name"], 100, "name", true);
  if (!name.ok) return name;
  if (/[\r\n]/.test(name.value)) {
    return { ok: false, status: 400, error: "name contains characters we cannot accept" };
  }
  const emailRaw = record["email"];
  if (typeof emailRaw !== "string" || emailRaw.length > 254 || !EMAIL_RE.test(emailRaw.trim())) {
    return { ok: false, status: 400, error: "a valid email is required" };
  }
  const organisation = textField(record["organisation"], 200, "organisation", false);
  if (!organisation.ok) return organisation;
  const weeklyWork = textField(record["weeklyWork"], 4000, "weekly work", false);
  if (!weeklyWork.ok) return weeklyWork;
  const whoDoesIt = textField(record["whoDoesIt"], 4000, "who does it today", false);
  if (!whoDoesIt.ok) return whoDoesIt;
  const better = textField(record["better"], 4000, "what better looks like", false);
  if (!better.ok) return better;
  return {
    ok: true,
    value: {
      name: name.value,
      email: emailRaw.trim().toLowerCase(),
      organisation: organisation.value,
      weeklyWork: weeklyWork.value,
      whoDoesIt: whoDoesIt.value,
      better: better.value,
    },
  };
}

export function formatPlanMessage(value: PlanRequest): string {
  return [
    `Name: ${value.name}`,
    `Email: ${value.email}`,
    `Organisation: ${value.organisation || "—"}`,
    `What kind of work repeats every week: ${value.weeklyWork || "—"}`,
    `Who does it today: ${value.whoDoesIt || "—"}`,
    `What would better look like: ${value.better || "—"}`,
  ].join("\n");
}

function readMailEnv(source: NodeJS.ProcessEnv = process.env): MailEnv {
  const env: MailEnv = {};
  const key = source["RESEND_API_KEY"]?.trim();
  const from = source["RESEND_FROM"]?.trim();
  if (key) env.RESEND_API_KEY = key;
  if (from) env.RESEND_FROM = from;
  return env;
}

function storePlanRequest(value: PlanRequest, reason: string) {
  console.info(
    JSON.stringify({
      event: "plan-request",
      stored: true,
      reason,
      at: new Date().toISOString(),
      ...value,
    }),
  );
}

/** Send via Resend when configured. Otherwise log the request and report it stored. */
export async function deliverPlanRequest(
  value: PlanRequest,
  deps: { env?: MailEnv; fetchImpl?: typeof fetch } = {},
): Promise<"email" | "logged"> {
  const env = deps.env ?? readMailEnv();
  const fetchImpl = deps.fetchImpl ?? fetch;
  const key = env.RESEND_API_KEY;
  if (!key) {
    storePlanRequest(value, "no-mailer");
    return "logged";
  }

  // Primary sender first; if Resend refuses it (e.g. domain not verified yet),
  // retry once from Resend's shared sender, which delivers to the account owner.
  const attempts = [
    { from: env.RESEND_FROM || `AI Workspace <${EMAIL}>`, to: EMAIL },
    { from: "AI Workspace <onboarding@resend.dev>", to: "rmanish2000@gmail.com" },
  ];
  let lastReason = "mailer-unknown";
  for (const { from, to } of attempts) {
    try {
      const response = await fetchImpl("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: value.email,
          subject: `Scoped plan request — ${value.name}`,
          text: formatPlanMessage(value),
        }),
      });
      if (response.ok) return "email";
      let detail = "";
      try {
        const body = (await response.json()) as { name?: string; message?: string };
        detail = `${body.name ?? ""} ${body.message ?? ""}`.trim().slice(0, 200);
      } catch {
        /* ignore */
      }
      console.error(
        "plan-request: mailer returned",
        response.status,
        from.includes("resend.dev") ? "fallback" : "primary",
        detail,
      );
      lastReason = `mailer-${response.status}`;
    } catch (error) {
      console.error("plan-request: mailer threw", error instanceof Error ? error.name : "error");
      lastReason = "mailer-threw";
    }
  }
  storePlanRequest(value, lastReason);
  return "logged";
}

export async function handlePlanRequest(
  request: Request,
  options: {
    limits?: { ip: ReturnType<typeof createRateLimiter> };
    deliver?: (value: PlanRequest) => Promise<"email" | "logged">;
  } = {},
): Promise<Response> {
  const limits = options.limits ?? { ip: planIpLimiter };
  const deliver = options.deliver ?? deliverPlanRequest;

  if (!isSameOrigin(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return Response.json({ error: "expected application/json" }, { status: 415 });
  }
  if (!limits.ip.hit(`plan:${clientIp(request)}`)) {
    return Response.json({ error: "too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) {
      return Response.json({ error: "request too large" }, { status: 413 });
    }
    body = text ? JSON.parse(text) : null;
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  const checked = validatePlanBody(body);
  if (!checked.ok) return Response.json({ error: checked.error }, { status: checked.status });

  const delivery = await deliver(checked.value);
  return Response.json({ ok: true, delivery });
}
