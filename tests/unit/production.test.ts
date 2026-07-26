import { describe, expect, it } from 'vitest';

import { CACHE_RULES, securityHeaders } from '../../src/lib/production';
import {
  DEFERRED_URLS,
  SECURITY_TXT_VALIDITY_DAYS,
  atomFeed,
  humansTxt,
  securityTxt,
} from '../../src/lib/deferred-static';
import { cspHashFor, organizationJsonLd } from '../../src/lib/structured-data';

/**
 * Production-readiness regressions — the parts that are pure logic.
 *
 * ⚠️ Nothing here reads `dist/`. An earlier revision did, and it passed locally
 * only because a previous build had left the directory behind — on a clean
 * checkout the unit job runs before any build, so those assertions were a false
 * green. Everything that inspects built output now lives in
 * `tests/e2e/production.spec.ts`, which runs against a served build.
 *
 * The rule this encodes: a unit test must not depend on a build artifact.
 */

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

  it('quotes hash sources, because bare ones are silently ignored', () => {
    /**
     * P2-B defect CSP-1, frozen as a regression.
     *
     * CSP hash sources are quoted — `'sha256-…'`. Emitted bare they are invalid
     * syntax: Chrome logs "contains an invalid source … It will be ignored" and
     * drops the source on every page. That was live in production and was only
     * caught by loading the site in a real browser, because a string-equality
     * check on the header sees nothing wrong with an unquoted hash.
     */
    const hash = cspHashFor(organizationJsonLd('example'));
    const csp = securityHeaders([hash]).find((h) => h.name === 'Content-Security-Policy')!.value;
    const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src'))!;

    expect(scriptSrc).toContain(`'${hash}'`);
    // Every non-keyword source in script-src must be a quoted hash.
    for (const source of scriptSrc.trim().split(/\s+/).slice(1)) {
      expect(source, `unquoted CSP source: ${source}`).toMatch(/^'.*'$/);
    }
  });

  it('does not double-quote a hash that arrives already quoted', () => {
    const csp = securityHeaders(["'sha256-abc='"]).find(
      (h) => h.name === 'Content-Security-Policy',
    )!.value;
    expect(csp).toContain("'sha256-abc='");
    expect(csp).not.toContain("''");
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

  it('gives every deferred URL a stated blocker', () => {
    // That none of them is EMITTED is asserted in tests/e2e/production.spec.ts,
    // against a served build. Checking for an absent file here would pass
    // vacuously on a clean checkout, which is not a check.
    expect(DEFERRED_URLS.length).toBeGreaterThan(0);
    for (const { url, blockedBy } of DEFERRED_URLS) {
      expect(url.startsWith('/'), url).toBe(true);
      expect(blockedBy.length, `${url} has no stated blocker`).toBeGreaterThan(10);
    }
  });
});
