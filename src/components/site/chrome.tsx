import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { PLAN_HREF } from "@/content/caid";
import { experience, nav } from "@/content/copy";
import { cn } from "@/lib/utils";

const primaryNav = [
  { href: "/services", label: "Services" },
  { href: "/process", label: "The 12 steps" },
  { href: "/products", label: "Products" },
  { href: "/trust", label: "Trust" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between gap-6">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-2.5"
          aria-label="AI Workspace HQ home"
        >
          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-full border-2 border-[var(--color-verified)] font-display text-[0.8125rem] font-bold text-[var(--color-verified)] -rotate-6"
          >
            AW
          </span>
          <span className="font-display text-[1.0625rem] font-semibold tracking-tight">
            AI Workspace
          </span>
        </Link>

        <nav aria-label={nav.label} className="hidden items-center gap-8 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href={PLAN_HREF}
            data-cta="header"
            className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Ask for a plan
          </a>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md border border-border lg:hidden"
          aria-expanded={open}
          aria-label={experience.nav.menu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border lg:hidden">
          <nav aria-label={nav.label} className="container-site flex flex-col py-4">
            <p className="eyebrow pb-3">{experience.nav.menuEyebrow}</p>
            {[
              ...primaryNav,
              ...nav.items.filter((i) => !primaryNav.some((p) => p.href === i.href)),
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center border-b border-border py-3 text-[0.9375rem] last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={PLAN_HREF}
              data-cta="header"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              Ask for a plan
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

const footerColumns = [
  {
    label: experience.footer.explore,
    links: [
      { href: "/services", label: "Services" },
      { href: "/process", label: "The 12 steps" },
      { href: "/products", label: "Products" },
      { href: "/platform", label: "Platform" },
      { href: "/building", label: "What we are building" },
      { href: "/about", label: nav.about },
    ],
  },
  {
    label: experience.footer.verify,
    links: [
      { href: "/trust", label: "Trust" },
      { href: "/technology", label: "Technology" },
      { href: "/security", label: nav.security },
      { href: "/what-we-havent-built", label: "The gap list" },
      { href: "/principles", label: "Principles" },
    ],
  },
  {
    label: experience.footer.engage,
    links: [
      { href: "/enterprise", label: nav.enterprise },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/delivery", label: "Delivery" },
      { href: "/refunds", label: "Refunds" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="container-site py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="flex size-6 -rotate-6 items-center justify-center rounded-full border-2 border-[var(--color-verified)] font-display text-[0.625rem] font-bold text-[var(--color-verified)]"
              >
                AW
              </span>
              <span className="text-[0.9375rem] font-semibold tracking-tight">AI Workspace</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              We put AI on one repeated job at a time, through a process where every step leaves a
              receipt you can check.
            </p>
          </div>
          {footerColumns.map((col) => (
            <nav key={col.label} aria-label={col.label}>
              <p className="eyebrow">{col.label}</p>
              <ul className="mt-1 md:mt-4 md:space-y-1.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={cn(
                        "inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground md:min-h-0 md:py-1",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>Customer AI deployment services. Products: Warrant and Warrant MCP.</p>
          <p>© 2026 AI Workspace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
