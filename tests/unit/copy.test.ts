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

  it('contains no submission endpoint, storage call, or third-party origin in src/', () => {
    // P-02, P-04, P-06, P-07, P-08 and MF-1/MF-2. Blunt on purpose.
    const forbiddenPatterns: Array<[RegExp, string]> = [
      [/\/api\/interest/, 'P-04 — no submission endpoint in this scope'],
      [/\/api\/form-token/, 'MF-1 — no form token endpoint in this scope'],
      [/localStorage|sessionStorage|document\.cookie/, 'P-07 / C-13 — no client storage or cookie'],
      [/challenges\.cloudflare\.com/, 'P-08 — no bot-mitigation origin'],
      [/https?:\/\/(?!aiworkspacehq\.com)[a-z0-9.-]+\.[a-z]{2,}/i, 'zero third-party origins'],
    ];

    const violations = walkFiles(SRC_DIR, ['.astro', '.ts', '.css']).flatMap((file) => {
      const source = readFileSync(file, 'utf8');
      return forbiddenPatterns
        .filter(([pattern]) => pattern.test(source))
        .map(([, reason]) => `${relative(SRC_DIR, file)}: ${reason}`);
    });

    expect(violations).toEqual([]);
  });
});
