import { createFileRoute } from "@tanstack/react-router";
import { experience, products as copy } from "@/content/copy";
import { block } from "@/content/ledger";
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

const p = experience.products;

function ProductsPage() {
  return (
    <>
      <PageHead eyebrow="Products" title={p.heading} lead={p.lead} />

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {copy.cards.map((card) => (
            <Card key={card.href} className="flex flex-col">
              <h2 className="h3">{card.name}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {card.summary}
              </p>
              <ArrowLink to={card.href} className="mt-5">
                {card.linkText}
              </ArrowLink>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Comparison" heading={p.compareHeading}>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card>
            <p className="eyebrow">{p.commerceLabel}</p>
            <p className="mt-3 text-sm font-medium">Warrant</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {block("CB-86")}
            </p>
            <ArrowLink to="/products/warrant" className="mt-4">
              Explore Warrant
            </ArrowLink>
          </Card>
          <Card>
            <p className="eyebrow">{p.toolLabel}</p>
            <p className="mt-3 text-sm font-medium">Warrant MCP</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {block("CB-87")}
            </p>
            <ArrowLink to="/products/warrant-mcp" className="mt-4">
              Explore Warrant MCP
            </ArrowLink>
          </Card>
        </div>
        <div className="mt-6 rounded-lg border border-border bg-muted/40 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusChip tone="review">{p.runtimeLabel}</StatusChip>
            <StatusChip tone="verified">{p.outcomeLabel}</StatusChip>
          </div>
          <ul className="mt-5 space-y-2 font-mono text-sm text-muted-foreground">
            {p.policyPreview.map((line) => (
              <li key={line} className="flex gap-3">
                <span aria-hidden className="text-[var(--color-verified)]">
                  ▸
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          {copy.boundaryLead}{" "}
          <ArrowLink to="/what-we-havent-built" className="inline-flex">
            {copy.boundaryLinkText}
          </ArrowLink>
        </p>
      </Section>
    </>
  );
}
