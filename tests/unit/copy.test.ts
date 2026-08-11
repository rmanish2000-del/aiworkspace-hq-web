import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import * as copyModule from '../../src/content/copy';
import {
  BUILD_TIME_PLACEHOLDER_KEYS,
  PROVISIONAL,
  RUNTIME_PLACEHOLDER_KEYS,
  copy,
  interest,
  meta,
} from '../../src/content/copy';

/**
 * These are the most important tests in the suite.
 *
 * They are the mechanical enforcement of `02-approved-terminology-and-claims.md`
 * (DEC-027), and they are the reason a future copy change cannot quietly
 * reintroduce a prohibited claim. A green run here is not a licence to skip the
 * manual read in P0 `11` §8 M-9/M-10 — the automated test catches known strings;
 * a human catches novel phrasings.
 */

/** Vitest runs with the repository root as cwd (see vitest.config.ts). */
const SRC_DIR = resolve(process.cwd(), 'src');

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

type StringEntry = { path: string; value: string };

/** Flattens a nested object into dotted-path/string pairs. */
function collectStrings(value: unknown, path = ''): StringEntry[] {
  if (typeof value === 'string') return [{ path, value }];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStrings(item, `${path}[${index}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      collectStrings(child, path === '' ? key : `${path}.${key}`),
    );
  }
  return [];
}

function walkFiles(dir: string, extensions: string[]): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walkFiles(full, extensions);
    return extensions.some((ext) => full.endsWith(ext)) ? [full] : [];
  });
}

function escapeRegExp(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Removes comments so that a guard scanning for a forbidden *construct* is not
 * tripped by prose explaining why that construct is absent.
 *
 * Line comments are stripped only when `//` begins the line, so that the `//`
 * in a URL literal survives — the third-party-origin guard depends on it.
 */
function stripComments(source: string): string {
  return source
    .replace(/<!--[\s\S]*?-->/g, ' ') // HTML comments
    .replace(/\/\*[\s\S]*?\*\//g, ' ') // block comments, incl. JSDoc
    .replace(/^[ \t]*\/\/.*$/gm, ' '); // whole-line comments
}

/**
 * Whole-word, case-insensitive match, as `02` §1.3's enforcement note requires.
 * There is no "but it's a denial" exemption.
 */
function containsTerm(haystack: string, term: string): boolean {
  return new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(term)}(?![\\p{L}\\p{N}])`, 'iu').test(
    haystack,
  );
}

/** Every visible string, including the quarantined provisional ones. */
const ALL_STRINGS: StringEntry[] = [
  ...collectStrings(copy),
  ...collectStrings(PROVISIONAL, 'PROVISIONAL'),
];

/* -------------------------------------------------------------------------- */
/* Prohibited terminology — `02` §1.3                                         */
/* -------------------------------------------------------------------------- */

const PROHIBITED_TERMS: readonly string[] = [
  // Internal programme and product names
  'AI Workspace HQ',
  'ProjectOS',
  'TradeOS',
  'EduOS',
  'UrjaOps',
  'Legal Engineering',

  // Internal architecture vocabulary
  'control plane',
  'execution contract',
  'knowledge graph schema',
  'frozen module',

  // Category conflicts
  'operating system',
  'AI OS',
  'platform of record',
  'system of record',

  // Agent overclaims
  'autonomous',
  'fully autonomous',
  'self-directed',

  // Unverifiable security claims
  'secure by default',
  'enterprise-grade security',
  'bank-grade',

  // Certification and compliance
  'compliant',
  'certified',
  'audited',
  'SOC 2',
  'ISO 27001',
  'GDPR-compliant',
  'HIPAA',

  // Release status
  'GA',
  'generally available',
  'in production',
  'production-ready',
  'launched',
  'live',

  // Adoption
  'customers',
  'clients',
  'users',
  'trusted by',
  'used by',

  // Hype vocabulary
  'seamless',
  'effortless',
  'instantly',
  'magically',
  'revolutionary',
  'game-changing',
  'unlock',
  'supercharge',
  '10x',
  'cutting-edge',
  'next-generation',
  'best-in-class',
  'world-class',

  // Product characteristics
  'no-code',
  'zero-code',

  /**
   * Pricing and forward-plan vocabulary. `02` §3 prohibits the Pricing and
   * Dates domains; these are the two words that most often smuggle them in.
   *
   * P1-J §7.1 depends on this gate existing. Its first draft of a `/principles`
   * line read "There is no pricing… and no roadmap on this site." — a denial,
   * which `02` §1.3's enforcement note says still counts. The shipped wording
   * ("no price, no availability date, and no forward plan") says the same thing
   * and passes. Removing these two entries would silently un-protect that.
   */
  'pricing',
  'roadmap',

  // Contradicts "extend before replace"
  'replaces',
  'eliminates the need for',
];

/**
 * Concrete phrasings from `02` §3. That list is exhaustive of the prohibited
 * *domains* and non-exhaustive of the phrasings, so this is a floor, not a
 * ceiling — M-10 (manual read) remains required.
 */
const PROHIBITED_CLAIM_PHRASES: readonly string[] = [
  'available now',
  'battle-tested',
  'trusted by',
  'used by teams at',
  'our customers',
  'penetration tested',
  'EU AI Act ready',
  'compliant by design',
  'highly available',
  'always on',
  'sub-second',
  'scales infinitely',
  'cut costs by',
  'pays for itself',
  'no hallucinations',
  'reliable answers',
  'deploy in your VPC',
  'on-premise available',
  'data never leaves',
  'proprietary model',
  'patented',
  'our breakthrough',
  'backed by',
  'growing fast',
  'starting at',
  'free tier',
  'founding customer pricing',
  'coming soon',
];

describe('copy.prohibited', () => {
  it('contains no prohibited term from `02` §1.3, in any visible string', () => {
    const violations = ALL_STRINGS.flatMap(({ path, value }) =>
      PROHIBITED_TERMS.filter((term) => containsTerm(value, term)).map(
        (term) => `${path}: prohibited term "${term}" in ${JSON.stringify(value)}`,
      ),
    );

    expect(violations).toEqual([]);
  });

  it('contains no prohibited claim phrasing from `02` §3', () => {
    const violations = ALL_STRINGS.flatMap(({ path, value }) =>
      PROHIBITED_CLAIM_PHRASES.filter((phrase) =>
        value.toLowerCase().includes(phrase.toLowerCase()),
      ).map((phrase) => `${path}: prohibited claim "${phrase}" in ${JSON.stringify(value)}`),
    );

    expect(violations).toEqual([]);
  });

  it('has a prohibited-term list that actually fires', () => {
    // Guards the guard: a matcher that never matches is worse than no matcher.
    expect(containsTerm('We are trusted by nobody', 'trusted by')).toBe(true);
    expect(containsTerm('Our customers say so', 'customers')).toBe(true);
    // ...and does not fire on a substring of a longer word.
    expect(containsTerm('auditable as design intent', 'audited')).toBe(false);
    expect(containsTerm('Enterprise AI Operating Layer', 'operating system')).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* Placeholders — `04` header note                                            */
/* -------------------------------------------------------------------------- */

describe('copy.placeholders', () => {
  it('has build-time {{...}} placeholders in exactly the declared strings', () => {
    const found = ALL_STRINGS.filter(({ value }) => /\{\{[^}]+\}\}/.test(value))
      .map(({ path }) => path)
      .sort();

    expect(found).toEqual([...BUILD_TIME_PLACEHOLDER_KEYS].sort());
  });

  it('has runtime %name% placeholders in exactly the two strings `04` specifies', () => {
    const found = ALL_STRINGS.filter(({ value }) => /%[a-z]+%/i.test(value))
      .map(({ path }) => path)
      .sort();

    expect(found).toEqual([...RUNTIME_PLACEHOLDER_KEYS].sort());
  });

  it('declares every placeholder key as a real path in the copy module', () => {
    const knownPaths = new Set(ALL_STRINGS.map(({ path }) => path));

    for (const key of [...BUILD_TIME_PLACEHOLDER_KEYS, ...RUNTIME_PLACEHOLDER_KEYS]) {
      expect(knownPaths).toContain(key);
    }
  });
});

/* -------------------------------------------------------------------------- */
/* Verbatim invariants that `04` states about itself                          */
/* -------------------------------------------------------------------------- */

describe('copy.verbatim', () => {
  it('matches the character counts `04` §1 asserts', () => {
    // `04` §1 states these lengths explicitly — "verified by count, not estimated".
    expect(meta.titleHome).toHaveLength(44);
    expect(meta.descriptionHome).toHaveLength(166);
  });

  it('keeps the duplicate-submission string byte-for-byte equal to the success heading', () => {
    // `04` §5.6 and `05` §6. A divergence here leaks whether an address is known.
    expect(interest.formErrors.duplicate).toBe(interest.successHeading);
    expect(interest.formErrors.duplicate.endsWith('.')).toBe(false);
  });

  it('preserves the four binding commitments verbatim', () => {
    // C-11 — `02` §2, stage disclosure.
    expect(copy.hero.stageDisclosure).toBe(
      'AI Workspace is in development. Early access is not yet open.',
    );

    // C-12, C-13, C-14 all live inside the privacy micro-notice, `04` §5.4.
    const notice = interest.privacyMicroNotice;
    expect(notice).toContain('We will only contact you about AI Workspace early access.');
    expect(notice).toContain('We do not sell or share this information');
    expect(notice).toContain('we do not use tracking cookies on this site');

    // `02` §2 wording rule: the commitments say "site", never "page".
    expect(notice).not.toContain('on this page');
  });

  it('uses sentence case for headings and no trailing punctuation on them', () => {
    // `02` §1.4.
    const headings = [
      copy.hero.headline,
      copy.principles.heading,
      copy.interest.heading,
      copy.notFound.heading,
      ...copy.principles.items.map((item) => item.title),
    ];

    for (const heading of headings) {
      expect(heading, `trailing punctuation in "${heading}"`).not.toMatch(/[.!?:;]$/);
    }
  });

  it('keeps the five principles in the approved order', () => {
    expect(copy.principles.items.map((item) => item.title)).toEqual([
      'Connect before migrate',
      'Understand before automate',
      'Extend before replace',
      'Reuse before rebuild',
      'Evidence before claims',
    ]);
  });
});

/* -------------------------------------------------------------------------- */
/* Provisional quarantine                                                     */
/* -------------------------------------------------------------------------- */

describe('copy.provisionalIsFrozen', () => {
  it('holds exactly the two escalated specification gaps and nothing more', () => {
    // If this fails, a string was added to PROVISIONAL rather than escalated.
    // That is the failure mode this test exists to prevent. Do not "fix" it by
    // updating the expectation — raise the gap with the founder first.
    expect(Object.keys(PROVISIONAL).sort()).toEqual(['notFoundTitle', 'skipLinkText']);
  });

  it('subjects provisional strings to the same prohibited-term gate', () => {
    const provisional = collectStrings(PROVISIONAL, 'PROVISIONAL');
    const violations = provisional.flatMap(({ path, value }) =>
      PROHIBITED_TERMS.filter((term) => containsTerm(value, term)).map(
        (term) => `${path}: ${term}`,
      ),
    );

    expect(violations).toEqual([]);
  });
});

/* -------------------------------------------------------------------------- */
/* Completeness — every key a template imports actually exists                */
/* -------------------------------------------------------------------------- */

describe('copy.completeness', () => {
  it('resolves every named import of the copy module used anywhere in src/', () => {
    const files = walkFiles(SRC_DIR, ['.astro', '.ts']).filter(
      (file) => !file.endsWith(join('content', 'copy.ts')),
    );

    const exported = new Set(Object.keys(copyModule));
    const missing: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      const importPattern = /import\s*\{([^}]+)\}\s*from\s*['"][^'"]*content\/copy['"]/g;

      for (const match of source.matchAll(importPattern)) {
        const names = (match[1] ?? '')
          .split(',')
          .map((name) =>
            name
              .trim()
              .split(/\s+as\s+/)[0]
              ?.trim(),
          )
          .filter((name): name is string => Boolean(name));

        for (const name of names) {
          if (!exported.has(name)) {
            missing.push(
              `${relative(SRC_DIR, file)} imports "${name}", which copy.ts does not export`,
            );
          }
        }
      }
    }

    expect(missing).toEqual([]);
  });

  it('finds at least one consumer, so the check is not vacuously green', () => {
    const files = walkFiles(SRC_DIR, ['.astro']);
    const consumers = files.filter((file) =>
      /from\s*['"][^'"]*content\/copy['"]/.test(readFileSync(file, 'utf8')),
    );

    expect(consumers.length).toBeGreaterThan(0);
  });
});

/* -------------------------------------------------------------------------- */
/* Scope guards — AWHQ-AUT-P1F §8                                             */
/* -------------------------------------------------------------------------- */

describe('scope.prohibitions', () => {
  it('never names an excluded programme or the operating entity anywhere in src/', () => {
    // P-16 and P1-A §10.2(9). Applies to source, comments, and metadata — not
    // only to rendered copy.
    const forbidden = ['ProjectOS', 'TradeOS', 'EduOS', 'UrjaOps', 'Legal Engineering', 'Urjadata'];

    const violations = walkFiles(SRC_DIR, ['.astro', '.ts', '.css']).flatMap((file) => {
      const source = readFileSync(file, 'utf8');
      return forbidden
        .filter((term) => containsTerm(source, term))
        .map((term) => `${relative(SRC_DIR, file)} mentions "${term}"`);
    });

    expect(violations).toEqual([]);
  });

  it('reads no environment variable anywhere in src/ or in the build config', () => {
    // P1-H: "No environment variables." The canonical origin is a literal from
    // `04` §1 (see src/lib/site.ts), not configuration — reading it from the
    // environment would let an unapproved origin reach the page.
    //
    // `.env.example` stays committed as documentation of a future need
    // (`08` §10, P1-F S-2). Nothing reads it, which is what this asserts.
    const files = [
      ...walkFiles(SRC_DIR, ['.astro', '.ts']),
      resolve(process.cwd(), 'astro.config.ts'),
    ];

    const violations = files.flatMap((file) => {
      const source = readFileSync(file, 'utf8');
      const hits: string[] = [];
      if (/process\.env/.test(source)) hits.push('process.env');
      if (/import\.meta\.env/.test(source)) hits.push('import.meta.env');
      return hits.map((hit) => `${relative(process.cwd(), file)} reads ${hit}`);
    });

    expect(violations).toEqual([]);
  });

  it('contains no submission endpoint, storage call, or third-party origin in src/', () => {
    /**
     * P-02, P-04, P-06, P-07, P-08 and MF-1/MF-2. Blunt on purpose.
     *
     * ─── Two URIs are allowed, because they are not origins ─────────────────
     *
     * A URI in source is only a third-party origin if something FETCHES it.
     * These two are identifiers that no browser ever requests:
     *
     *   https://schema.org                     JSON-LD `@context`. A vocabulary
     *                                          identifier. Required by the
     *                                          format; `08` SEO-07 mandates the
     *                                          Organization block that uses it.
     *   http://www.sitemaps.org/schemas/...    XML namespace on `<urlset>`.
     *                                          Required by the sitemap format;
     *                                          `08` SEO-05 mandates the sitemap.
     *
     * Neither is dereferenced, and neither appears on a rendered page — the
     * sitemap is a separate document. The claim that actually matters is
     * behavioural, and it is asserted on the wire rather than in source:
     * `tests/e2e/metadata-and-boundary.spec.ts` fails if first render makes any
     * third-party request at all.
     *
     * Anything else still fails here.
     */
    const ALLOWED_NON_FETCHED_URIS = [
      'https://schema.org',
      'http://www.sitemaps.org/schemas/sitemap/0.9',
      // Atom namespace on <feed>. Required by the format, never dereferenced —
      // and the feed is not even emitted (src/lib/deferred-static.ts).
      'http://www.w3.org/2005/Atom',
      // AIWHQ-CODEX-BTFDR-005: plain anchors to the two canonical public
      // repositories and their evidence paths. They are navigations initiated
      // by a person, never first-render requests. E2E still asserts zero
      // third-party traffic before interaction.
      'https://github.com/rmanish2000-del/warrant',
      'https://github.com/rmanish2000-del/warrant-mcp',
    ];

    const forbiddenPatterns: Array<[RegExp, string]> = [
      [/\/api\/interest/, 'P-04 — no submission endpoint in this scope'],
      [/\/api\/form-token/, 'MF-1 — no form token endpoint in this scope'],
      [/localStorage|sessionStorage|document\.cookie/, 'P-07 / C-13 — no client storage or cookie'],
      [/challenges\.cloudflare\.com/, 'P-08 — no bot-mitigation origin'],
      [/https?:\/\/(?!aiworkspacehq\.com)[a-z0-9.-]+\.[a-z]{2,}/i, 'zero third-party origins'],
    ];

    /**
     * CC-005 DS-D1 (founder decision of record, 2026-08-03) amended the
     * storage line: "zero cookies; no client storage except a single
     * first-party `theme` preference key, readable by no one but the
     * browser." C-13 is unaffected — the key is neither a cookie nor
     * tracking.
     *
     * The allowance is exactly as narrow as the amendment: only inside
     * src/design-system/, and only the literal `theme`-key get/set calls.
     * Any other key, any dynamic key expression, sessionStorage, or a cookie
     * still fails — everywhere, including the design system.
     */
    const DS_DIR = join(SRC_DIR, 'design-system');
    const DS_THEME_KEY_CALLS =
      /localStorage\.(?:getItem\(\s*'theme'\s*\)|setItem\(\s*'theme'\s*,)/g;

    // Comments are stripped: this guard looks for the construct, not for prose
    // explaining its absence. The programme-name guard above deliberately does
    // NOT strip them — P-16 covers comments and metadata too.
    const violations = walkFiles(SRC_DIR, ['.astro', '.ts', '.css']).flatMap((file) => {
      let source = stripComments(readFileSync(file, 'utf8'));
      for (const uri of ALLOWED_NON_FETCHED_URIS) source = source.split(uri).join('');
      if (file.startsWith(DS_DIR)) source = source.replace(DS_THEME_KEY_CALLS, '');

      return forbiddenPatterns
        .filter(([pattern]) => pattern.test(source))
        .map(([, reason]) => `${relative(SRC_DIR, file)}: ${reason}`);
    });

    expect(violations).toEqual([]);
  });

  it('still rejects any storage use beyond the DS-D1 theme key', () => {
    // Guards the allowance: the stripper must remove ONLY the approved calls.
    const strip = (code: string): string =>
      code.replace(/localStorage\.(?:getItem\(\s*'theme'\s*\)|setItem\(\s*'theme'\s*,)/g, '');

    expect(strip("localStorage.getItem('theme')")).not.toMatch(/localStorage/);
    expect(strip("localStorage.setItem('theme', next)")).not.toMatch(/localStorage/);
    expect(strip("localStorage.setItem('visitor-id', id)")).toMatch(/localStorage/);
    expect(strip('localStorage.getItem(key)')).toMatch(/localStorage/);
    expect(strip("localStorage.removeItem('theme')")).toMatch(/localStorage/);
  });

  it('still rejects a genuine third-party origin', () => {
    // Guards the allowance above: removing one identifier must not open the
    // door to a real one.
    const pattern = /https?:\/\/(?!aiworkspacehq\.com)[a-z0-9.-]+\.[a-z]{2,}/i;

    expect(pattern.test("const a = 'https://cdn.example.com/script.js';")).toBe(true);
    expect(pattern.test("const a = 'https://fonts.googleapis.com/css';")).toBe(true);
    expect(pattern.test("const a = 'https://aiworkspacehq.com/platform';")).toBe(false);
  });

  it('has a scope guard that still fires on real code', () => {
    // Guards the guard: stripping comments must not have neutered it.
    expect(stripComments('window.localStorage.setItem("a", "b");')).toMatch(/localStorage/);
    expect(stripComments("const u = 'https://evil.example';")).toMatch(/https:\/\//);

    // Stripped: block comments, JSDoc, HTML comments, whole-line comments.
    expect(stripComments('/* localStorage is not used */')).not.toMatch(/localStorage/);
    expect(stripComments('<!-- document.cookie is never set -->')).not.toMatch(/document\.cookie/);
    expect(stripComments('  // no sessionStorage here')).not.toMatch(/sessionStorage/);

    // NOT stripped, on purpose: a trailing `//` comment. Stripping those would
    // also truncate `https://…` in a string literal, and the third-party-origin
    // guard depends on seeing that. A trailing comment naming a forbidden
    // construct will therefore fail the guard — write it above the line instead.
    expect(stripComments('const a = 1; // localStorage')).toMatch(/localStorage/);
  });
});
