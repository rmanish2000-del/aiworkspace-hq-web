import { createFileRoute } from "@tanstack/react-router";
import { REVIEW_STAMP } from "@/content/ledger";
import { LedgerBlock } from "@/components/site/ledger-block";
import { Section, TermList } from "@/components/site/primitives";
import { CtaBand, PageHero } from "@/components/site/page-shell";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology — AI Workspace" },
      {
        name: "description",
        content: "What we run on, and what happens if we are wrong about it.",
      },
      { property: "og:title", content: "Technology — AI Workspace" },
      {
        property: "og:description",
        content: "What we run on, and what happens if we are wrong about it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TechnologyPage,
});

function TechnologyPage() {
  return (
    <>
      <PageHero
        badge="Technology"
        title={<LedgerBlock id="CB-30" badge={false} bare />}
        lead={<LedgerBlock id="CB-31" badge={false} bare />}
        primary={{ to: "/platform", label: "Explore Platform" }}
        secondary={{ to: "/resources", label: "Browse Resources" }}
        chip={`Last reviewed ${REVIEW_STAMP}`}
      />

      <Section eyebrow="Design choice" heading="The exit strategy came first" id="exit-heading">
        <LedgerBlock
          id="CB-32"
          className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground"
        />
      </Section>

      <Section eyebrow="The stack" heading="The six technologies" id="stack-heading">
        <div className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          <LedgerBlock id="CB-33" />
        </div>
        <div className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          <LedgerBlock id="CB-34" />
        </div>
      </Section>

      <Section eyebrow="Trade-offs" heading="What we rejected" id="rejected-heading">
        <TermList
          items={["CB-35", "CB-36"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>

      <Section eyebrow="Process" heading="How we decide" id="decide-heading">
        <LedgerBlock
          id="CB-39"
          className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground"
        />
      </Section>

      <Section eyebrow="Limits" heading="A stated ceiling" id="ceiling-heading">
        <LedgerBlock
          id="CB-37"
          className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground"
        />
      </Section>

      <CtaBand
        heading="Go deeper on the architecture"
        lead="We will walk the stack, the trade-offs, and the ceiling with your team."
        primary={{ to: "/contact", label: "Contact Us" }}
        secondary={{ to: "/platform", label: "Explore Platform" }}
      />
    </>
  );
}
