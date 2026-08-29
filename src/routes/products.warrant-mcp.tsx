import { createFileRoute } from "@tanstack/react-router";
import { warrantMcpProduct as w } from "@/content/copy";
import { block } from "@/content/ledger";
import {
  ArrowLink,
  Card,
  PageHead,
  Section,
  StatusChip,
  TermList,
} from "@/components/site/primitives";

export const Route = createFileRoute("/products/warrant-mcp")({
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
  component: WarrantMcpPage,
});

function WarrantMcpPage() {
  return (
    <>
      <PageHead eyebrow="Agent tool policy" title={w.name} lead={w.tagline}>
        <p className="mt-6">
          <StatusChip tone="review">{w.referenceBadge}</StatusChip>
        </p>
      </PageHead>

      <Section heading={w.referenceHeading}>
        <p className="lead mt-2">{w.referenceBody}</p>
        <TermList items={w.referencePoints.map((p) => ({ body: p }))} />
        <ArrowLink to={w.referenceRepoHref} className="mt-8 inline-flex">
          {w.referenceRepoLabel}
        </ArrowLink>
      </Section>

      <Section heading={w.evidenceHeading}>
        <TermList
          items={w.evidencePoints.map((p) => ({
            body: p,
            badge: <StatusChip tone="verified">{w.evidenceStatus}</StatusChip>,
          }))}
        />
      </Section>

      <Section heading={w.claudeHeading}>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {w.claudeFacts.map((f) => (
            <Card key={f}>
              <p className="text-sm leading-relaxed">{f}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section heading={w.coverageHeading}>
        <ul className="mt-8 flex flex-wrap gap-2">
          {w.coverageTools.map((t) => (
            <li
              key={t}
              className="rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs"
            >
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {w.coverageBoundary}
        </p>
      </Section>

      <Section heading={w.principlesHeading}>
        <TermList items={w.principlesList.map((p) => ({ body: p }))} />
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {block("CB-91")} {block("CB-93")}
        </p>
      </Section>

      <Section heading={w.roadmapHeading}>
        <TermList
          items={w.roadmap.map((r) => ({
            title: r.title,
            body: r.body,
            badge: <StatusChip tone="intent">{r.status}</StatusChip>,
          }))}
        />
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {block("CB-92")}
        </p>
      </Section>

      <Section>
        <p className="lead">{w.ctaLead}</p>
        <div className="mt-6 flex flex-wrap gap-6">
          <ArrowLink to={w.ctaRepoHref}>{w.ctaRepo}</ArrowLink>
          <ArrowLink to="/platform">{w.ctaPlatform}</ArrowLink>
          <ArrowLink to="/what-we-havent-built">{w.ctaGaps}</ArrowLink>
        </div>
      </Section>
    </>
  );
}
