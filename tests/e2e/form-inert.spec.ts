import { expect, test } from '@playwright/test';

/**
 * The form is visual only. These tests are the proof, not the promise.
 *
 * AWHQ-AUT-P1F MF-1…MF-6 and the P1-H assignment: no submit, no API, no
 * storage, no fetch, no cookie, no localStorage, no sessionStorage.
 *
 * Everything below drives the form the way a person would and then asserts that
 * nothing left the page.
 */

const FILL = {
  email: 'someone@example.com', // RFC 2606 reserved domain — MF-4
  name: 'Test Person',
  organization: 'Example Organization',
  role: 'Example Role',
  context: 'A sentence about an example problem.',
};

test('the form exposes an accessible name and has no action', async ({ page }) => {
  await page.goto('/');

  const form = page.locator('form');
  await expect(form).toHaveCount(1);
  await expect(form).toHaveAttribute('aria-label', 'Register interest in AI Workspace');

  // No endpoint exists, so there must be no attribute pointing at one.
  expect(await form.getAttribute('action')).toBeNull();

  // method="dialog" outside a <dialog> makes the submission algorithm a no-op.
  await expect(form).toHaveAttribute('method', 'dialog');
});

test('the form has a real submit button, which submits nowhere', async ({ page }) => {
  // WCAG H32 / html-validate wcag/h32: a form must have a submit button, or it
  // is not operable the way a screen-reader user expects. Inertness comes from
  // method="dialog", not from crippling the control — the two tests below prove
  // that clicking and Enter both do nothing.
  await page.goto('/');

  const button = page.locator('form button');
  await expect(button).toHaveCount(1);
  await expect(button).toHaveAttribute('type', 'submit');
  await expect(button).toHaveText('Register interest');
});

test('pressing Enter in a text field does not navigate or issue a request', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));

  await page.goto('/');
  const urlBefore = page.url();
  requests.length = 0;

  await page.locator('#work-email').fill(FILL.email);
  await page.locator('#work-email').press('Enter');
  await page.waitForTimeout(400);

  expect(page.url()).toBe(urlBefore);
  expect(requests).toEqual([]);

  // The value is still in the field: nothing consumed or cleared it.
  await expect(page.locator('#work-email')).toHaveValue(FILL.email);
});

test('clicking the submit control does not navigate or issue a request', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));

  await page.goto('/');
  const urlBefore = page.url();

  await page.locator('#work-email').fill(FILL.email);
  await page.locator('#full-name').fill(FILL.name);
  await page.locator('#organization').fill(FILL.organization);
  await page.locator('#role').fill(FILL.role);
  await page.locator('#context').fill(FILL.context);
  await page.locator('#consent').check();

  requests.length = 0;
  await page.locator('form button').click();
  await page.waitForTimeout(400);

  expect(page.url()).toBe(urlBefore);
  expect(requests).toEqual([]);
});

test('completing the whole form leaves no trace anywhere', async ({ page, context }) => {
  await page.goto('/');

  await page.locator('#work-email').fill(FILL.email);
  await page.locator('#context').fill(FILL.context);
  await page.locator('#consent').check();
  await page.locator('form button').click();
  await page.waitForTimeout(300);

  // MF-2 — no persistence of any kind.
  expect(await context.cookies()).toEqual([]);
  const storage = await page.evaluate(() => ({
    local: window.localStorage.length,
    session: window.sessionStorage.length,
  }));
  expect(storage).toEqual({ local: 0, session: 0 });

  // MF-3 — values are discarded. A reload must not restore them.
  await page.reload();
  await expect(page.locator('#work-email')).toHaveValue('');
  await expect(page.locator('#context')).toHaveValue('');
  await expect(page.locator('#consent')).not.toBeChecked();
});

test('no success or error state is rendered', async ({ page }) => {
  // Each needs a submission that cannot happen, and the success body carries a
  // build-time placeholder blocked on Open Item C.
  await page.goto('/');

  const body = (await page.textContent('body')) ?? '';
  expect(body).not.toContain('Thank you');
  expect(body).not.toContain('There is a problem with this form');
  expect(body).not.toMatch(/\{\{[^}]+\}\}/);

  // The live region exists from first render (`07` §7) and is empty.
  const status = page.locator('[role="status"]');
  await expect(status).toHaveCount(1);
  await expect(status).toBeEmpty();
});

test('every field has a visible, programmatically associated label and hint', async ({ page }) => {
  // `08` HTML-06 / A11Y-07. No placeholder is used as a label substitute.
  await page.goto('/');

  const fields = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('.field__input, .consent__box')].map((el) => {
      const id = el.id;
      const label = document.querySelector(`label[for="${id}"]`);
      const describedBy = el.getAttribute('aria-describedby');
      return {
        id,
        hasLabel: Boolean(label),
        labelText: label?.textContent?.trim() ?? '',
        hintResolves: describedBy ? Boolean(document.getElementById(describedBy)) : true,
        hasPlaceholder: el.hasAttribute('placeholder'),
      };
    }),
  );

  expect(fields.length).toBe(6);
  for (const field of fields) {
    expect(field.hasLabel, `${field.id} has no <label for>`).toBe(true);
    expect(field.labelText.length, `${field.id} label is empty`).toBeGreaterThan(0);
    expect(field.hintResolves, `${field.id} aria-describedby dangles`).toBe(true);
    expect(field.hasPlaceholder, `${field.id} uses a placeholder`).toBe(false);
  }
});

test('the consent checkbox is a native checkbox, unchecked by default', async ({ page }) => {
  // `04` §5.2 — not pre-checked, not implied by submission, not bundled.
  // `07` §6.7 — never styled into a toggle switch.
  await page.goto('/');

  const consent = page.locator('#consent');
  await expect(consent).toHaveAttribute('type', 'checkbox');
  await expect(consent).not.toBeChecked();
  await expect(consent).not.toHaveAttribute('role', 'switch');
});

test('the hero CTA reaches the form section', async ({ page }) => {
  await page.goto('/');

  const cta = page.locator('.hero__cta');
  await expect(cta).toHaveText('Register interest');
  await expect(cta).toHaveAttribute('href', '#interest');
  await expect(cta).toHaveAttribute('aria-label', 'Register interest in AI Workspace early access');

  await cta.click();
  await expect(page.locator('#interest')).toBeInViewport();
});

test('tab order follows DOM order through the form', async ({ page }) => {
  /**
   * `07` §7 specifies:
   *   Skip link -> Wordmark (not focusable) -> Hero CTA -> Work email ->
   *   Full name -> Organization -> Role -> Context -> Consent -> Submit ->
   *   Privacy link -> Footer privacy link -> Footer email link
   *
   * P1-J §4.4 extends it: skip link -> wordmark -> nav items -> main content
   * -> footer.
   *
   * The micro-notice's "Read the privacy notice" is still rendered as text
   * rather than a link (ADR-0003 R-1), so it is not a tab stop. The footer
   * links follow the submit button and are asserted separately.
   */
  await page.goto('/');

  const order: string[] = [];
  for (let i = 0; i < 13; i += 1) {
    await page.keyboard.press('Tab');
    order.push(
      await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return 'none';
        // Prefer id; then the BEM element class, which is the stable one;
        // then the whole class attribute.
        return (
          el.id ||
          [...el.classList].find((name) => name.includes('__')) ||
          el.className ||
          el.tagName.toLowerCase()
        );
      }),
    );
  }

  expect(order).toEqual([
    'skip-link',
    // P1-J §4.4: skip link -> wordmark -> nav items -> main content -> footer.
    // The wordmark is a <p> on `/` and is correctly not focusable (`03` §3
    // Block 1) — there is nowhere for it to go from the home route.
    'site-nav__link',
    'site-nav__link',
    'site-nav__link',
    'site-nav__cta',
    'hero__cta',
    'work-email',
    'full-name',
    'organization',
    'role',
    'context',
    'consent',
    'button', // the form's submit control
  ]);
});
