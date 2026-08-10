/**
 * record-baseline.mjs — re-records the DS-D2 route-document baseline from the
 * current dist/. Run ONLY after a deliberate, authorized change to rendered
 * output, then commit the result with the change that caused it.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

const files = walk('dist')
  .filter((file) => file.endsWith('.html'))
  .sort();
const baseline = JSON.parse(readFileSync('scripts/ds-baseline/holding-page.json', 'utf8'));
baseline.hashes = {};
for (const file of files) {
  const key = file.replace(/^dist[\\/]/, '').replace(/\\/g, '/');
  baseline.hashes[key] = createHash('sha256').update(readFileSync(file)).digest('hex');
}
writeFileSync('scripts/ds-baseline/holding-page.json', `${JSON.stringify(baseline, null, 2)}\n`);
console.log(`recorded ${files.length} documents`);
console.log('trust.html =', baseline.hashes['trust.html'].slice(0, 10));
