import { createFileRoute } from "@tanstack/react-router";
import { hero, meta, planMailto } from "@/content/caid";
import {
  Audiences,
  Band,
  BandHead,
  CloseBand,
  DigitalFlow,
  OwnSystems,
  PhaseOverview,
  PrimaryAction,
  Promises,
  ReceiptLedger,
  SecondaryAction,
  ServiceList,
} from "@/components/site/caid-sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: meta.title },
      { name: "description", content: meta.description },
      { property: "og:title", content: meta.title },
      { property: "og:description", content: meta.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <section className="bg-paper">
        <div className="container-site grid gap-12 pb-20 pt-14 md:grid-cols-[1.15fr_1fr] md:items-center md:pb-28 md:pt-20">
          <div>
            <p className="font-semibold text-[var(--color-verified)]">{hero.kicker}</p>
            <h1 className="h1 mt-4 text-ink">{hero.title}</h1>
            <p className="lead mt-6">{hero.lead}</p>
            <p lang="hi" className="font-deva mt-5 text-lg text-ink">
              {hero.hindi}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <PrimaryAction href={planMailto}>{hero.primary}</PrimaryAction>
              <SecondaryAction to="/process">{hero.secondary}</SecondaryAction>
            </div>
          </div>
          <div className="min-w-0 md:pl-4">
            <ReceiptLedger />
            <p className="mt-5 text-sm text-muted-foreground">
              An example of what you see during an engagement: each step stamped only when its
              receipt exists.
            </p>
          </div>
        </div>
      </section>

      <Band id="who">
        <BandHead
          title="For organisations that run on paperwork and follow-ups"
          lead="You don’t need an engineer or a big project. You need one repeated job done better, and proof that it is."
        />
        <Audiences />
      </Band>

      <Band id="process" tone="paper">
        <BandHead
          title="Twelve steps, four phases, one receipt per step"
          lead="The same method on every engagement. You can stop at the end of any phase and keep everything produced so far."
        />
        <PhaseOverview />
        <div className="mt-8">
          <SecondaryAction to="/process">Read every step</SecondaryAction>
        </div>
      </Band>

      <Band id="services">
        <BandHead
          title="Services, in the order you buy them"
          lead="Each service maps to a phase. Each ends in a decision you make with evidence in hand."
        />
        <ServiceList compact />
        <div className="mt-6">
          <SecondaryAction to="/services">See what each service delivers</SecondaryAction>
        </div>
      </Band>

      <Band id="promises" tone="paper">
        <BandHead
          title="Promises you can check"
          lead="Rules we hold ourselves to on every engagement, written so you can catch us breaking them."
        />
        <Promises />
      </Band>

      <Band id="digital">
        <DigitalFlow />
      </Band>

      <Band id="own-systems" tone="paper">
        <OwnSystems />
      </Band>

      <CloseBand />
    </>
  );
}
