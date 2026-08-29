import { useEffect, useState } from "react";
import {
  ShieldCheck,
  GitBranch,
  UserCheck,
  FileCheck2,
  ScrollText,
  Unplug,
  Search,
  PlayCircle,
  BadgeCheck,
  Eye,
  CheckCircle2,
  Link2Off,
  GaugeCircle,
  FileQuestion,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/site/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Enterprise trust strip                                              */
/* ------------------------------------------------------------------ */

const trustSignals: { icon: LucideIcon; label: string }[] = [
  { icon: ShieldCheck, label: "Governance First" },
  { icon: GitBranch, label: "Provenance Tracking" },
  { icon: UserCheck, label: "Human Authorization" },
  { icon: FileCheck2, label: "Verifiable Evidence" },
  { icon: ScrollText, label: "Audit Ready" },
];

export function TrustStrip() {
  return (
    <section aria-label="Enterprise trust signals" className="border-y border-border bg-muted/40">
      <ul className="container-site grid grid-cols-2 gap-x-6 gap-y-4 py-6 sm:grid-cols-3 lg:grid-cols-5">
        {trustSignals.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5">
            <s.icon className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="text-[0.8125rem] font-medium tracking-tight text-foreground">
              {s.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Enterprise problem cards                                            */
/* ------------------------------------------------------------------ */

const problems: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Link2Off,
    title: "Context Loses Source",
    body: "Answers arrive without the document, version, or permission that produced them, so nobody can defend the result later.",
  },
  {
    icon: GaugeCircle,
    title: "Automation Outruns Policy",
    body: "Agents act faster than approval paths can keep up, and policy becomes a document instead of an enforced control.",
  },
  {
    icon: FileQuestion,
    title: "Results Lack Evidence",
    body: "Output looks finished but carries no verification record, so review teams re-do the work to trust it.",
  },
];

export function ProblemCards() {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-3">
      {problems.map((p, i) => (
        <Reveal key={p.title} delay={i * 70}>
          <article className="h-full rounded-xl border border-border bg-card p-6 transition-colors duration-200 hover:border-primary/40">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <p.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-5 text-base font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Operating layer journey                                             */
/* ------------------------------------------------------------------ */

const journey: { icon: LucideIcon; step: string; title: string; body: string }[] = [
  { icon: Unplug, step: "01", title: "Connect", body: "Approved systems and permissions are attached to the workspace." },
  { icon: Search, step: "02", title: "Retrieve", body: "Context is pulled with its source, version, and access scope intact." },
  { icon: PlayCircle, step: "03", title: "Execute", body: "Assignments run inside policy, not beside it." },
  { icon: BadgeCheck, step: "04", title: "Verify", body: "Every result is checked against the evidence that produced it." },
  { icon: Eye, step: "05", title: "Review", body: "Humans see the claim and the proof in the same view." },
  { icon: CheckCircle2, step: "06", title: "Approve", body: "A named person authorises the outcome and the record is sealed." },
];

export function OperatingLayerJourney() {
  const [active, setActive] = useState(0);
  const current = journey[active] ?? journey[0]!;

  return (
    <div className="mt-10">
      <ol className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {journey.map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-current={active === i}
              className={cn(
                "flex min-h-11 w-full flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors duration-200",
                active === i
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              <span className="flex w-full items-center justify-between">
                <s.icon
                  className={cn("size-5", active === i ? "text-primary" : "text-muted-foreground")}
                  aria-hidden
                />
                <span className="font-mono text-[0.625rem] text-muted-foreground">{s.step}</span>
              </span>
              <span className="text-sm font-semibold tracking-tight">{s.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <p
        aria-live="polite"
        className="mt-5 rounded-xl border border-border bg-muted/40 p-5 text-[0.9375rem] leading-relaxed text-muted-foreground"
      >
        <span className="font-medium text-foreground">{current.title}. </span>
        {current.body}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Interactive workflow demo                                           */
/* ------------------------------------------------------------------ */

const demoStages = [
  {
    title: "Context",
    detail: "3 approved sources attached",
    line: "policy-v7.pdf · supplier-master.csv · q4-ledger.xlsx",
  },
  {
    title: "Assignment",
    detail: "Scope, policy and reviewer bound",
    line: "assignment#4471 · policy: procurement-controls · reviewer: S. Chen",
  },
  {
    title: "Execution",
    detail: "Run inside enforced permissions",
    line: "12 steps executed · 0 out-of-scope calls",
  },
  {
    title: "Verification",
    detail: "Claims matched to evidence",
    line: "18/18 claims traced to source · confidence 96%",
  },
  {
    title: "Human Decision",
    detail: "Named authorisation recorded",
    line: "approved by S. Chen · sealed 12:04 UTC",
  },
];

export function WorkflowDemo() {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const t = setTimeout(() => setStage((s) => (s + 1) % demoStages.length), 2600);
    return () => clearTimeout(t);
  }, [stage, playing]);

  return (
    <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/50 px-4 py-3">
        <p className="eyebrow">Workflow walkthrough</p>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex min-h-11 items-center rounded-md border border-border bg-background px-3 text-xs font-medium hover:bg-accent"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <ol className="grid gap-px bg-border md:grid-cols-5">
        {demoStages.map((s, i) => {
          const state = i < stage ? "done" : i === stage ? "active" : "todo";
          return (
            <li key={s.title} className="bg-card">
              <button
                type="button"
                onClick={() => {
                  setStage(i);
                  setPlaying(false);
                }}
                aria-current={state === "active"}
                className="flex min-h-11 w-full flex-col items-start gap-1 p-5 text-left"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 rounded-full transition-colors duration-300",
                      state === "done" && "bg-[var(--color-verified)]",
                      state === "active" && "bg-primary",
                      state === "todo" && "bg-border",
                    )}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      "text-sm font-semibold tracking-tight",
                      state === "todo" && "text-muted-foreground",
                    )}
                  >
                    {s.title}
                  </span>
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">{s.detail}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="border-t border-border px-5 py-4" aria-live="polite">
        <p className="font-mono text-xs leading-relaxed text-muted-foreground">
          <span className="text-[var(--color-verified)]">▸ </span>
          {demoStages[stage]?.line}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Product ecosystem architecture                                      */
/* ------------------------------------------------------------------ */

const ecosystem = [
  { title: "Assignments", body: "Work is scoped, permissioned and traceable before it starts." },
  { title: "Execution", body: "Agent work runs inside enforced enterprise policy." },
  { title: "Verification", body: "Claims are checked against retrieved evidence." },
  { title: "Human Review", body: "Reviewers see claim, source and confidence together." },
  { title: "Enterprise Decision", body: "A named approval seals the accountable record." },
];

export function EcosystemDiagram() {
  return (
    <div className="mt-10">
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
        <p className="eyebrow">Core</p>
        <h3 className="h3 mt-2">AI Workspace Core</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          One operating layer that carries identity, policy, provenance and evidence across every
          module below.
        </p>
      </div>
      <div className="mx-auto h-6 w-px bg-border" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ecosystem.map((m, i) => (
          <Reveal key={m.title} delay={i * 60}>
            <div className="h-full rounded-xl border border-border bg-card p-5">
              <p className="font-mono text-[0.625rem] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h4 className="mt-2 text-sm font-semibold tracking-tight">{m.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Trust presentation                                                  */
/* ------------------------------------------------------------------ */

const trustPillars: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: FileCheck2, title: "Evidence retention", body: "Sources, versions and verification records are retained with the result." },
  { icon: ShieldCheck, title: "Governance workflows", body: "Policy is enforced at execution time, not documented after the fact." },
  { icon: UserCheck, title: "Human authorization", body: "Consequential actions require a named person to authorise them." },
  { icon: ScrollText, title: "Decision accountability", body: "Every approval records who decided, on what evidence, and when." },
  { icon: Eye, title: "Review checkpoints", body: "Work stops at defined checkpoints until review is complete." },
];

export function TrustPillars() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trustPillars.map((p, i) => (
        <Reveal key={p.title} delay={i * 50}>
          <div className="h-full rounded-xl border border-border bg-card p-6">
            <p.icon className="size-5 text-primary" aria-hidden />
            <h3 className="mt-4 text-sm font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
