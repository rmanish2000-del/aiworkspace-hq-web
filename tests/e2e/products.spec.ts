import { expect, test } from '@playwright/test';

test('/products distinguishes the two authorization products', async ({ page }) => {
  await page.goto('/products');

  await expect(page.locator('[data-block="CB-85"]')).toContainText('ALLOW, ESCALATE or DENY');
  await expect(page.locator('[data-block="CB-86"]')).toContainText('PreToolUse hook');
  await expect(page.locator('[data-block="CB-87"]')).toContainText(
    'not a claimed shared runtime platform',
  );
  await expect(page.getByRole('link', { name: 'Explore Warrant', exact: true })).toHaveAttribute(
    'href',
    '/products/warrant',
  );
  await expect(page.getByRole('link', { name: 'Explore Warrant MCP' })).toHaveAttribute(
    'href',
    '/products/warrant-mcp',
  );
});

test('/pricing shows a concrete Guardian refusal before checkout', async ({ page }) => {
  await page.goto('/pricing');

  const example = page.getByRole('region', { name: 'A concrete policy check' });
  await expect(example.getByText('delete .env', { exact: true })).toBeVisible();
  await expect(
    example.getByText('Protected paths cannot be deleted.', { exact: true }),
  ).toBeVisible();
  await expect(
    example.getByText('DENY — the command does not run.', { exact: true }),
  ).toBeVisible();

  const exampleBox = await example.boundingBox();
  const checkoutBox = await page.getByRole('link', { name: '/checkout' }).boundingBox();
  expect(exampleBox).not.toBeNull();
  expect(checkoutBox).not.toBeNull();
  expect(exampleBox!.y + exampleBox!.height).toBeLessThan(checkoutBox!.y);

  await expect(page.locator('main')).toContainText('₹999 per month');
  await expect(page.locator('main')).toContainText('private beta build');
});

test('/products/warrant exposes proof, refusal and sandbox limitations', async ({ page }) => {
  await page.goto('/products/warrant');

  await expect(
    page.getByRole('heading', { name: 'The product moment is a refusal' }),
  ).toBeVisible();
  await expect(page.locator('.decision-strip')).toContainText('ALLOW');
  await expect(page.locator('.decision-strip')).toContainText('ESCALATE');
  await expect(page.locator('.decision-strip')).toContainText('DENY');
  await expect(page.locator('[data-block="CB-88"]')).toContainText('zero outbound provider calls');
  await expect(page.locator('[data-block="CB-89"]')).toContainText('tamper-evident');
  await expect(page.locator('[data-block="CB-90"]')).toContainText('sandbox-only');

  await expect(page.getByRole('link', { name: 'Open the Warrant repository' })).toHaveAttribute(
    'href',
    'https://github.com/rmanish2000-del/warrant',
  );
  await expect(page.getByRole('link', { name: 'Open the sandbox console' })).toHaveAttribute(
    'href',
    '/warrant/console',
  );
});

test('/products/warrant-mcp presents exact quickstart and enforcement boundary', async ({
  page,
}) => {
  await page.goto('/products/warrant-mcp');

  const quickstart = page.locator('pre.quickstart code');
  await expect(quickstart).toContainText('npm install -g warrant-mcp');
  await expect(quickstart).toContainText('warrant-mcp init');
  await expect(quickstart).toContainText('warrant-mcp test "delete .env"');

  await expect(page.locator('[data-block="CB-91"]')).toContainText('76-case');
  await expect(page.locator('[data-block="CB-92"]')).toContainText(
    'limited to its Claude Code hook',
  );
  await expect(page.locator('[data-block="CB-93"]')).toContainText('evidence rather than proof');
  await expect(page.getByRole('link', { name: 'Read the policy specification' })).toHaveAttribute(
    'href',
    'https://github.com/rmanish2000-del/warrant-mcp/blob/main/SPEC.md',
  );
});

test('product copy does not imply unsupported scope', async ({ page }) => {
  for (const route of ['/products', '/products/warrant', '/products/warrant-mcp']) {
    await page.goto(route);
    const body = (await page.locator('main').innerText()).toLowerCase();
    for (const unsupported of [
      'enforces every mcp host',
      'cryptographic audit infrastructure',
      'processes real money',
      'tamper-proof record',
      'shared production core',
    ]) {
      expect(body, `${route} overclaims ${unsupported}`).not.toContain(unsupported);
    }
  }
});
