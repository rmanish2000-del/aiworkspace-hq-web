import type { ReactNode } from "react";
import { ButtonLink, StatusChip } from "@/components/site/primitives";
import { Reveal } from "@/components/site/motion";
import { cn } from "@/lib/utils";

/**
 * Shared sub-page chrome that mirrors the homepage design language:
 * gradient hero, pill eyebrow, dual CTA, and a closing band.
 */

export function PageHero(props: {
  badge?: string;
  title: ReactNode;
  lead?: ReactNode;
  primary?: { to: string; label: string };
  secondary?: { to: string; label: string };
  chip?: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const hasAside = Boolean(props.aside);
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/6 to-transparent">
      <div
        className={cn(
          "container-site pt-14 pb-14 md:pt-20 md:pb-16",
          hasAside && "grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center",
        )}
      >
        <div>
          {props.badge ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {props.badge}
            </span>
          ) : null}
          <h1 className="h1 mt-6 max-w-3xl">{props.title}</h1>
          {props.lead ? <p className="lead mt-6">{props.lead}</p> : null}
          {props.primary || props.secondary ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {props.primary ? (
                <ButtonLink to={props.primary.to} className="min-h-11 w-full sm:w-auto">
                  {props.primary.label}
                </ButtonLink>
              ) : null}
              {props.secondary ? (
                <ButtonLink
                  to={props.secondary.to}
                  variant="secondary"
                  className="min-h-11 w-full sm:w-auto"
                >
                  {props.secondary.label}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
          {props.chip ? (
            <p className="mt-8">
              <StatusChip tone="review">{props.chip}</StatusChip>
            </p>
          ) : null}
          {props.children}
        </div>
        {hasAside ? <Reveal>{props.aside}</Reveal> : null}
      </div>
    </section>
  );
}

export function CtaBand(props: {
  heading: string;
  lead?: string;
  primary: { to: string; label: string };
  secondary?: { to: string; label: string };
}) {
  return (
    <section className="hairline-t bg-muted/40">
      <div className="container-site py-16 text-center md:py-20">
        <h2 className="h2 mx-auto max-w-2xl">{props.heading}</h2>
        {props.lead ? <p className="lead mx-auto mt-5">{props.lead}</p> : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink to={props.primary.to} className="min-h-11 w-full sm:w-auto">
            {props.primary.label}
          </ButtonLink>
          {props.secondary ? (
            <ButtonLink
              to={props.secondary.to}
              variant="secondary"
              className="min-h-11 w-full sm:w-auto"
            >
              {props.secondary.label}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Icon + label signal strip, matching the homepage trust strip. */
export function SignalStrip(props: {
  label: string;
  items: { icon: React.ComponentType<{ className?: string }>; label: string }[];
}) {
  return (
    <section aria-label={props.label} className="border-y border-border bg-muted/40">
      <ul className="container-site grid grid-cols-2 gap-x-6 gap-y-4 py-6 sm:grid-cols-3 lg:grid-cols-5">
        {props.items.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5">
            <s.icon className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="text-[0.8125rem] font-medium tracking-tight text-foreground">
              {s.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
