import { createFileRoute } from "@tanstack/react-router";
import { experience, platform as copy } from "@/content/copy";
import { block } from "@/content/ledger";
import {
  ArrowLink,
  Card,
  PageHead,
  Section,
  StatusChip,
  TermList,
} from "@/components/site/primitives";

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

const p = experience.platform;

function PlatformPage() {
  return (
    <>
      <PageHead eyebrow="The operating layer" title={copy.heading} lead={copy.lead} />

      <Section heading={p.flowHeading}>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {p.flowSteps.map((s, i) => (
            <div key={s.label} className="bg-card p-6">
              <span className="font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-semibold tracking-tight">{s.label}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{p.summary}</p>
      </Section>

      <Section eyebrow={copy.surfacesEyebrow} heading={copy.surfacesHeading}>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {copy.surfaces.map((s) => (
            <Card key={s.name}>
              <h3 className="text-base font-semibold tracking-tight">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="verified-capability-heading" eyebrow={copy.ledgerEyebrow} heading={copy.ledgerHeading}>
        <p className="lead mt-5">{copy.ledgerLead}</p>
        <TermList
          items={["CB-80", "CB-81", "CB-82", "CB-83"].map((id) => ({
            title: block(id).split(". ")[0] + ".",
            body: block(id).split(". ").slice(1).join(". ") || undefined,
            badge: (
              <StatusChip tone="verified">
                {copy.ledgerStatusPrefix}: {id}
              </StatusChip>
            ),
          }))}
        />
        <div className="mt-8 flex items-center gap-4">
          <StatusChip tone="review">{block("CB-84")}</StatusChip>
        </div>
        <ArrowLink to="/trust" className="mt-8 inline-flex">
          Review the trust page
        </ArrowLink>
      </Section>
    </>
  );
}
