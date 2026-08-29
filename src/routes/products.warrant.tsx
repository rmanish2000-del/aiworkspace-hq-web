import { createFileRoute } from "@tanstack/react-router";
import { warrantProduct as copy } from "@/content/copy";
import { LedgerBlock } from "@/components/site/ledger-block";
import { ArrowLink, ButtonLink, Card, PageHead, Section, TermList } from "@/components/site/primitives";

export const Route = createFileRoute("/products/warrant")({
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
  component: WarrantPage,
});

function WarrantPage() {
  return (
    <>
      <PageHead eyebrow={copy.eyebrow} title={copy.heading} lead={copy.lead} />

      <Section>
        <Card className="border-l-2">
          <p className="text-[0.9375rem] leading-relaxed">{copy.maturity}</p>
        </Card>
      </Section>

      <Section heading={copy.audienceHeading}>
        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {copy.audiences.map((a) => (
            <li
              key={a}
              className="rounded-md border border-border bg-muted px-4 py-3 text-[0.875rem] text-muted-foreground"
            >
              {a}
            </li>
          ))}
        </ul>
      </Section>

      <Section heading={copy.problemHeading}>
        <p className="lead mt-4">{copy.problemBody}</p>
      </Section>

      <Section heading={copy.workflowHeading}>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {copy.workflow.map((s) => (
            <Card key={s.label}>
              <h3 className="h3 mt-3">{s.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section heading={copy.refusalHeading}>
        <Card className="border-l-2 border-l-foreground">
          <p className="text-[0.9375rem] leading-relaxed">{copy.refusalBody}</p>
        </Card>
      </Section>

      <Section heading={copy.capabilitiesHeading}>
        <TermList
          items={["CB-88", "CB-89", "CB-90"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>

      <Section heading={copy.tryHeading} lead={copy.tryBody}>
        <ButtonLink to={copy.githubHref} variant="secondary" className="mt-6">
          {copy.githubLabel}
        </ButtonLink>
      </Section>

      <Section heading={copy.trustHeading}>
        <h3 className="h3 mt-2">{copy.limitationsHeading}</h3>
        <TermList
          className="mt-4"
          items={copy.limitations.map((l) => ({ body: l }))}
        />
      </Section>

      <Section heading={copy.partnershipHeading} lead={copy.partnershipBody}>
        <ArrowLink to={copy.partnershipHref} className="mt-6 inline-flex">
          {copy.partnershipLabel}
        </ArrowLink>
      </Section>
    </>
  );
}
