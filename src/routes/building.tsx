import { createFileRoute } from "@tanstack/react-router";
import { building as copy } from "@/content/copy";
import { ButtonLink, Card, PageHead, Section, StatusChip } from "@/components/site/primitives";

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
      <PageHead eyebrow={copy.eyebrow} title={copy.heading} lead={copy.lead} />

      <Section>
        <div className="grid gap-4 lg:grid-cols-3">
          {copy.projects.map((p) => (
            <Card key={p.name} className="flex flex-col">
              <div className="flex items-center justify-between gap-3">
                <h2 className="h3">{p.name}</h2>
                <StatusChip tone="intent">Day zero</StatusChip>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.what}</p>
              <dl className="mt-6 flex-1 space-y-4 border-t border-border pt-5 text-sm">
                <div>
                  <dt className="eyebrow">{copy.forLabel}</dt>
                  <dd className="mt-1.5 leading-relaxed text-muted-foreground">{p.intendedFor}</dd>
                </div>
                <div>
                  <dt className="eyebrow">{copy.stateLabel}</dt>
                  <dd className="mt-1.5 leading-relaxed text-muted-foreground">{p.state}</dd>
                </div>
                <div>
                  <dt className="eyebrow">{copy.killLabel}</dt>
                  <dd className="mt-1.5 leading-relaxed">
                    <span className="font-mono text-xs">{p.kill}</span>
                    <span className="mt-1 block text-muted-foreground">{p.killWhy}</span>
                  </dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex max-w-2xl flex-col gap-6">
          <p className="lead">{copy.closing}</p>
          <div>
            <ButtonLink to={copy.closingHref}>{copy.closingAction}</ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
