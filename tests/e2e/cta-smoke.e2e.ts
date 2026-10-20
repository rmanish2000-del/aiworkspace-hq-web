import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/about",
  "/building",
  "/checkout",
  "/contact",
  "/delivery",
  "/enterprise",
  "/platform",
  "/pricing",
  "/principles",
  "/privacy",
  "/process",
  "/products",
  "/products/warrant",
  "/products/warrant-mcp",
  "/refunds",
  "/resources",
  "/security",
  "/services",
  "/technology",
  "/terms",
  "/trust",
  "/what-we-havent-built",
];

const PLAN_LABELS = new Set(["Ask for a plan", "Ask for a scoped plan"]);

test("header, hero and footer CTAs do not 404", async ({ page }) => {
  test.setTimeout(600_000);
  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "Page not found" }), route).toHaveCount(0);

    for (const slot of ["header", "hero", "footer"] as const) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: "Page not found" }), route).toHaveCount(0);
      const count = await page.locator(`a[data-cta="${slot}"]`).count();
      for (let i = 0; i < count; i += 1) {
        await page.goto(route);
        const link = page.locator(`a[data-cta="${slot}"]`).nth(i);
        await expect(link, `${route} ${slot}[${i}]`).toBeVisible();
        const href = await link.getAttribute("href");
        expect(href, `${route} ${slot}[${i}]`).toBeTruthy();
        const label = (await link.innerText()).replace(/→/g, "").replace(/\s+/g, " ").trim();
        const target = new URL(href!, page.url());
        const here = new URL(page.url());

        if (target.origin !== here.origin) {
          const response = await page.request.get(target.toString());
          expect(response.status(), `${label} ${target.toString()}`).not.toBe(404);
          continue;
        }

        await link.click();
        await page.waitForLoadState("domcontentloaded");
        await expect(
          page.getByRole("heading", { name: "Page not found" }),
          `${route} -> ${href}`,
        ).toHaveCount(0);

        if (PLAN_LABELS.has(label)) {
          await expect(page, `${route} ${label}`).toHaveURL(/\/contact#plan$/);
          await expect(page.locator("#plan")).toBeVisible();
        }
      }
    }
  }
});

test("mobile header plan CTA opens the form", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  const plan = page.getByRole("link", { name: "Ask for a plan" });
  // The menu button does nothing until React hydrates. Retry the click.
  await expect(async () => {
    if (!(await plan.isVisible())) await menu.click();
    await expect(plan).toBeVisible();
  }).toPass();
  await plan.click();
  await expect(page).toHaveURL(/\/contact#plan$/);
  await expect(page.locator("#plan form")).toBeVisible();
});

test("plan form shows an error with the founder address, then submits", async ({ page }) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/contact#plan");

  await page.locator("#plan-name").fill("A");
  await page.getByRole("button", { name: "Send the request" }).click();
  await expect(page.getByRole("alert")).toContainText("founder@aiworkspacehq.com");

  await page.route("**/api/plan-request", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "unavailable" }),
    });
  });
  await page.locator("#plan-name").fill("Asha Patel");
  await page.locator("#plan-email").fill("asha@example.com");
  await page.locator("#plan-organisation").fill("Example CSC");
  await page.locator("#plan-weeklyWork").fill("Status follow-ups");
  await page.locator("#plan-whoDoesIt").fill("The centre operator");
  await page.locator("#plan-better").fill("A written receipt each day");
  await page.getByRole("button", { name: "Send the request" }).click();
  await expect(page.getByRole("alert")).toContainText("founder@aiworkspacehq.com");
  await page.unroute("**/api/plan-request");

  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/plan-request") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Send the request" }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ ok: true });
  await expect(page.getByRole("status")).toContainText("asha@example.com");

  await page.locator("#plan").getByRole("button", { name: "Copy email address" }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe("founder@aiworkspacehq.com");
});

test("plain email links keep a mailto target and a copy button", async ({ page }) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  for (const route of ["/contact", "/pricing"]) {
    await page.goto(route);
    const mailto = page.locator('a[href="mailto:founder@aiworkspacehq.com"]');
    expect(await mailto.count(), route).toBeGreaterThan(0);
    await page.getByRole("button", { name: "Copy email address" }).first().click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe("founder@aiworkspacehq.com");
  }
});
