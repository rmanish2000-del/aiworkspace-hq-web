import { createFileRoute, Link } from "@tanstack/react-router";
import { experience } from "@/content/copy";
import {
  ArrowLink,
  ButtonLink,
  Card,
  Section,
  StatusChip,
  toneForStatus,
} from "@/components/site/primitives";
import { Reveal } from "@/components/site/motion";
import {
  EcosystemDiagram,
  OperatingLayerJourney,
  ProblemCards,
  TrustPillars,
  TrustStrip,
  WorkflowDemo,
} from "@/components/site/home-sections";

const h = experience.home;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: h.metaTitle },
      { name: "description", content: h.metaDescription },
      { property: "og:title", content: h.metaTitle },
      { property: "og:description", content: h.metaDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const dashboardStats = [
  { label: "Tasks", value: "1,284", delta: "+12" },
  { label: "Approved", value: "1,196", delta: "+9" },
  { label: "Pending", value: "47", delta: "+3" },
  { label: "Avg Conf", value: "93.4%", delta: "+0.8" },
];

const dashboardRows = [
  { task: "Q4 Earnings Summary", meta: "8 src · 2m ago", conf: "96%", reviewer: "S. Chen", status: "Approved", tone: "verified" as const },
  { task: "Contract Review #447", meta: "3 src · 5m ago", conf: "91%", reviewer: "J. Park", status: "In Review", tone: "review" as const },
  { task: "Supplier Risk Assessment", meta: "5 src · 12m ago", conf: "88%", reviewer: "M. Rodriguez", status: "Approved", tone: "verified" as const },
  { task: "GDPR Compliance Audit", meta: "12 src · 1h ago", conf: "99%", reviewer: "A. Kumar", status: "Approved", tone: "verified" as const },
  { task: "Policy Enforcement Check", meta: "2 src · now", conf: "94%", reviewer: "—", status: "Running", tone: "intent" as const },
];

function GovernanceDashboard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full border border-border" />
            <span className="size-2.5 rounded-full border border-border" />
            <span className="size-2.5 rounded-full border border-border" />
          </span>
          <span className="ml-2 text-xs text-muted-foreground">Governance Dashboard</span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-[var(--color-verified)]" aria-hidden /> Live
        </span>
      </div>
      <div className="grid grid-cols-2 border-b border-border sm:grid-cols-4">
        {dashboardStats.map((s) => (
          <div key={s.label} className="border-r border-border p-4 last:border-r-0">
            <p className="text-[0.6875rem] text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-lg font-semibold tracking-tight">{s.value}</p>
            <p className="font-mono text-[0.625rem] text-[var(--color-verified)]">{s.delta}</p>
          </div>
        ))}
      </div>
      <div className="hidden grid-cols-[1.6fr_0.5fr_0.9fr_0.9fr] gap-2 border-b border-border bg-muted/40 px-4 py-2 font-mono text-[0.625rem] uppercase tracking-wider text-muted-foreground sm:grid">
        <span>Task</span>
        <span>Conf.</span>
        <span>Reviewer</span>
        <span>Status</span>
      </div>
      <ul>
        {dashboardRows.map((r) => (
          <li
            key={r.task}
            className="grid grid-cols-1 gap-2 border-b border-border px-4 py-3 last:border-b-0 sm:grid-cols-[1.6fr_0.5fr_0.9fr_0.9fr] sm:items-center"
          >
            <div>
              <p className="text-[0.8125rem] font-medium tracking-tight">{r.task}</p>
              <p className="mt-0.5 font-mono text-[0.625rem] text-muted-foreground">{r.meta}</p>
            </div>
            <span className="text-xs text-muted-foreground">{r.conf}</span>
            <span className="text-xs text-muted-foreground">{r.reviewer}</span>
            <span>
              <StatusChip tone={r.tone}>{r.status}</StatusChip>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/6 to-transparent">
        <div className="container-site grid gap-12 pt-14 pb-16 md:pt-24 md:pb-20 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Enterprise AI Governance Platform
            </span>
            <h1 className="h1 mt-6 max-w-2xl">
              The Enterprise Operating Layer{" "}
              <span className="text-primary">for Accountable AI</span>
            </h1>
            <p className="lead mt-6">
              Bring governance, provenance, execution, verification, and human review into a single
              AI operating system.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <ButtonLink to={h.primaryHref} className="min-h-11 w-full sm:w-auto">
                Request Early Access
              </ButtonLink>
              <ButtonLink to="/platform" variant="secondary" className="min-h-11 w-full sm:w-auto">
                Explore Platform
              </ButtonLink>
            </div>
            <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <StatusChip tone="review">{h.stage}</StatusChip>
              <Link to={h.pricingHref} className="link-quiet font-medium">
                {h.pricingAction} →
              </Link>
            </p>
          </div>
          <Reveal>
            <GovernanceDashboard />
          </Reveal>
        </div>
      </section>

      <TrustStrip />

      {/* Problem */}
      <Section eyebrow="The enterprise problem" heading="AI output is fast. Accountability is not.">
        <ProblemCards />
      </Section>

      {/* Operating layer */}
      <Section
        eyebrow="The operating layer"
        heading="One governed path from context to approval"
        lead="Six controlled stages replace ungoverned prompting. Each stage keeps its evidence."
      >
        <OperatingLayerJourney />
      </Section>

      {/* Ecosystem */}
      <Section
        eyebrow="Product ecosystem"
        heading="A system architecture, not a set of features"
      >
        <EcosystemDiagram />
      </Section>

      {/* Interactive demo */}
      <Section
        eyebrow="See it work"
        heading="Context, assignment, execution, verification, decision"
        lead="A live walkthrough of how a single piece of work becomes an accountable record."
      >
        <WorkflowDemo />
      </Section>

      {/* Trust */}
      <Section eyebrow="Trust" heading="Built so an auditor can follow the work" lead={h.evidenceLead}>
        <TrustPillars />
      </Section>

      {/* Portfolio */}
      <Section eyebrow={h.portfolioEyebrow} heading={h.portfolioHeading} lead={h.portfolioLead}>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[h.platformCard, h.warrantCard, h.warrantMcpCard, h.futureCard].map((card, i) => (
            <Reveal key={card.title} delay={i * 60}>
              <Card className="flex h-full flex-col transition-colors duration-200 hover:border-primary/40">
                <div className="flex items-center justify-between gap-3">
                  <span className="eyebrow">{card.label}</span>
                  <StatusChip tone={toneForStatus(card.status)}>{card.status}</StatusChip>
                </div>
                <h3 className="h3 mt-4">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
                <ArrowLink to={card.href} className="mt-5">
                  {card.action}
                </ArrowLink>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="hairline-t bg-muted/40">
        <div className="container-site py-16 text-center md:py-20">
          <h2 className="h2 mx-auto max-w-2xl">{h.closeHeading}</h2>
          <p className="lead mx-auto mt-5">{h.closeLead}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink to={h.closePrimaryHref} className="min-h-11 w-full sm:w-auto">
              Request Early Access
            </ButtonLink>
            <ButtonLink
              to={h.closeSecondaryHref}
              variant="secondary"
              className="min-h-11 w-full sm:w-auto"
            >
              {h.closeSecondary}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
