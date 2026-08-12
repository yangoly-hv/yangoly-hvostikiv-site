import { expect, test } from "@playwright/test";

for (const locale of ["uk", "en"] as const) {
  for (const path of ["", "/blog", "/tails", "/reporting"] as const) {
    test(`${locale}${path || "/"} renders`, async ({ page }) => {
      const response = await page.goto(`/${locale}${path}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("main")).toBeVisible();
    });
  }
}

test("contact form is interactive", async ({ page }) => {
  await page.goto("/en/blog");
  const contacts = page.locator("#contacts");
  await contacts.scrollIntoViewIfNeeded();
  await contacts.locator('input[name="name"]').fill("Smoke Test");
  await contacts.locator('input[name="phone"]').fill("+38 (099) 111-22-33");
  await contacts.locator('textarea[name="message"]').fill("Automated smoke test");
  await expect(contacts.locator('button[type="submit"]')).toBeEnabled();
});

for (const locale of ["uk", "en"] as const) {
  test(`${locale}/event-registration renders registration form`, async ({ page }) => {
    const response = await page.goto(`/${locale}/event-registration`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="petName"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });
}
