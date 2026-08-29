import { createFileRoute } from "@tanstack/react-router";
import { warrantMcpProduct as copy } from "@/content/copy";
import { LedgerBlock } from "@/components/site/ledger-block";
import { ArrowLink, ButtonLink, Card, PageHead, Section, TermList } from "@/components/site/primitives";

export const Route = createFileRoute("/products/warrant-mcp")({
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
  component: WarrantMcpPage,
});

function WarrantMcpPage() {
  return (
    <>
      <PageHead eyebrow={copy.eyebrow} title={copy.heading} lead={copy.lead} />

      <Section>
        <Card className="border-l-2">
          <p className="text-[0.9375rem] leading-relaxed">{copy.maturity}</p>
        </Card>
      </Section>

      <Section heading={copy.problemHeading}>
        <p className="lead mt-4">{copy.problemBody}</p>
      </Section>

      <Section heading={copy.quickstartHeading} lead={copy.quickstartBody}>
        <pre
          aria-label="Warrant MCP installation and first policy check"
          className="mt-6 overflow-x-auto rounded-md border border-border bg-muted p-5 font-mono text-[0.8125rem] leading-relaxed"
        >
          <code>{copy.quickstartCommands.join("\n")}</code>
        </pre>
        <ButtonLink to={copy.githubHref} variant="secondary" className="mt-6">
          {copy.installLabel}
        </ButtonLink>
      </Section>

      <Section heading={copy.lifecycleHeading}>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {copy.lifecycle.map((s, i) => (
            <Card key={s.label}>
              <span className="eyebrow">{i + 1}</span>
              <h3 className="h3 mt-3">{s.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section heading={copy.vocabularyHeading} lead={copy.specBody}>
        <TermList
          className="mt-8"
          items={copy.vocabulary.map((v) => ({ body: v }))}
        />
        <ArrowLink to={copy.specHref} className="mt-6 inline-flex">
          {copy.specLabel}
        </ArrowLink>
      </Section>

      <Section heading={copy.capabilitiesHeading}>
        <TermList
          items={["CB-91", "CB-92", "CB-93"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>

      <Section heading={copy.integrationHeading} lead={copy.integrationBody} />

      <Section heading={copy.recordHeading} lead={copy.recordBody} />

      <Section heading={copy.limitationsHeading}>
        <TermList items={copy.limitations.map((l) => ({ body: l }))} />
        <ArrowLink to={copy.securityHref} className="mt-6 inline-flex">
          {copy.securityLabel}
        </ArrowLink>
      </Section>

      <Section heading={copy.partnershipHeading} lead={copy.partnershipBody}>
        <ArrowLink to={copy.partnershipHref} className="mt-6 inline-flex">
          {copy.partnershipLabel}
        </ArrowLink>
      </Section>
    </>
  );
}
