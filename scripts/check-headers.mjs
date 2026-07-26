/**
 * check-headers.mjs — asserts a deployment's response headers against
 * P0 `08` §9.2.
 *
 *   node scripts/check-headers.mjs https://example-preview-url
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ THIS HAS NEVER BEEN RUN AGAINST A REAL DEPLOYMENT, BECAUSE THERE IS NONE. │
 * │                                                                           │
 * │ `08` §14 lists a post-deploy header check as a merge gate. It cannot run  │
 * │ in CI: no host exists (TDR-03 unsigned, P-02), and nothing is deployed    │
 * │ (P-01). The script exists so that the check is ready the moment AG-3 is   │
 * │ granted, rather than being written under deployment-day pressure.         │
 * │                                                                           │
 * │ The expectations come from `src/lib/production.ts`, which is the single   │
 * │ machine-readable statement of `08` §9.2 — so this script and the CSP hash │
 * │ used by the page cannot drift apart.                                      │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Exit code 0 = every required header present with the expected value.
 */
import { securityHeaders } from '../src/lib/production.ts';

const target = process.argv[2];

if (!target) {
  console.error('Usage: node scripts/check-headers.mjs <url>');
  console.error('\nNo deployment exists yet. This script is staged for AG-3.');
  process.exit(2);
}

/**
 * CSP is compared by directive rather than by string equality: a host may
 * reorder directives or add a report-uri without that being a failure, but a
 * missing or weakened directive is.
 */
function parseCsp(value) {
  return new Map(
    value
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [name, ...rest] = part.split(/\s+/);
        return [name, rest.join(' ')];
      }),
  );
}

async function main() {
  const response = await fetch(target, { redirect: 'manual' });
  const failures = [];

  // The page's own hash is not known here; accept any script-src that is at
  // least as strict as 'self' plus hashes.
  for (const { name, value, source } of securityHeaders()) {
    const actual = response.headers.get(name);

    if (actual === null) {
      failures.push(`MISSING  ${name}  (${source})`);
      continue;
    }

    if (name === 'Content-Security-Policy') {
      const expected = parseCsp(value);
      const got = parseCsp(actual);

      for (const [directive, expectedValue] of expected) {
        const gotValue = got.get(directive);
        if (gotValue === undefined) {
          failures.push(`MISSING  CSP directive ${directive}`);
        } else if (directive === 'script-src') {
          if (!gotValue.includes("'self'")) {
            failures.push(`WEAK     CSP script-src lacks 'self': ${gotValue}`);
          }
          if (gotValue.includes("'unsafe-eval'")) {
            failures.push("FORBIDDEN CSP script-src contains 'unsafe-eval' (`08` §9.2)");
          }
          if (gotValue.includes("'unsafe-inline'")) {
            failures.push(
              "FORBIDDEN CSP script-src contains 'unsafe-inline' — use a hash (`08` §9.2)",
            );
          }
        } else if (gotValue !== expectedValue) {
          failures.push(
            `DIFFERS  CSP ${directive}\n           expected: ${expectedValue}\n           actual:   ${gotValue}`,
          );
        }
      }
      continue;
    }

    if (actual !== value) {
      failures.push(
        `DIFFERS  ${name}\n           expected: ${value}\n           actual:   ${actual}`,
      );
    }
  }

  // `08` SEC-04 — `preload` must not appear until 30 days of stable operation.
  const hsts = response.headers.get('Strict-Transport-Security') ?? '';
  if (hsts.includes('preload')) {
    failures.push(
      'FORBIDDEN Strict-Transport-Security contains `preload`. `08` SEC-04: added only after 30 days of stable operation, and effectively irreversible (DEC-024).',
    );
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} header problem(s) at ${target}:\n`);
    for (const failure of failures) console.error(`  ${failure}`);
    process.exit(1);
  }

  console.log(`All ${securityHeaders().length} required headers present and correct at ${target}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
