import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Plug, ShieldCheck, FileCheck2, Workflow } from "lucide-react";
import { experience, products as copy } from "@/content/copy";
import { LedgerBlock } from "@/components/site/ledger-block";
import { ArrowLink, Card, Section, StatusChip } from "@/components/site/primitives";
import { CtaBand, PageHero, SignalStrip } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/motion";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: copy.metaTitle },
      { name: "description", content: copy.metaDescription },
      { property: "og:title", content: copy.metaTitle },
      { property: "og:description", content: copy.metaDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

const signals = [
  { icon: Boxes, label: "One System Architecture" },
  { icon: Workflow, label: "Shared Governance" },
  { icon: Plug, label: "Protocol Native" },
  { icon: FileCheck2, label: "Portable Evidence" },
  { icon: ShieldCheck, label: "Human Authorization" },
];

function ProductMap() {
  const nodes = [
    { label: experience.home.platformCard.label, title: "Operating layer", tone: "primary" },
    { label: experience.home.warrantCard.label, title: copy.warrantTitle, tone: "muted" },
    { label: experience.home.warrantMcpCard.label, title: copy.warrantMcpTitle, tone: "muted" },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-3">
        <span className="text-xs text-muted-foreground">Product map</span>
        <StatusChip tone="review">In build</StatusChip>
      </div>
      <div className="space-y-3 p-4">
        {nodes.map((n) => (
          <div
            key={n.title}
            className={
              n.tone === "primary"
                ? "rounded-lg border border-primary/40 bg-primary/5 p-4"
                : "ml-6 rounded-lg border border-border p-4"
            }
          >
            <p className="eyebrow">{n.label}</p>
            <p className="mt-1.5 text-sm font-medium tracking-tight">{n.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsPage() {
  return (
    <>
      <PageHero
        badge={copy.eyebrow}
        title={copy.heading}
        lead={copy.lead}
        primary={{ to: "/contact", label: "Request Early Access" }}
        secondary={{ to: "/platform", label: "Explore Platform" }}
        aside={<ProductMap />}
      />

      <SignalStrip label="Product principles" items={signals} />

      <Section eyebrow={copy.relationHeading} heading={copy.relationLead}>
        <div className="mt-8 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          <LedgerBlock id="CB-87" />
        </div>
      </Section>

      <Section eyebrow="Portfolio" heading={copy.familyHeading}>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Reveal>
            <Card className="flex h-full flex-col transition-colors duration-200 hover:border-primary/40">
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow">{experience.home.warrantCard.label}</span>
                <StatusChip tone="review">{experience.home.warrantCard.status}</StatusChip>
              </div>
              <h3 className="h3 mt-4">{copy.warrantTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {copy.warrantSummary}
              </p>
              <div className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                <LedgerBlock id="CB-85" />
              </div>
              <ArrowLink to={copy.warrantHref} className="mt-6">
                {experience.home.warrantCard.action}
              </ArrowLink>
            </Card>
          </Reveal>
          <Reveal delay={60}>
            <Card className="flex h-full flex-col transition-colors duration-200 hover:border-primary/40">
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow">{experience.home.warrantMcpCard.label}</span>
                <StatusChip tone="review">{experience.home.warrantMcpCard.status}</StatusChip>
              </div>
              <h3 className="h3 mt-4">{copy.warrantMcpTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {copy.warrantMcpSummary}
              </p>
              <div className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                <LedgerBlock id="CB-86" />
              </div>
              <ArrowLink to={copy.warrantMcpHref} className="mt-6">
                {experience.home.warrantMcpCard.action}
              </ArrowLink>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow={experience.home.platformCard.label}
        heading={experience.home.platformCard.title}
        lead={experience.home.platformCard.body}
      >
        <ArrowLink to={experience.home.platformCard.href} className="mt-6 inline-flex">
          {experience.home.platformCard.action}
        </ArrowLink>
      </Section>

      <CtaBand
        heading="Put the product family in front of your team"
        lead="Every product shares one governance model, so evidence travels with the work."
        primary={{ to: "/contact", label: "Request Early Access" }}
        secondary={{ to: "/pricing", label: "See Pricing" }}
      />
    </>
  );
}
