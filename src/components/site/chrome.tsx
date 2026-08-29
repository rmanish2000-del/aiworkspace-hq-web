import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { experience, nav } from "@/content/copy";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background">
      <div className="container-site flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="AI Workspace home">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary font-mono text-[0.6875rem] font-bold text-primary-foreground">
            AW
          </span>
          <span className="text-[0.9375rem] font-semibold tracking-tight">AI Workspace</span>
        </Link>

        <nav aria-label={nav.label} className="hidden items-center gap-6 lg:flex">
          {nav.items.map((item) => (
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
            href={experience.nav.primaryHref}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {experience.nav.primaryAction}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md border border-border lg:hidden"
          aria-expanded={open}
          aria-label={open ? experience.nav.menu : experience.nav.menu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border lg:hidden">
          <nav aria-label={nav.label} className="container-site flex flex-col py-4">
            <p className="eyebrow pb-3">{experience.nav.menuEyebrow}</p>
            {nav.items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 text-[0.9375rem] last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={experience.nav.primaryHref}
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {experience.nav.primaryAction}
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
      { href: "/platform", label: "Platform" },
      { href: "/products", label: "Products" },
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
              <span className="flex size-6 items-center justify-center rounded-md bg-primary font-mono text-[0.6875rem] font-bold text-primary-foreground">
                AW
              </span>
              <span className="text-[0.9375rem] font-semibold tracking-tight">AI Workspace</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {experience.footer.statement}
            </p>
          </div>
          {footerColumns.map((col) => (
            <nav key={col.label} aria-label={col.label}>
              <p className="eyebrow">{col.label}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={cn(
                        "text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground",
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
          <p>{experience.footer.status}</p>
          <p>© 2026 AI Workspace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
