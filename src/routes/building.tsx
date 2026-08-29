import { createFileRoute } from "@tanstack/react-router";
import { building as copy } from "@/content/copy";
import { ArrowLink, Card, PageHead, Section, StatusChip } from "@/components/site/primitives";

export const Route = createFileRoute("/building")({
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
  component: BuildingPage,
});

function BuildingPage() {
  return (
    <>
      <PageHead eyebrow="Day zero" title={copy.heading} lead={copy.lead} />

      <Section heading={copy.projectsHeading}>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {copy.projects.map((p) => (
            <Card key={p.name} className="flex flex-col">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-muted-foreground">{p.domain}</span>
                <StatusChip tone="intent">{copy.statusPrefix} {p.status}</StatusChip>
              </div>
              <h2 className="h3 mt-4">{p.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {p.thesis}
              </p>
              <p className="mt-4 border-t border-border pt-3 font-mono text-xs text-muted-foreground">
                {copy.startedPrefix} {p.started}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section heading={copy.gateHeading}>
        <ul className="mt-8 space-y-4">
          {copy.gatePoints.map((g) => (
            <li key={g} className="flex max-w-2xl gap-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
              <span aria-hidden className="mt-1 text-[var(--color-verified)]">
                ▸
              </span>
              {g}
            </li>
          ))}
        </ul>
        <ArrowLink to="/principles" className="mt-8 inline-flex">
          {copy.gateLinkText}
        </ArrowLink>
      </Section>
    </>
  );
}
