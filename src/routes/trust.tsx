import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, GitBranch, UserCheck, FileCheck2, ScrollText } from "lucide-react";
import { REVIEW_STAMP, WITHHELD_NOTICE } from "@/content/ledger";
import { LedgerBlock } from "@/components/site/ledger-block";
import { Card, Section, StatusChip, TermList } from "@/components/site/primitives";
import { CtaBand, PageHero, SignalStrip } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/motion";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: "Trust — AI Workspace" },
      {
        name: "description",
        content: "What we can be held to, and what we cannot.",
      },
      { property: "og:title", content: "Trust — AI Workspace" },
      {
        property: "og:description",
        content: "What we can be held to, and what we cannot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrustPage,
});

const signals = [
  { icon: ShieldCheck, label: "Stated Limits" },
  { icon: GitBranch, label: "Traceable Claims" },
  { icon: UserCheck, label: "Named Review" },
  { icon: FileCheck2, label: "Evidence On Request" },
  { icon: ScrollText, label: "Public Ledger" },
];

const pillars = [
  {
    title: "Claims carry identifiers",
    body: "Every substantive statement on this site is recorded with a ledger identifier so it can be checked, challenged, or withdrawn.",
  },
  {
    title: "Absence is stated plainly",
    body: "Where a certification, customer, or benchmark does not exist yet, we say so on the page instead of implying otherwise.",
  },
  {
    title: "Review has a date",
    body: "Each trust statement is reviewed on a schedule and stamped, so you know how current the position is.",
  },
];

function TrustPage() {
  return (
    <>
      <PageHero
        badge="Trust"
        title={<LedgerBlock id="CB-10" badge={false} bare />}
        lead={<LedgerBlock id="CB-11" badge={false} bare />}
        primary={{ to: "/contact", label: "Ask For Evidence" }}
        secondary={{ to: "/what-we-havent-built", label: "What We Haven't Built" }}
        chip={`Last reviewed ${REVIEW_STAMP}`}
      />

      <SignalStrip label="Trust signals" items={signals} />

      <Section eyebrow="How we hold ourselves" heading="Three commitments behind every claim">
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <Card className="h-full transition-colors duration-200 hover:border-primary/40">
                <h3 className="h3">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="missing-heading" eyebrow="Limits" heading="What we do not have">
        <TermList
          items={["CB-12", "CB-13", "CB-14", "CB-15"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>

      <Section id="method-heading" eyebrow="Evidence" heading="What we can show you">
        <TermList
          items={["CB-16", "CB-17"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>

      <Section id="ai-heading" eyebrow="Method" heading="How we use AI">
        <TermList
          items={["CB-18", "CB-19", "CB-20"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
        <p className="micro-notice mt-8">{WITHHELD_NOTICE}</p>
        <p className="mt-4">
          <StatusChip tone="review">Last reviewed {REVIEW_STAMP}</StatusChip>
        </p>
      </Section>

      <CtaBand
        heading="Ask us for the evidence behind any claim"
        lead="We will send the record, or tell you it does not exist yet."
        primary={{ to: "/contact", label: "Contact Us" }}
        secondary={{ to: "/platform", label: "Explore Platform" }}
      />
    </>
  );
}
