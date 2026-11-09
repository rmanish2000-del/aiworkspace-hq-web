/** Shared SEO head fragments. Free / first-party only — no trackers. */
export const SITE_ORIGIN = "https://aiworkspacehq.com";

export function absoluteUrl(path: string): string {
  if (!path || path === "/") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  /** Extra JSON-LD objects merged into head as script:ld+json entries */
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

/** Meta + canonical + OG/Twitter for one route. Merge with route-specific head. */
export function pageSeo(input: PageSeoInput) {
  const url = absoluteUrl(input.path);
  const blocks = input.jsonLd
    ? Array.isArray(input.jsonLd)
      ? input.jsonLd
      : [input.jsonLd]
    : [];
  return {
    meta: [
      { title: input.title },
      { name: "description", content: input.description },
      { property: "og:title", content: input.title },
      { property: "og:description", content: input.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: input.title },
      { name: "twitter:description", content: input.description },
      ...blocks.map((block) => ({ "script:ld+json": block })),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
