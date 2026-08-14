import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  MIN_AMOUNT_PAISE,
  expectedSignature,
  idempotencyKey,
  validateOrderRequest,
  verifyPaymentSignature,
} from '../../src/lib/razorpay';
import * as runtime from '../../api/_lib/razorpay.mjs';

/**
 * RAZORPAY-INTEGRATION (2026-08-14). Two constraints from the assignment are
 * enforced here as tests rather than promised in prose:
 *
 *   B. TEST KEYS ONLY — a string matching `rzp_live_` anywhere in the tree
 *      FAILS the build.
 *   1. The KEY_SECRET's variable name must never reach a built artefact.
 *
 * Both are absent protections until a test holds them (DC-6), so they are held
 * here.
 */

const SECRET = 'rzp_test_secret_for_unit_tests_only';

/* -------------------------------------------------------------------------- */
/* Amount validation — the browser is not trusted with the amount             */
/* -------------------------------------------------------------------------- */

describe('validateOrderRequest', () => {
  const valid = { amount: 50000, currency: 'INR', receipt: 'rcpt_001' };

  it('accepts a well-formed order', () => {
    expect(validateOrderRequest(valid)).toEqual({ ok: true, value: valid });
  });

  it.each([
    ['below the floor', { ...valid, amount: MIN_AMOUNT_PAISE - 1 }],
    ['a fractional amount', { ...valid, amount: 100.5 }],
    ['an amount as a string', { ...valid, amount: '50000' }],
    ['a bad currency', { ...valid, currency: 'rupees' }],
    ['an empty receipt', { ...valid, receipt: '' }],
    ['a non-object body', 'amount=1'],
  ])('refuses %s', (_label, body) => {
    expect(validateOrderRequest(body).ok).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* Signature verification — the security-critical line                        */
/* -------------------------------------------------------------------------- */

describe('verifyPaymentSignature', () => {
  const orderId = 'order_TEST123';
  const paymentId = 'pay_TEST456';
  const good = expectedSignature(orderId, paymentId, SECRET);

  it('verifies a genuine signature', () => {
    expect(
      verifyPaymentSignature(
        { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: good },
        SECRET,
      ),
    ).toBe(true);
  });

  it('is computed over order_id|payment_id, not the concatenation', () => {
    expect(good).not.toBe(expectedSignature(`${orderId}${paymentId}`, '', SECRET));
  });

  it.each([
    ['a tampered signature', { razorpay_signature: `${good.slice(0, -1)}0` }],
    ['a swapped order id', { razorpay_order_id: 'order_OTHER' }],
    ['a swapped payment id', { razorpay_payment_id: 'pay_OTHER' }],
    ['a truncated signature', { razorpay_signature: good.slice(0, 16) }],
    ['a missing signature', { razorpay_signature: undefined }],
    ['a missing order id', { razorpay_order_id: undefined }],
  ])('refuses %s', (_label, override) => {
    expect(
      verifyPaymentSignature(
        {
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: good,
          ...override,
        },
        SECRET,
      ),
    ).toBe(false);
  });

  it('refuses a signature made with a different secret', () => {
    expect(
      verifyPaymentSignature(
        {
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: expectedSignature(orderId, paymentId, 'another_secret'),
        },
        SECRET,
      ),
    ).toBe(false);
  });

  it('names razorpay_payment_id as the idempotency key', () => {
    expect(idempotencyKey({ razorpay_payment_id: paymentId })).toBe(paymentId);
    expect(idempotencyKey({})).toBeNull();
  });
});

/* -------------------------------------------------------------------------- */
/* The runtime copy must not drift from the typed module                      */
/* -------------------------------------------------------------------------- */

describe('api/_lib/razorpay.mjs agrees with src/lib/razorpay.ts', () => {
  it('produces the same signature', () => {
    expect(runtime.expectedSignature('order_X', 'pay_Y', SECRET)).toBe(
      expectedSignature('order_X', 'pay_Y', SECRET),
    );
  });

  it('reaches the same verdicts', () => {
    const cases = [
      { amount: 50000, currency: 'INR', receipt: 'r' },
      { amount: 1, currency: 'INR', receipt: 'r' },
      { amount: 50000, currency: 'inr', receipt: 'r' },
    ];
    for (const body of cases) {
      expect(runtime.validateOrderRequest(body).ok).toBe(validateOrderRequest(body).ok);
    }
  });
});

/* -------------------------------------------------------------------------- */
/* Constraint B — no live key, anywhere, ever                                 */
/* -------------------------------------------------------------------------- */

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'dist-ds',
  'test-results',
  'playwright-report',
  '.astro',
  '.vercel',
  'artifacts',
  'exports',
]);

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

/** Split so this file's own occurrences do not trip the scan. */
const LIVE_KEY_MARKER = ['rzp', 'live', ''].join('_');

describe('no live Razorpay key exists in the tree', () => {
  it('finds no rzp_live_ string in any tracked file', () => {
    // Tracked files are exactly the scope of "must never enter this
    // repository", and git enumerates them far faster than a tree walk.
    const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
      .split('\0')
      .filter(Boolean);
    const offenders: string[] = [];
    for (const path of tracked) {
      if (path === 'tests/unit/razorpay.test.ts') continue;
      if (/\.(png|jpg|jpeg|webp|avif|ico|woff2?|pdf|zip|xlsx|bundle|docx)$/i.test(path)) continue;
      let text: string;
      try {
        text = readFileSync(path, 'utf8');
      } catch {
        continue;
      }
      if (text.includes(LIVE_KEY_MARKER)) offenders.push(path);
    }
    expect(offenders, 'a LIVE Razorpay key must never enter this repository').toEqual([]);
  });
});

/* -------------------------------------------------------------------------- */
/* The secret must never reach a built artefact                               */
/* -------------------------------------------------------------------------- */

describe('the key secret cannot reach a client bundle', () => {
  it('does not appear in any built document under dist/', () => {
    let files: string[];
    try {
      files = [...walk('dist')];
    } catch {
      // No build present in this run; the same assertion runs in verify:release
      // after `npm run build`.
      return;
    }
    const offenders = files.filter((path) => {
      try {
        return readFileSync(path, 'utf8').includes('RAZORPAY_KEY_SECRET');
      } catch {
        return false;
      }
    });
    expect(offenders, 'the secret variable name reached a build artefact').toEqual([]);
  });

  it('is not imported by any .astro page', () => {
    const pages = [...walk(join('src', 'pages'))].filter((p) => p.endsWith('.astro'));
    const importers = pages.filter((p) => readFileSync(p, 'utf8').includes('lib/razorpay'));
    expect(importers, 'a page importing payment logic would bundle it for the client').toEqual([]);
  });
});
