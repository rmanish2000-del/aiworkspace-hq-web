import { createFileRoute } from "@tanstack/react-router";
import { warrantProduct as w } from "@/content/copy";
import { block } from "@/content/ledger";
import { ArrowLink, PageHead, Section, StatusChip, TermList } from "@/components/site/primitives";

export const Route = createFileRoute("/products/warrant")({
  head: () => ({
    meta: [
      { title: w.metaTitle },
      { name: "description", content: w.metaDescription },
      { property: "og:title", content: w.metaTitle },
      { property: "og:description", content: w.metaDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WarrantPage,
});

function WarrantPage() {
  return (
    <>
      <PageHead eyebrow="Commerce authorization" title={w.name} lead={w.tagline}>
        <p className="mt-6 flex flex-wrap items-center gap-3">
          <StatusChip tone="review">{w.demoBadge}</StatusChip>
          <span className="text-sm text-muted-foreground">
            {w.pricing.setup} · {w.pricing.price}
          </span>
        </p>
      </PageHead>

      <Section heading={w.demoHeading}>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {w.demoOutcomes.map((o) => (
            <div key={o} className="rounded-lg border border-border bg-card p-5 text-center">
              <span className="font-mono text-sm font-semibold tracking-wide">{o}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{w.demoNote}</p>
      </Section>

      <Section heading={w.sandboxHeading}>
        <TermList
          items={w.sandboxPoints.map((p) => ({
            body: p,
            badge: <StatusChip tone="verified">{w.sandboxStatus}</StatusChip>,
          }))}
        />
        <p className="mt-6 text-sm text-muted-foreground">{block("CB-88")}</p>
      </Section>

      <Section heading={w.evidenceHeading}>
        <TermList
          items={w.evidencePoints.map((p) => ({
            body: p,
            badge: <StatusChip tone="verified">{w.evidenceStatus}</StatusChip>,
          }))}
        />
      </Section>

      <Section heading={w.roadmapHeading}>
        <div className="mt-10 border-t border-border">
          {w.roadmap.map((r) => (
            <div
              key={r.title}
              className="grid gap-2 border-b border-border py-6 md:grid-cols-[10rem_1fr] md:gap-6"
            >
              <StatusChip tone={r.status === "Available today" ? "verified" : "intent"}>
                {r.status}
              </StatusChip>
              <div>
                <h3 className="text-base font-semibold tracking-tight">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{block("CB-89")}</p>
      </Section>

      <Section heading={w.stackHeading}>
        <TermList items={w.stackPoints.map((p) => ({ body: p }))} />
      </Section>

      <Section>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{block("CB-90")}</p>
        <p className="lead mt-6">{w.ctaLead}</p>
        <div className="mt-6 flex flex-wrap gap-6">
          <ArrowLink to="/platform">{w.ctaPlatform}</ArrowLink>
          <ArrowLink to="/what-we-havent-built">{w.ctaGaps}</ArrowLink>
        </div>
      </Section>
    </>
  );
}
