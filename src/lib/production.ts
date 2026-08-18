import { IS_INDEXABLE } from './site';

/**
 * production.ts — the host configuration this repository cannot apply itself.
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ NOTHING HERE IS APPLIED. IT IS A SPECIFICATION, NOT A DEPLOYMENT.         │
 * │                                                                           │
 * │ Response headers and cache policy are set by a host. No host exists:      │
 * │ TDR-03 is unsigned, AWHQ-AUT-P1F P-02 forbids opening a hosting account,  │
 * │ and P-01 forbids deploying. So this module states, in one machine-        │
 * │ readable place, exactly what must be configured when a host is chosen —   │
 * │ and `scripts/check-headers.mjs` verifies a real deployment against it.    │
 * │                                                                           │
 * │ It is deliberately HOST-AGNOSTIC. A `_headers` file, a `vercel.json`, or  │
 * │ an `nginx.conf` would each be a hosting-vendor artifact, and choosing one │
 * │ is the technology decision TDR-03 has not made.                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

export interface HeaderRequirement {
  readonly name: string;
  readonly value: string;
  readonly source: string;
}

/**
 * P0 `08` §9.2, transcribed exactly.
 *
 * `style-src 'unsafe-inline'` is required by the inlined critical CSS
 * (`08` §8 mandates inlining it). `08` §9.2 records that a stricter posture
 * would move to hash-based `style-src` later.
 *
 * If bot mitigation is ever enabled, `08` §9.2 extends `script-src` and
 * `frame-src` to `https://challenges.cloudflare.com` **and only that origin**.
 * It is not enabled (P-08), so it is not here.
 */
export function securityHeaders(scriptHashes: readonly string[] = []): HeaderRequirement[] {
  /**
   * P2-B defect CSP-1. Hash sources are QUOTED in CSP — `'sha256-…'`, not
   * `sha256-…`. Emitted bare, Chrome reports
   *
   *   The source list for the Content Security Policy directive 'script-src'
   *   contains an invalid source: 'sha256-…'. It will be ignored.
   *
   * and drops the source, on every page. The site stayed safe because dropping
   * a source only makes the policy stricter and the JSON-LD is a data block
   * that is never executed — but the directive did not do what it said, and a
   * future inline script relying on its hash would have been silently blocked.
   *
   * Quoting is applied here rather than in `cspHashFor`, because the quotes are
   * CSP syntax: the hash value itself is what a caller wants everywhere else.
   * Already-quoted input is passed through so callers cannot double-quote it.
   */
  const quoted = scriptHashes.map((hash) => (hash.startsWith("'") ? hash : `'${hash}'`));
  const scriptSrc = ["'self'", ...quoted].join(' ');

  return [
    {
      name: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        `script-src ${scriptSrc}`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "base-uri 'none'",
        "object-src 'none'",
        'upgrade-insecure-requests',
      ].join('; '),
      source: '`08` §9.2',
    },
    {
      name: 'Strict-Transport-Security',
      // `08` SEC-04: `preload` is added only after 30 days of stable operation.
      // Submitting to the preload list is effectively irreversible (DEC-024).
      value: 'max-age=31536000; includeSubDomains',
      source: '`08` §9.2, SEC-04',
    },
    { name: 'X-Content-Type-Options', value: 'nosniff', source: '`08` §9.2' },
    {
      name: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
      source: '`08` §9.2',
    },
    { name: 'X-Frame-Options', value: 'DENY', source: '`08` §9.2' },
    {
      name: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
      source: '`08` §9.2',
    },
    { name: 'Cross-Origin-Opener-Policy', value: 'same-origin', source: '`08` §9.2' },
    { name: 'Cross-Origin-Resource-Policy', value: 'same-origin', source: '`08` §9.2' },
  ];
}

/**
 * The CSP for /checkout ONLY (R4-CHECKOUT, 2026-08-18) — the single payment
 * surface. The Razorpay checkout requires its script, its iframe and its API
 * origins; nothing else on this site loosens, exactly as the /warrant proxy
 * subtree set the precedent. Origins are Razorpay's published requirements:
 * checkout.razorpay.com (script + frame), cdn.razorpay.com (the risk-
 * detection bundle checkout.js injects — observed in the e2e run, not
 * guessed), api.razorpay.com (calls + frame), lumberjack(-cx).razorpay.com
 * (their checkout telemetry — theirs, not ours).
 * `payment=(self)` relaxes the Permissions-Policy on this route alone.
 */
export function checkoutSecurityHeaders(): HeaderRequirement[] {
  const base = securityHeaders();
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://cdn.razorpay.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://*.razorpay.com",
    "font-src 'self' https://checkout.razorpay.com",
    "connect-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://lumberjack.razorpay.com https://lumberjack-cx.razorpay.com",
    'frame-src https://api.razorpay.com https://checkout.razorpay.com',
    "form-action 'self' https://api.razorpay.com",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
  return base.map((header) => {
    if (header.name === 'Content-Security-Policy') {
      return { ...header, value: csp, source: 'R4-CHECKOUT 2026-08-18' };
    }
    if (header.name === 'Permissions-Policy') {
      return {
        ...header,
        value: header.value.replace('payment=()', 'payment=(self)'),
        source: 'R4-CHECKOUT 2026-08-18',
      };
    }
    return header;
  });
}

/**
 * Cache policy. `08` §8: "immutable long-cache headers on hashed assets and a
 * short cache on HTML".
 *
 * The reason HTML must not be long-cached is operational rather than
 * aesthetic: `08` OPS-08 requires rollback in under two minutes without a
 * rebuild, and a long-lived HTML cache would keep serving the rolled-back
 * document from the edge and from every visitor's browser.
 */
export interface CacheRule {
  readonly match: string;
  readonly cacheControl: string;
  readonly why: string;
}

export const CACHE_RULES: readonly CacheRule[] = [
  {
    match: '/*.html and every route document',
    cacheControl: 'public, max-age=0, must-revalidate',
    why: 'Rollback must take effect immediately (`08` OPS-08). Revalidation is cheap; a stale document after a rollback is not.',
  },
  {
    match: '/_astro/* (content-hashed assets)',
    cacheControl: 'public, max-age=31536000, immutable',
    why: 'The filename changes when the content changes, so the response can never be wrong.',
  },
  {
    match: '/favicon.svg, /favicon.ico, /apple-touch-icon.png, /og-image.png',
    cacheControl: 'public, max-age=86400',
    why: 'Not content-hashed, so a long cache would pin a stale icon. One day is long enough to matter and short enough to fix.',
  },
  {
    match: '/site.webmanifest, /browserconfig.xml',
    cacheControl: 'public, max-age=86400',
    why: 'Same reasoning as the icons they reference.',
  },
  {
    match: '/robots.txt, /sitemap.xml',
    cacheControl: 'public, max-age=3600',
    why: 'Crawler-facing. An hour bounds how long a stale directive survives a correction.',
  },
  {
    match: '/.well-known/security.txt',
    cacheControl: 'public, max-age=3600',
    why: 'RFC 9116 expects it to be current; the file carries its own Expires field.',
  },
] as const;

/**
 * Whether crawler-facing files should describe an indexable site.
 *
 * Single source of truth, shared with the `noindex` meta tag. A robots.txt that
 * invited crawling while every page said `noindex` would be two statements of
 * the same fact that can disagree — and `08` SEO-10 names indexing mistakes in
 * *both* directions as the common failure.
 */
export const CRAWLABLE = IS_INDEXABLE;
