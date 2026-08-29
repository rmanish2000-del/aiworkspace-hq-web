import { createFileRoute } from "@tanstack/react-router";
import {
  Layers,
  ShieldCheck,
  GitBranch,
  UserCheck,
  FileCheck2,
  ScrollText,
} from "lucide-react";
import { experience, platform as copy } from "@/content/copy";
import { LedgerBlock } from "@/components/site/ledger-block";
import { Card, Section, StatusChip, TermList } from "@/components/site/primitives";
import { CtaBand, PageHero, SignalStrip } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/motion";

export const Route = createFileRoute("/platform")({
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
  component: PlatformPage,
});

const signals = [
  { icon: ShieldCheck, label: "Governance First" },
  { icon: GitBranch, label: "Provenance Tracking" },
  { icon: UserCheck, label: "Human Authorization" },
  { icon: FileCheck2, label: "Verifiable Evidence" },
  { icon: ScrollText, label: "Audit Ready" },
];

const stack = [
  { name: "Decision Record", note: "Authorized outcome + evidence" },
  { name: "Human Review", note: "Named reviewer, explicit approval" },
  { name: "Verification", note: "Checks against source" },
  { name: "Execution", note: "Scoped, logged model work" },
  { name: "Context & Permissions", note: "Sources, versions, access" },
];

function LayerStack() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-3">
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Layers className="size-3.5 text-primary" aria-hidden /> Operating layer
        </span>
        <StatusChip tone="review">Reference architecture</StatusChip>
      </div>
      <ul>
        {stack.map((l, i) => (
          <li
            key={l.name}
            className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5 last:border-b-0"
          >
            <div>
              <p className="text-[0.8125rem] font-medium tracking-tight">{l.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{l.note}</p>
            </div>
            <span className="font-mono text-[0.625rem] text-muted-foreground">
              L{stack.length - i}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlatformPage() {
  return (
    <>
      <PageHero
        badge={copy.eyebrow}
        title={copy.heading}
        lead={copy.lead}
        primary={{ to: "/contact", label: "Request Early Access" }}
        secondary={{ to: "/products", label: "See Products" }}
        aside={<LayerStack />}
      />

      <SignalStrip label="Platform guarantees" items={signals} />

      <Section eyebrow="The enterprise problem" heading={copy.problemHeading}>
        <TermList
          items={copy.problems.map((p) => ({
            title: p.leadIn,
            body: p.body,
          }))}
        />
      </Section>

      <Section eyebrow="Pillars" heading={copy.pillarsHeading} lead={copy.pillarsLead}>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {copy.pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <Card className="h-full transition-colors duration-200 hover:border-primary/40">
                <h3 className="h3">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Category"
        heading={copy.distinctionsHeading}
        lead={copy.distinctionsLead}
      >
        <TermList
          items={copy.distinctions.map((d) => ({
            title: d.category,
            body: d.body,
          }))}
        />
      </Section>

      <Section
        id="verified-capability-heading"
        eyebrow="Evidence"
        heading={copy.verifiedCapabilityHeading}
        lead={experience.platform.proofLead}
      >
        <TermList
          items={["CB-80", "CB-81", "CB-82", "CB-83", "CB-84"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>

      <CtaBand
        heading="See the operating layer against your own workflow"
        lead="We will walk through governance, provenance, and human authorization on a real task."
        primary={{ to: "/contact", label: "Request Early Access" }}
        secondary={{ to: "/trust", label: "Read Trust" }}
      />
    </>
  );
}
