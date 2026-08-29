import { createFileRoute } from "@tanstack/react-router";
import { building as copy } from "@/content/copy";
import { Card, Section, StatusChip } from "@/components/site/primitives";
import { CtaBand, PageHero } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/motion";

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
      <PageHero
        badge={copy.eyebrow}
        title={copy.heading}
        lead={copy.lead}
        primary={{ to: copy.closingHref, label: copy.closingAction }}
        secondary={{ to: "/what-we-havent-built", label: "What We Haven't Built" }}
      />

      <Section>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {copy.projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 60}>
              <Card className="flex h-full flex-col transition-colors duration-200 hover:border-primary/40">
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
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        heading={copy.closing}
        primary={{ to: copy.closingHref, label: copy.closingAction }}
        secondary={{ to: "/resources", label: "Browse Resources" }}
      />
    </>
  );
}
