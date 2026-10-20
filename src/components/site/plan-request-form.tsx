import { useState, type FormEvent } from "react";
import { EMAIL, planQuestions } from "@/content/caid";
import { EmailCopy } from "@/components/site/email-link";

type Status = "idle" | "loading" | "success" | "error";

type Fields = {
  name: string;
  email: string;
  organisation: string;
  weeklyWork: string;
  whoDoesIt: string;
  better: string;
};

const EMPTY: Fields = {
  name: "",
  email: "",
  organisation: "",
  weeklyWork: "",
  whoDoesIt: "",
  better: "",
};

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

const inputClass = "mt-1 w-full rounded-md border border-border bg-background px-3 py-2";

function fieldError(fields: Fields): string | null {
  if (fields.name.trim().length < 2) return "Enter your name.";
  if (!EMAIL_RE.test(fields.email.trim())) return "Enter an email address in the format name@example.com.";
  return null;
}

export function PlanRequestForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = fieldError(fields);
    if (problem) {
      setStatus("error");
      setMessage(`${problem} Or email ${EMAIL}.`);
      return;
    }

    setStatus("loading");
    setMessage("Sending your request…");
    try {
      const response = await fetch("/api/plan-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          organisation: fields.organisation.trim(),
          weeklyWork: fields.weeklyWork.trim(),
          whoDoesIt: fields.whoDoesIt.trim(),
          better: fields.better.trim(),
        }),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !payload?.ok) {
        setStatus("error");
        setMessage(
          `We could not send your request${payload?.error ? ` (${payload.error})` : ""}. Email ${EMAIL} and we will reply.`,
        );
        return;
      }
      setStatus("success");
      setMessage(`Received. We will reply to you at ${fields.email.trim()}.`);
    } catch {
      setStatus("error");
      setMessage(`We could not send your request. Email ${EMAIL} and we will reply.`);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-2xl" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm" htmlFor="plan-name">
          <span className="text-foreground">Name</span>
          <input
            id="plan-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            value={fields.name}
            disabled={status === "loading" || status === "success"}
            onChange={(event) => set("name", event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="text-sm" htmlFor="plan-email">
          <span className="text-foreground">Email</span>
          <input
            id="plan-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={fields.email}
            disabled={status === "loading" || status === "success"}
            onChange={(event) => set("email", event.target.value)}
            className={inputClass}
          />
        </label>
      </div>
      <label className="mt-4 block text-sm" htmlFor="plan-organisation">
        <span className="text-foreground">Organisation</span>
        <input
          id="plan-organisation"
          name="organisation"
          type="text"
          autoComplete="organization"
          maxLength={200}
          value={fields.organisation}
          disabled={status === "loading" || status === "success"}
          onChange={(event) => set("organisation", event.target.value)}
          className={inputClass}
        />
      </label>
      <div className="mt-4 grid gap-4">
        {planQuestions.map((question) => (
          <label key={question.name} className="block text-sm" htmlFor={`plan-${question.name}`}>
            <span className="text-foreground">{question.label}</span>
            <textarea
              id={`plan-${question.name}`}
              name={question.name}
              rows={3}
              maxLength={4000}
              value={fields[question.name]}
              disabled={status === "loading" || status === "success"}
              onChange={(event) => set(question.name, event.target.value)}
              className={`${inputClass} min-h-24`}
            />
          </label>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-start gap-4">
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Send the request"}
        </button>
        <EmailCopy lead="or email" />
      </div>
      <p
        role={status === "error" ? "alert" : "status"}
        aria-live="polite"
        className={`mt-4 min-h-6 text-sm ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}
      >
        {message}
      </p>
    </form>
  );
}
