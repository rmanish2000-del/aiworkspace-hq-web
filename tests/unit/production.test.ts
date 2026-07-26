import { readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { CACHE_RULES, CRAWLABLE, securityHeaders } from '../../src/lib/production';
import {
  DEFERRED_URLS,
  SECURITY_TXT_VALIDITY_DAYS,
  atomFeed,
  humansTxt,
  securityTxt,
} from '../../src/lib/deferred-static';
import { cspHashFor, organizationJsonLd } from '../../src/lib/structured-data';

/**
 * Production-readiness regressions.
 *
 * These assert the things that are cheap to get right now and expensive to
 * discover on deployment day: header expectations, byte budgets, and the
 * scaffolds that must stay unemitted until their blocker clears.
 */

const DIST = resolve(process.cwd(), 'dist');

/* -------------------------------------------------------------------------- */
/* Security headers — `08` §9.2                                               */
/* -------------------------------------------------------------------------- */

describe('security headers', () => {
  const headers = securityHeaders();
  const byName = new Map(headers.map((h) => [h.name, h.value]));

  it('declares every header `08` §9.2 requires', () => {
    expect([...byName.keys()].sort()).toEqual(
      [
        'Content-Security-Policy',
        'Cross-Origin-Opener-Policy',
        'Cross-Origin-Resource-Policy',
        'Permissions-Policy',
        'Referrer-Policy',
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'X-Frame-Options',
      ].sort(),
    );
  });

  it('matches the `08` §9.2 values exactly', () => {
    expect(byName.get('X-Content-Type-Options')).toBe('nosniff');
    expect(byName.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(byName.get('X-Frame-Options')).toBe('DENY');
    expect(byName.get('Cross-Origin-Opener-Policy')).toBe('same-origin');
    expect(byName.get('Cross-Origin-Resource-Policy')).toBe('same-origin');
    expect(byName.get('Permissions-Policy')).toBe(
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
    );
  });

  it('never sets HSTS preload', () => {
    // `08` SEC-04 / DEC-024 — submitting to the preload list is effectively
    // irreversible and must not be done on day one.
    expect(byName.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains');
    expect(byName.get('Strict-Transport-Security')).not.toContain('preload');
  });

  it('keeps the CSP free of unsafe-eval, and of unsafe-inline in script-src', () => {
    const csp = byName.get('Content-Security-Policy')!;
    expect(csp).not.toContain("'unsafe-eval'");

    const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src'))!;
    expect(scriptSrc).not.toContain("'unsafe-inline'");

    // `08` §9.2 permits it in style-src only, because the critical CSS is inlined.
    const styleSrc = csp.split(';').find((d) => d.trim().startsWith('style-src'))!;
    expect(styleSrc).toContain("'unsafe-inline'");
  });

  it('extends script-src with a hash rather than loosening it', () => {
    const hash = cspHashFor(organizationJsonLd('example'));
    expect(hash).toMatch(/^sha256-[A-Za-z0-9+/]+=*$/);

    const csp = securityHeaders([hash]).find((h) => h.name === 'Content-Security-Policy')!.value;
    const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src'))!;

    expect(scriptSrc).toContain("'self'");
    expect(scriptSrc).toContain(hash);
    expect(scriptSrc).not.toContain("'unsafe-inline'");
  });

  it('names no bot-mitigation origin', () => {
    // P-08. `08` §9.2 would extend script-src and frame-src to exactly one
    // origin if Turnstile were enabled. It is not.
    const csp = byName.get('Content-Security-Policy')!;
    expect(csp).not.toContain('challenges.cloudflare.com');
    expect(csp).not.toContain('frame-src');
  });
});

/* -------------------------------------------------------------------------- */
/* CSP hash covers the block the page actually renders                        */
/* -------------------------------------------------------------------------- */

describe('CSP hash', () => {
  it('is computed over the exact bytes rendered into the page', () => {
    // If these ever diverge, the CSP silently stops covering the block — and a
    // page that loses its structured data reports nothing to a visitor.
    const html = readFileSync(join(DIST, 'index.html'), 'utf8');
    const rendered = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];

    expect(rendered, 'no JSON-LD block found in dist/index.html').toBeTruthy();

    const description = JSON.parse(rendered!).description;
    expect(organizationJsonLd(description)).toBe(rendered);
  });

  it('produces a stable hash for identical input', () => {
    const a = cspHashFor(organizationJsonLd('x'));
    const b = cspHashFor(organizationJsonLd('x'));
    expect(a).toBe(b);
    expect(cspHashFor(organizationJsonLd('y'))).not.toBe(a);
  });
});

/* -------------------------------------------------------------------------- */
/* Cache policy                                                               */
/* -------------------------------------------------------------------------- */

describe('cache policy', () => {
  it('never long-caches a route document', () => {
    // `08` OPS-08 requires rollback in under two minutes without a rebuild. A
    // long-lived HTML cache would keep serving the rolled-back document.
    const html = CACHE_RULES.find((r) => r.match.includes('.html'))!;
    expect(html.cacheControl).toContain('max-age=0');
    expect(html.cacheControl).toContain('must-revalidate');
  });

  it('immutably caches only content-hashed assets', () => {
    for (const rule of CACHE_RULES) {
      if (rule.cacheControl.includes('immutable')) {
        expect(rule.match, `${rule.match} is immutable but not content-hashed`).toMatch(/hash/i);
      }
    }
  });

  it('gives every rule a stated reason', () => {
    for (const rule of CACHE_RULES) {
      expect(rule.why.length, rule.match).toBeGreaterThan(20);
    }
  });
});

/* -------------------------------------------------------------------------- */
/* Deferred files stay deferred                                               */
/* -------------------------------------------------------------------------- */

describe('deferred static files', () => {
  it('refuses to build an empty feed', () => {
    // An empty feed announces a publishing cadence nobody has decided.
    expect(() => atomFeed([], new Date(0))).toThrow(/empty feed/i);
  });

  it('builds a valid feed once there is something to syndicate', () => {
    const xml = atomFeed(
      [
        {
          title: 'Example',
          url: 'https://aiworkspacehq.com/x',
          published: new Date(0),
          summary: 'Example',
        },
      ],
      new Date(0),
    );
    expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
    expect(xml).toContain('<entry>');
  });

  it('refuses a security.txt with no contact', () => {
    // RFC 9116 §2.5.3 makes Contact mandatory, and an address that bounces
    // tells a researcher they have reported something when they have not.
    expect(() => securityTxt('', new Date())).toThrow(/Contact/);
  });

  it('builds a valid security.txt once a mailbox exists', () => {
    const txt = securityTxt('mailto:security@example.com', new Date('2027-01-01T00:00:00Z'));
    expect(txt).toContain('Contact: mailto:security@example.com');
    expect(txt).toContain('Expires: 2027-01-01T00:00:00Z');
    expect(txt).toContain('Canonical: https://aiworkspacehq.com/.well-known/security.txt');
    expect(SECURITY_TXT_VALIDITY_DAYS).toBeLessThan(366);
  });

  it('refuses a humans.txt with nobody in it', () => {
    expect(() => humansTxt([])).toThrow();
  });

  it('emits none of the deferred files', () => {
    // The scaffolds exist; the routes do not.
    for (const { url } of DEFERRED_URLS) {
      const path = join(DIST, url.replace(/^\//, ''));
      let exists = true;
      try {
        statSync(path);
      } catch {
        exists = false;
      }
      expect(exists, `${url} was emitted but is still blocked`).toBe(false);
    }
  });
});

/* -------------------------------------------------------------------------- */
/* Crawler-facing files agree with the indexability constant                  */
/* -------------------------------------------------------------------------- */

describe('crawl directives', () => {
  it('keeps robots.txt and the noindex meta tag in agreement', () => {
    // `08` SEO-10 names indexing mistakes in BOTH directions as the common
    // failure. One constant drives both, so they cannot disagree.
    const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
    const html = readFileSync(join(DIST, 'index.html'), 'utf8');

    if (CRAWLABLE) {
      expect(robots).toContain('Allow: /');
      expect(html).not.toMatch(/name="robots" content="[^"]*noindex/);
    } else {
      expect(robots).toContain('Disallow: /');
      expect(html).toMatch(/name="robots" content="[^"]*noindex/);
    }
  });

  it('references the sitemap either way', () => {
    const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
    expect(robots).toContain('Sitemap: https://aiworkspacehq.com/sitemap.xml');
  });
});

/* -------------------------------------------------------------------------- */
/* Bundle regression — `08` §8                                                */
/* -------------------------------------------------------------------------- */

describe('bundle budgets', () => {
  const ROUTES = ['index', 'platform', 'principles', 'contact', 'privacy', '404'];

  /** `08` §8: total transferred (HTML+CSS+JS, gzipped) <= 60 KB, target <= 35 KB. */
  const TOTAL_BUDGET_GZ = 60 * 1024;
  const TOTAL_TARGET_GZ = 35 * 1024;

  it.each(ROUTES)('%s.html stays inside the transfer budget', (route) => {
    const bytes = readFileSync(join(DIST, `${route}.html`));
    const gz = gzipSync(bytes).length;

    expect(gz, `${route}.html is ${gz} B gzipped`).toBeLessThanOrEqual(TOTAL_BUDGET_GZ);
    // Not an assertion — a tripwire. If a route crosses the target, the budget
    // is still met but the headroom is worth knowing about.
    expect(gz).toBeLessThanOrEqual(TOTAL_TARGET_GZ);
  });

  it('ships zero client JavaScript', () => {
    // `08` ARCH-06 — <=10 KB gzipped. This build meets it by shipping nothing.
    const html = readFileSync(join(DIST, 'index.html'), 'utf8');
    const scripts = [...html.matchAll(/<script([^>]*)>/g)].map((m) => m[1] ?? '');
    const executable = scripts.filter((attrs) => !attrs.includes('application/ld+json'));

    expect(executable).toEqual([]);
  });

  it('ships zero web fonts', () => {
    // `08` §8 budget is 0, and `07` §3 specifies a system stack.
    const html = readFileSync(join(DIST, 'index.html'), 'utf8');
    expect(html).not.toMatch(/@font-face/);
    expect(html).not.toMatch(/\.woff2?/);
  });
});
