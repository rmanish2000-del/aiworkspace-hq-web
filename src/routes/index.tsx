import { createFileRoute, Link } from "@tanstack/react-router";
import { experience } from "@/content/copy";
import {
  ArrowLink,
  ButtonLink,
  Card,
  Section,
  StatusChip,
  TermList,
  toneForStatus,
} from "@/components/site/primitives";

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

function FlowDiagram() {
  const stages = [
    { label: h.sourceLabel, value: h.sourceValue },
    { label: h.contextLabel, value: h.contextValue },
    { label: h.assignmentLabel, value: h.assignmentValue },
    { label: h.resultLabel, value: h.resultValue },
  ];
  return (
    <figure
      aria-label={h.visualLabel}
      className="rounded-lg border border-border bg-muted/40 p-6 md:p-8"
    >
      <p className="eyebrow">{h.visualLabel}</p>
      <p className="mt-3 text-sm font-medium tracking-tight">{h.visualTitle}</p>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2">
        {stages.map((s, i) => (
          <li key={s.label} className="rounded-md border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.6875rem] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span aria-hidden className="text-muted-foreground">
                {i < stages.length - 1 ? "→" : "✓"}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-0.5 text-sm font-medium">{s.value}</p>
          </li>
        ))}
      </ol>
      <figcaption className="mt-5 border-t border-border pt-4 font-mono text-[0.6875rem] tracking-wide text-muted-foreground">
        {h.auditLabel}
      </figcaption>
    </figure>
  );
}

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="container-site grid gap-12 pt-16 pb-16 md:pt-24 md:pb-24 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow">{h.eyebrow}</p>
          <h1 className="h1 mt-5">{h.heading}</h1>
          <p className="lead mt-6">{h.lead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink to={h.primaryHref}>{h.primaryAction}</ButtonLink>
            <ButtonLink to={h.secondaryHref} variant="secondary">
              {h.secondaryAction}
            </ButtonLink>
          </div>
          <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <StatusChip tone="review">{h.stage}</StatusChip>
            <Link to={h.pricingHref} className="link-quiet font-medium">
              {h.pricingAction} →
            </Link>
          </p>
        </div>
        <FlowDiagram />
      </section>

      {/* Audiences */}
      <Section eyebrow={h.audienceEyebrow} heading={h.audienceHeading}>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {h.audiences.map((a) => (
            <Link
              key={a.href + a.label}
              to={a.href}
              className="group flex flex-col gap-1 bg-card p-6 transition-colors duration-150 hover:bg-accent"
            >
              <span className="eyebrow">{a.label}</span>
              <span className="mt-2 flex items-center justify-between gap-4 text-base font-medium tracking-tight">
                {a.question}
                <span aria-hidden className="text-muted-foreground transition-transform duration-150 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Problem */}
      <Section eyebrow={h.problemEyebrow} heading={h.problemHeading} lead={h.problemLead}>
        <TermList items={h.problemPoints.map((p) => ({ body: p }))} />
      </Section>

      {/* Capabilities */}
      <Section eyebrow={h.capabilityEyebrow} heading={h.capabilityHeading}>
        <TermList
          items={h.capabilities.map((c) => ({
            index: c.index,
            title: c.title,
            body: c.body,
            badge: <StatusChip tone={toneForStatus(c.status)}>{c.status}</StatusChip>,
          }))}
        />
      </Section>

      {/* Method */}
      <Section eyebrow={h.methodEyebrow} heading={h.methodHeading}>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {h.methodSteps.map((s) => (
            <div key={s.index} className="bg-card p-6">
              <span className="font-mono text-xs text-muted-foreground">{s.index}</span>
              <h3 className="mt-3 text-base font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Controls */}
      <Section eyebrow={h.controlEyebrow} heading={h.controlHeading} lead={h.controlLead}>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {h.controls.map((c) => (
            <Card key={c.title}>
              <h3 className="text-sm font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Portfolio */}
      <Section eyebrow={h.portfolioEyebrow} heading={h.portfolioHeading} lead={h.portfolioLead}>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[h.platformCard, h.warrantCard, h.warrantMcpCard, h.futureCard].map((card) => (
            <Card key={card.title} className="flex flex-col">
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
          ))}
        </div>
      </Section>

      {/* Evidence */}
      <Section eyebrow={h.evidenceEyebrow} heading={h.evidenceHeading} lead={h.evidenceLead}>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {h.evidenceItems.map((e) => (
            <Card key={e.label}>
              <StatusChip tone={toneForStatus(e.label)}>{e.label}</StatusChip>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{e.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Developer proof */}
      <Section eyebrow={h.developerEyebrow} heading={h.developerHeading} lead={h.developerLead}>
        <div className="mt-10 rounded-lg border border-border bg-muted/40 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow">{h.contractLabel}</p>
            <code className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs">
              {h.contractCode}
            </code>
          </div>
          <ul className="mt-6 space-y-2 font-mono text-sm text-muted-foreground">
            {h.contractLines.map((line) => (
              <li key={line} className="flex gap-3">
                <span aria-hidden className="text-[var(--color-verified)]">
                  ▸
                </span>
                {line}
              </li>
            ))}
          </ul>
          <ArrowLink to={h.developerHref} className="mt-6">
            {h.developerAction}
          </ArrowLink>
        </div>
      </Section>

      {/* Close */}
      <Section eyebrow={h.closeEyebrow} heading={h.closeHeading} lead={h.closeLead}>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to={h.closePrimaryHref}>{h.closePrimary}</ButtonLink>
          <ButtonLink to={h.closeSecondaryHref} variant="secondary">
            {h.closeSecondary}
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
