import { createFileRoute } from "@tanstack/react-router";
import { experience, platform as copy } from "@/content/copy";
import { LedgerBlock } from "@/components/site/ledger-block";
import { Card, PageHead, Section, TermList } from "@/components/site/primitives";

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

function PlatformPage() {
  return (
    <>
      <PageHead eyebrow={copy.eyebrow} title={copy.heading} lead={copy.lead} />

      <Section eyebrow={copy.problemHeading}>
        <TermList
          className="mt-2"
          items={copy.problems.map((p) => ({
            title: p.leadIn,
            body: p.body,
          }))}
        />
      </Section>

      <Section heading={copy.pillarsHeading} lead={copy.pillarsLead}>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {copy.pillars.map((p) => (
            <Card key={p.title}>
              <h3 className="h3">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section heading={copy.distinctionsHeading} lead={copy.distinctionsLead}>
        <TermList
          items={copy.distinctions.map((d) => ({
            title: d.category,
            body: d.body,
          }))}
        />
      </Section>

      <Section id="verified-capability-heading" eyebrow={copy.verifiedCapabilityHeading} lead={experience.platform.proofLead}>
        <TermList
          className="mt-8"
          items={["CB-80", "CB-81", "CB-82", "CB-83", "CB-84"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>
    </>
  );
}
