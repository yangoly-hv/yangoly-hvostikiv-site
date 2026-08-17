import { expect, test } from "@playwright/test";

test("home one-time donation has no monthly tab and no WayForPay checkout", async ({ page }) => {
  await page.goto("/uk");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("button", { name: "Щомісячна допомога" })).toHaveCount(0);
  await expect(page.getByText("Ви можете прямо зараз подарувати врятованим тваринам шанс на нове життя.")).toBeVisible();
  await expect(page.locator("main form").filter({ hasText: "ЗРОБИТИ ДОНАТ" })).toHaveCount(0);
});

test("home one-time donation opens the Mono jar when CMS has a jar URL", async ({ page }) => {
  await page.goto("/uk");
  await page.waitForLoadState("networkidle");
  const heroDonate = page.locator("main a[href*='send.monobank.ua/jar/']").filter({
    hasText: "ЗРОБИТИ ДОНАТ",
  });
  const headerDonate = page.locator("header a[href*='send.monobank.ua/jar/']").filter({
    hasText: "Допомога",
  });

  if ((await heroDonate.count()) === 0) {
    test.info().annotations.push({
      type: "note",
      description: "siteSettings.monobankJarUrl is not set",
    });
    return;
  }

  await expect(heroDonate).toHaveAttribute("href", /https:\/\/send\.monobank\.ua\/jar\//);
  await expect(headerDonate).toHaveAttribute("href", /https:\/\/send\.monobank\.ua\/jar\//);
});

test("tail one-time donation sends a one-time WayForPay checkout", async ({ page }) => {
  await page.route("**/api/wayforpay/checkout", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "E2E checkout capture" }),
    });
  });
  await page.goto("/uk/tails");
  await page.waitForLoadState("networkidle");
  const tailLink = page.locator('a[href^="/uk/tails/"]').first();
  test.skip((await tailLink.count()) === 0, "No public tail is available in the build dataset");
  await tailLink.click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Разова допомога" }).click();

  const modal = page.getByRole("dialog");
  await modal.getByRole("button", { name: /^\+500/ }).click();
  await modal.locator("label", { hasText: "договором публічної оферти" }).click();

  const checkoutRequest = page.waitForRequest("**/api/wayforpay/checkout");
  await modal.getByRole("button", { name: /WayForPay|Зробити донат/ }).click();
  const request = await checkoutRequest;
  expect(request.postDataJSON()).toMatchObject({
    donationPurpose: "tail-one-time",
    donationSchedule: "oneTime",
    amount: 500,
    isAgreed: true,
  });
});

test("tail guardianship requires consent and sends a monthly schedule", async ({ page }) => {
  await page.route("**/api/wayforpay/checkout", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "E2E checkout capture" }),
    });
  });
  await page.goto("/uk/tails");
  await page.waitForLoadState("networkidle");
  const tailLink = page.locator('a[href^="/uk/tails/"]').first();
  test.skip((await tailLink.count()) === 0, "No public tail is available in the build dataset");
  await tailLink.click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Стати опікуном" }).click();

  const modal = page.getByRole("dialog");
  const recurringConsent = modal.locator("label", { hasText: "автоматичне списання" });
  await expect(recurringConsent).toBeVisible();
  await recurringConsent.click();
  await modal.locator("label", { hasText: "договором публічної оферти" }).click();

  const checkoutRequest = page.waitForRequest("**/api/wayforpay/checkout");
  await modal.getByRole("button", { name: /WayForPay|Зробити донат/ }).click();
  const request = await checkoutRequest;
  expect(request.postDataJSON()).toMatchObject({
    donationPurpose: "tail-guardianship",
    donationSchedule: "monthly",
    isAgreed: true,
    isRecurringAgreed: true,
  });
});
