/**
 * audit-gate.mjs — the dependency-audit gate with DATED, SCOPED exceptions
 * (AUDIT-EXCEPTION-AND-PR, founder ruling 2026-08-13).
 *
 * Behaviour:
 *   - `npm audit` findings at high/critical fail the gate, exactly as the
 *     plain `npm audit --audit-level=high` did — UNLESS the finding's root
 *     advisory is listed in docs/governance/AUDIT-EXCEPTIONS.json.
 *   - An exception is not policy; it EXPIRES on its revisit trigger: before
 *     honouring one, the gate asks the registry for the excepted package's
 *     published versions. If any version outside the advisory's vulnerable
 *     range exists, the exception is EXPIRED and the gate goes red until the
 *     dependency tree is updated and the entry removed.
 *   - A NEW advisory — any root GHSA not in the file — turns the gate red.
 *   - If the registry cannot be reached, the exception is still honoured for
 *     the recorded advisory (offline runs must not invent new failures), but
 *     the gate says so out loud.
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const EXCEPTIONS = JSON.parse(
  readFileSync('docs/governance/AUDIT-EXCEPTIONS.json', 'utf8'),
).exceptions;

let audit;
try {
  audit = JSON.parse(execSync('npm audit --json', { stdio: 'pipe' }).toString());
} catch (error) {
  // npm audit exits non-zero when vulnerabilities exist; the JSON is on stdout.
  const out = error.stdout?.toString() ?? '';
  try {
    audit = JSON.parse(out);
  } catch (parseError) {
    console.error('npm audit produced no parseable JSON');
    console.error(out.slice(0, 2000));
    throw parseError;
  }
}

const vulnerabilities = Object.values(audit.vulnerabilities ?? {});
const failing = vulnerabilities.filter((v) => v.severity === 'high' || v.severity === 'critical');

/** Root advisories (objects in `via`) reached from a failing package. */
function rootAdvisories(pkg, seen = new Set()) {
  if (seen.has(pkg)) return [];
  seen.add(pkg);
  const entry = audit.vulnerabilities[pkg];
  if (!entry) return [];
  const roots = [];
  for (const via of entry.via) {
    if (typeof via === 'string') roots.push(...rootAdvisories(via, seen));
    else roots.push(via);
  }
  return roots;
}

const unexcepted = [];
const excepted = new Map();

for (const v of failing) {
  for (const advisory of rootAdvisories(v.name)) {
    // Mirror `npm audit --audit-level=high`: only high/critical ROOT
    // advisories fail; a moderate root reached through a high chain does not.
    if (advisory.severity !== 'high' && advisory.severity !== 'critical') continue;
    const ghsa = (advisory.url ?? '').split('/').pop();
    const match = EXCEPTIONS.find((e) => e.ghsa === ghsa);
    if (match) excepted.set(ghsa, match);
    else unexcepted.push(`${v.name}: ${advisory.title ?? '(untitled)'} ${advisory.url ?? ''}`);
  }
}

if (unexcepted.length) {
  console.error('DEPENDENCY AUDIT FAILED — advisories with NO recorded exception:');
  for (const line of [...new Set(unexcepted)]) console.error(`  ${line}`);
  process.exit(1);
}

// Every failing finding is covered by an exception. Check each for EXPIRY:
// a published version outside the vulnerable range means upstream shipped.
for (const exception of excepted.values()) {
  let versions;
  try {
    versions = JSON.parse(
      execSync(`npm view ${exception.package} versions --json`, { stdio: 'pipe' }).toString(),
    );
  } catch {
    console.warn(
      `  ⚠ registry unreachable — honouring the recorded exception for ` +
        `${exception.ghsa} without the expiry check this run`,
    );
    continue;
  }
  const ceiling = exception.vulnerable_range.match(/<=\s*([\d.]+)/)?.[1];
  const patched = ceiling
    ? versions.filter((ver) => /^\d+\.\d+\.\d+$/.test(ver) && compare(ver, ceiling) > 0)
    : [];
  if (patched.length) {
    console.error(
      `EXCEPTION EXPIRED — ${exception.package} ${patched.at(-1)} is published, outside the ` +
        `vulnerable range ${exception.vulnerable_range} (${exception.ghsa}). The revisit ` +
        `trigger has fired: update the dependency tree and REMOVE the exception entry.`,
    );
    process.exit(1);
  }
  console.log(
    `  exception honoured: ${exception.ghsa} (${exception.package} ${exception.vulnerable_range}, ` +
      `granted ${exception.granted}, dev-only — no patched version published yet)`,
  );
}

function compare(a, b) {
  const [a1 = 0, a2 = 0, a3 = 0] = a.split('.').map(Number);
  const [b1 = 0, b2 = 0, b3 = 0] = b.split('.').map(Number);
  return a1 - b1 || a2 - b2 || a3 - b3;
}

console.log(
  `dependency audit: ${failing.length ? `${excepted.size} excepted advisory chain(s), ` : ''}` +
    `no unexcepted high/critical findings`,
);
