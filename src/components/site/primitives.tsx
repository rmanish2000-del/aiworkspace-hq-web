import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Hash hrefs bypass typed routes; render a plain anchor for them. */
function isHashHref(to: string) {
  return to.includes("#");
}

function linkClass(variant: "primary" | "secondary", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors duration-150",
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "border border-border bg-background text-foreground hover:bg-accent",
    className,
  );
}

/* ------------------------------------------------------------------ */
/* Shared primitives for the AI Workspace site.                        */
/* ------------------------------------------------------------------ */

export function PageHead(props: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="container-site pt-16 pb-12 md:pt-24 md:pb-16">
      {props.eyebrow ? <p className="eyebrow">{props.eyebrow}</p> : null}
      <h1 className="h1 mt-5 max-w-3xl">{props.title}</h1>
      {props.lead ? <p className="lead mt-6">{props.lead}</p> : null}
      {props.children}
    </header>
  );
}

export function Section(props: {
  id?: string;
  eyebrow?: string;
  heading?: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={props.id} className={cn("hairline-t", props.className)}>
      <div className="container-site py-14 md:py-20">
        {props.eyebrow ? <p className="eyebrow">{props.eyebrow}</p> : null}
        {props.heading ? (
          <h2 className="h2 mt-4 max-w-2xl">{props.heading}</h2>
        ) : null}
        {props.lead ? <p className="lead mt-5">{props.lead}</p> : null}
        {props.children}
      </div>
    </section>
  );
}

type ChipTone = "verified" | "review" | "intent" | "neutral";

const chipDot: Record<ChipTone, string> = {
  verified: "bg-[var(--color-verified)]",
  review: "bg-[var(--color-primary)]",
  intent: "bg-muted-foreground",
  neutral: "bg-muted-foreground",
};

export function StatusChip(props: { tone?: ChipTone; children: ReactNode }) {
  const tone = props.tone ?? "neutral";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-mono text-[0.6875rem] tracking-wide text-muted-foreground">
      <span className={cn("size-1.5 rounded-full", chipDot[tone])} aria-hidden />
      {props.children}
    </span>
  );
}

export function toneForStatus(status: string): ChipTone {
  const s = status.toLowerCase();
  if (s.includes("verified")) return "verified";
  if (s.includes("review") || s.includes("demonstration") || s.includes("reference") || s.includes("sandbox"))
    return "review";
  return "intent";
}

export function ButtonLink(props: {
  to: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const variant = props.variant ?? "primary";
  const cls = linkClass(variant, props.className);
  if (isHashHref(props.to)) {
    return (
      <a href={props.to} className={cls}>
        {props.children}
        <span aria-hidden>→</span>
      </a>
    );
  }
  return (
    <Link to={props.to} className={cls}>
      {props.children}
      <span aria-hidden>→</span>
    </Link>
  );
}

export function ArrowLink(props: { to: string; children: ReactNode; className?: string }) {
  const cls = cn(
    "group inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary",
    props.className,
  );
  const arrow = (
    <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5">
      →
    </span>
  );
  if (isHashHref(props.to)) {
    return (
      <a href={props.to} className={cls}>
        {props.children}
        {arrow}
      </a>
    );
  }
  return (
    <Link to={props.to} className={cls}>
      {props.children}
      {arrow}
    </Link>
  );
}

/** Numbered definition-row list used across ledger-driven pages. */
export function TermList(props: {
  items: { index?: string; title?: string; body: ReactNode; badge?: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn("mt-10 border-t border-border", props.className)}>
      {props.items.map((item, i) => (
        <div
          key={i}
          className="grid gap-2 border-b border-border py-6 md:grid-cols-[3rem_1fr] md:gap-6"
        >
          <span className="font-mono text-xs text-muted-foreground">
            {item.index ?? String(i + 1).padStart(2, "0")}
          </span>
          <div>
            {item.title ? (
              <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
            ) : null}
            <div className={cn("text-[0.9375rem] leading-relaxed text-muted-foreground", item.title && "mt-1.5")}>
              {item.body}
            </div>
            {item.badge ? <div className="mt-3">{item.badge}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Card(props: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-6 md:p-7", props.className)}>
      {props.children}
    </div>
  );
}
