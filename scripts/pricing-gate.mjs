/**
 * pricing-gate.mjs — no invented number can ever ship (PRICING-SCAFFOLD,
 * 2026-08-18). Runs AFTER the build, against dist/ — the artifact, not the
 * sources (the DC-1 lesson under the old freeze).
 *
 * Rules enforced:
 *   ABSENT  (config null): dist/ must contain NO /pricing document and NO
 *           INR-looking figure on any non-frozen route.
 *   PRESENT (config set): a matching founder seal must exist (the import of
 *           the config module itself throws otherwise — the same check the
 *           page runs), /pricing must exist, and the ONLY INR figures on
 *           non-frozen routes must equal the sealed amount.
 *
 * The seven content-frozen routes are exempt from the figure scan: their text
 * — including the landing's "intended" tier copy — is governed by its own
 * seal, docs/governance/CONTENT-FREEZE.json, and cannot change without a
 * founder authorisation entry there.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/** Compiled from src/config/pricing.ts on the fly via the TS-stripping import. */
import { execSync } from 'node:child_process';

const FROZEN = [
  join('dist', 'terms.html'),
  join('dist', 'privacy.html'),
  join('dist', 'refunds.html'),
  join('dist', 'delivery.html'),
  join('dist', 'contact.html'),
  join('dist', 'about.html'),
  join('dist', 'warrant-guardian', 'index.html'),
];

// BOTH currencies police the leak (founder ruling 2026-08-18: INR primary,
// USD secondary — an invented number in either currency must not ship).
const PRICE_FIGURE = /(₹|\bRs\.?\s?|\bINR\s?|\$|\bUSD\s?)[0-9][0-9,]*/g;

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(path));
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
}

// Read the config through Node's own TypeScript stripping so this gate and the
// page cannot disagree about what the config says.
const config = execSync(
  'node --experimental-strip-types --no-warnings -e "import(\'./src/config/pricing.ts\').then(m => { const p = m.sealedPrice(); console.log(JSON.stringify(p)); })"',
  { stdio: 'pipe' },
)
  .toString()
  .trim();
const price = JSON.parse(config.split('\n').pop());

const pricingDoc = join('dist', 'pricing.html');
const pricingDir = join('dist', 'pricing');
const failures = [];

if (!price.publish) {
  if (existsSync(pricingDoc) || existsSync(pricingDir)) {
    failures.push('the price is ABSENT but a /pricing document was built');
  }
  for (const file of htmlFiles('dist')) {
    if (FROZEN.includes(file)) continue;
    const hits = readFileSync(file, 'utf8').match(PRICE_FIGURE);
    if (hits)
      failures.push(
        `${file}: price figure(s) ${[...new Set(hits)].join(', ')} with no sealed price`,
      );
  }
} else {
  if (!existsSync(pricingDoc) && !existsSync(pricingDir)) {
    failures.push('a sealed price exists but no /pricing document was built');
  }
  const allowed = new Set([
    price.inr.toLocaleString('en-IN'),
    String(price.inr),
    price.usd.toLocaleString('en-US'),
    String(price.usd),
  ]);
  for (const file of htmlFiles('dist')) {
    if (FROZEN.includes(file)) continue;
    for (const hit of readFileSync(file, 'utf8').match(PRICE_FIGURE) ?? []) {
      const digits = hit.replace(/[^0-9,]/g, '');
      if (!allowed.has(digits)) {
        failures.push(
          `${file}: figure "${hit}" equals neither the sealed ₹${price.inr} nor $${price.usd}`,
        );
      }
    }
  }
}

if (failures.length) {
  console.error('PRICING GATE FAILED — an invented number must not ship:');
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(
  price.publish
    ? `sealed price ₹${price.inr.toLocaleString('en-IN')} / $${price.usd.toLocaleString('en-US')} — /pricing built, no stray figures`
    : 'price ABSENT — no /pricing route, no INR or USD figure on any non-frozen route',
);
