import { expect, test } from "@playwright/test";

test("home monthly donation requires consent and sends a monthly schedule", async ({ page }) => {
  await page.route("**/api/wayforpay/checkout", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "E2E checkout capture" }),
    });
  });
  await page.goto("/uk");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Щомісячна допомога" }).click();
  await expect(page.getByText("Разом ми рятуємо життя тварин з прифронтових територій.")).toBeVisible();

  const recurringConsent = page.locator("label", { hasText: "автоматичне списання" });
  await expect(recurringConsent).toBeVisible();
  await recurringConsent.click();
  await page.locator("label", { hasText: "договором публічної оферти" }).click();

  const checkoutRequest = page.waitForRequest("**/api/wayforpay/checkout");
  await page.getByRole("button", { name: "ЗРОБИТИ ДОНАТ" }).click();
  const request = await checkoutRequest;
  expect(request.postDataJSON()).toMatchObject({
    donationPurpose: "foundation",
    donationSchedule: "monthly",
    isAgreed: true,
    isRecurringAgreed: true,
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
