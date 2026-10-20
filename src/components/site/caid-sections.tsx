import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  audiences,
  close,
  digital,
  exampleLedger,
  ownSystems,
  phases,
  PLAN_HREF,
  promises,
  services,
  servicesNote,
} from "@/content/caid";

/* ------------------------------------------------------------------ */
/* Building blocks for the CAID pages. Quiet layout; the receipt is    */
/* the one loud object.                                                */
/* ------------------------------------------------------------------ */

export function PrimaryAction(props: {
  href: string;
  children: ReactNode;
  className?: string;
  cta?: "hero" | "footer";
}) {
  const ctaProps = props.cta ? { "data-cta": props.cta } : {};
  return (
    <a
      href={props.href}
      {...ctaProps}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-6 text-[0.9875rem] font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
        props.className,
      )}
    >
      {props.children}
    </a>
  );
}

export function SecondaryAction(props: { to: string; children: ReactNode }) {
  return (
    <Link
      to={props.to as "/"}
      className="inline-flex min-h-12 items-center justify-center rounded-md border border-border bg-background px-6 text-[0.9875rem] font-semibold text-ink transition-colors hover:bg-accent"
    >
      {props.children}
    </Link>
  );
}

export function Band(props: {
  id?: string;
  tone?: "paper" | "plain";
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={props.id}
      className={cn(
        "border-t border-border",
        props.tone === "paper" && "bg-paper",
        props.className,
      )}
    >
      <div className="container-site py-16 md:py-24">{props.children}</div>
    </section>
  );
}

export function BandHead(props: { title: ReactNode; lead?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <h2 className="h2 text-ink">{props.title}</h2>
      {props.lead ? <p className="lead mt-4">{props.lead}</p> : null}
    </div>
  );
}

const stampFor = { done: "Checked", now: "In progress", next: "Next" } as const;

export function ReceiptLedger() {
  return (
    <figure
      aria-label={`${exampleLedger.title}: ${exampleLedger.org}`}
      className="receipt px-5 pb-3 pt-0 md:px-6"
    >
      <figcaption className="flex h-11 items-center justify-between gap-3">
        <span className="shrink-0 whitespace-nowrap font-display text-[0.9375rem] font-semibold text-ink">
          {exampleLedger.title}
        </span>
        <span className="min-w-0 truncate text-xs text-muted-foreground">{exampleLedger.org}</span>
      </figcaption>
      <ol>
        {exampleLedger.rows.map((r, i) => (
          <li key={r.step} className="grid h-11 grid-cols-[2rem_1fr_auto] items-center gap-3">
            <span className="font-display text-sm font-semibold tabular-nums text-muted-foreground">
              {r.step}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.9375rem] font-semibold leading-tight text-foreground">
                {r.name}
              </span>
              <span className="block truncate text-xs leading-tight text-muted-foreground">
                {r.receipt}
              </span>
            </span>
            <span
              className={cn(
                "stamp stamp-in",
                r.state === "now" && "stamp-now",
                r.state === "next" && "stamp-next",
              )}
              style={{ animationDelay: `${300 + i * 140}ms` }}
            >
              {stampFor[r.state]}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function Audiences() {
  return (
    <ul className="mt-10 grid gap-x-10 border-t border-border md:grid-cols-2">
      {audiences.map((a) => (
        <li key={a.who} className="border-b border-border py-5">
          <p className="font-display text-lg font-semibold text-ink">{a.who}</p>
          <p className="mt-1 text-muted-foreground">Typical first job: {a.job}</p>
        </li>
      ))}
    </ul>
  );
}

export function PhaseOverview() {
  return (
    <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
      {phases.map((p) => (
        <li key={p.name} className="bg-card p-6">
          <p className="font-display text-xl font-semibold text-ink">{p.name}</p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">{p.why}</p>
          <ol className="mt-5 space-y-2">
            {p.stages.map((s) => (
              <li key={s.n} className="flex gap-3 text-[0.9375rem]">
                <span className="w-6 shrink-0 font-display font-semibold tabular-nums text-[var(--color-verified)]">
                  {s.n}
                </span>
                <span>{s.name}</span>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}

export function ProcessDetail() {
  return (
    <div className="mt-12 space-y-16">
      {phases.map((p) => (
        <section key={p.name} aria-labelledby={`phase-${p.name}`}>
          <div className="grid gap-4 md:grid-cols-[14rem_1fr] md:gap-10">
            <div>
              <h2 id={`phase-${p.name}`} className="h3 text-ink">
                {p.name}
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">{p.why}</p>
            </div>
            <ol className="border-t border-border">
              {p.stages.map((s) => (
                <li
                  key={s.n}
                  className="grid gap-3 border-b border-border py-6 sm:grid-cols-[3rem_1fr]"
                >
                  <span className="font-display text-2xl font-semibold tabular-nums text-[var(--color-verified)]">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{s.name}</h3>
                    <p className="mt-1.5 leading-relaxed text-muted-foreground">{s.we}</p>
                    <p className="mt-3 inline-flex items-start gap-2 rounded-md bg-paper px-3 py-2 text-[0.9375rem]">
                      <span className="stamp shrink-0 text-[0.6875rem]">Receipt</span>
                      <span className="text-foreground">{s.you}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}
    </div>
  );
}

export function ServiceList(props: { compact?: boolean }) {
  return (
    <>
      <ol className="mt-12 grid gap-6 md:grid-cols-2">
        {services.map((s, i) => (
          <li key={s.name} className="relative rounded-lg border border-border bg-card p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-2xl font-semibold text-ink">
                <span className="mr-3 tabular-nums text-muted-foreground">{i + 1}</span>
                {s.name}
              </h3>
              <span className="shrink-0 text-sm font-semibold text-[var(--color-verified)]">
                {s.covers}
              </span>
            </div>
            <p className="mt-4 leading-relaxed text-muted-foreground">{s.what}</p>
            {props.compact ? null : (
              <p className="mt-5 border-t border-border pt-4 text-[0.9375rem] text-foreground">
                <span className="font-semibold">At the end: </span>
                {s.end}
              </p>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-2xl text-[0.9375rem] text-muted-foreground">{servicesNote}</p>
    </>
  );
}

export function Promises() {
  return (
    <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
      {promises.map((p) => (
        <div key={p.title} className="border-l-2 border-[var(--color-verified)] pl-5">
          <dt className="font-display text-lg font-semibold text-ink">{p.title}</dt>
          <dd className="mt-2 leading-relaxed text-muted-foreground">{p.body}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DigitalFlow() {
  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-start">
      <BandHead title={digital.title} lead={digital.lead} />
      <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {digital.items.map((d, i) => (
          <li key={d.name} className="bg-card p-5">
            <p className="font-display text-sm font-semibold tabular-nums text-[var(--color-verified)]">
              {i + 1}
            </p>
            <p className="mt-1 font-semibold text-foreground">{d.name}</p>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">{d.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

const statusTone: Record<string, string> = {
  Live: "stamp",
  "Pilot preparation": "stamp stamp-now",
  "Internal only": "stamp stamp-next",
  Prototype: "stamp stamp-next",
};

export function OwnSystems() {
  return (
    <>
      <BandHead title={ownSystems.title} lead={ownSystems.lead} />
      <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
        {ownSystems.items.map((s) => (
          <li key={s.name} className="flex flex-col bg-card p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="font-display text-xl font-semibold text-ink">{s.name}</p>
              <span className={cn(statusTone[s.status] ?? "stamp stamp-next")}>{s.status}</span>
            </div>
            <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export function CloseBand() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-site grid gap-8 py-16 md:grid-cols-[1.4fr_1fr] md:items-end md:py-20">
        <div>
          <h2 className="h2">{close.title}</h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed opacity-85">{close.lead}</p>
        </div>
        <div className="md:text-right">
          <a
            href={PLAN_HREF}
            data-cta="footer"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary-foreground px-6 font-semibold text-primary transition-opacity hover:opacity-90"
          >
            {close.primary}
          </a>
        </div>
      </div>
    </section>
  );
}
