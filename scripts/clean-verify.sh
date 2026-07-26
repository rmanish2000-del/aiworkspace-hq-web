#!/usr/bin/env bash
#
# Clean-environment reproducibility run — P1-M §5.
#
# Deletes every build artefact and every installed dependency, reinstalls from
# the committed lockfile alone, and runs the full release verification. The
# point is to prove the repository builds and verifies from nothing but what is
# committed — no local state, no leftover dist/, no hand-installed package.
#
# Deliberately NOT deleted: the Playwright browser cache in
# ~/AppData/Local/ms-playwright. It is machine state, not repository state, and
# `npx playwright install` is a documented setup step rather than part of the
# build.
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1

echo "=== 0. Starting state ==="
node --version
npm --version
git rev-parse --abbrev-ref HEAD
git rev-parse --short HEAD

echo
echo "=== 1. Removing node_modules, dist, .astro, test-results ==="
rm -rf node_modules dist .astro test-results playwright-report .lighthouseci
echo "removed. node_modules present: $([ -d node_modules ] && echo yes || echo no)"

echo
echo "=== 2. npm ci — from the committed lockfile only ==="
CI_START=$(date +%s)
npm ci 2>&1 | tail -5
CI_STATUS=${PIPESTATUS[0]}
echo "npm ci exit: $CI_STATUS, $(($(date +%s) - CI_START))s"
[ "$CI_STATUS" -ne 0 ] && exit 1

echo
echo "=== 3. Regenerating public assets from source ==="
npm run assets 2>&1 | tail -3

echo
echo "=== 4. Full release verification ==="
npm run verify:release
VERIFY_STATUS=$?

echo
echo "=== 5. Working tree after the run ==="
git status --porcelain

echo
echo "=== 6. Result ==="
echo "verify:release exit: $VERIFY_STATUS"
exit $VERIFY_STATUS
