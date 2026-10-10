import { createFileRoute } from "@tanstack/react-router";
import { planMailto } from "@/content/caid";
import {
  Band,
  BandHead,
  CloseBand,
  PrimaryAction,
  Promises,
  ServiceList,
} from "@/components/site/caid-sections";

const title = "Services — AI Workspace";
const description =
  "Discovery, Pilot, Production and Care: four services that follow our 12-step customer AI deployment process, each ending in a decision you make with evidence.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="bg-paper">
        <div className="container-site pb-14 pt-14 md:pb-20 md:pt-20">
          <h1 className="h1 max-w-3xl text-ink">Four services. Each one ends in your decision.</h1>
          <p className="lead mt-6">
            You buy one phase at a time. At the end of each, you see the receipts, the numbers and
            our recommendation — and you choose whether to go on.
          </p>
          <div className="mt-8">
            <PrimaryAction href={planMailto}>Ask for a scoped plan</PrimaryAction>
          </div>
        </div>
      </section>
      <Band>
        <ServiceList />
      </Band>
      <Band tone="paper">
        <BandHead title="What every service includes" />
        <Promises />
      </Band>
      <CloseBand />
    </>
  );
}
