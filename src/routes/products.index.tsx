import { createFileRoute } from "@tanstack/react-router";
import { experience, products as copy } from "@/content/copy";
import { LedgerBlock } from "@/components/site/ledger-block";
import { ArrowLink, Card, PageHead, Section, StatusChip } from "@/components/site/primitives";

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

function ProductsPage() {
  return (
    <>
      <PageHead eyebrow={copy.eyebrow} title={copy.heading} lead={copy.lead} />

      <Section eyebrow={copy.relationHeading} heading={copy.relationLead}>
        <div className="mt-8 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          <LedgerBlock id="CB-87" />
        </div>
      </Section>

      <Section heading={copy.familyHeading}>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card className="flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow">{experience.home.warrantCard.label}</span>
              <StatusChip tone="review">{experience.home.warrantCard.status}</StatusChip>
            </div>
            <h3 className="h3 mt-4">{copy.warrantTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {copy.warrantSummary}
            </p>
            <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
              <LedgerBlock id="CB-85" />
            </div>
            <ArrowLink to={copy.warrantHref} className="mt-6">
              {experience.home.warrantCard.action}
            </ArrowLink>
          </Card>
          <Card className="flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow">{experience.home.warrantMcpCard.label}</span>
              <StatusChip tone="review">{experience.home.warrantMcpCard.status}</StatusChip>
            </div>
            <h3 className="h3 mt-4">{copy.warrantMcpTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {copy.warrantMcpSummary}
            </p>
            <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
              <LedgerBlock id="CB-86" />
            </div>
            <ArrowLink to={copy.warrantMcpHref} className="mt-6">
              {experience.home.warrantMcpCard.action}
            </ArrowLink>
          </Card>
        </div>
      </Section>

      <Section eyebrow={experience.home.platformCard.label} heading={experience.home.platformCard.title}>
        <p className="lead mt-2">{experience.home.platformCard.body}</p>
        <ArrowLink to={experience.home.platformCard.href} className="mt-6 inline-flex">
          {experience.home.platformCard.action}
        </ArrowLink>
      </Section>
    </>
  );
}
