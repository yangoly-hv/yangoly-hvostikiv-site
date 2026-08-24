import { expect, test } from "@playwright/test";

const ukHeaders = {
  locale: "uk-UA" as const,
  extraHTTPHeaders: {
    "Accept-Language": "uk-UA,uk;q=0.9,en;q=0.8",
  },
};

const switchTo = async (page: import("@playwright/test").Page, name: "EN" | "UA") => {
  const trigger = page.getByRole("button", { name: /^(UA|EN)$/ }).first();
  await trigger.click();
  await page.locator("header button").filter({ hasText: name }).last().click();
};

const localeCookie = async (page: import("@playwright/test").Page) => {
  const cookies = await page.context().cookies();
  return cookies.find((cookie) => cookie.name === "NEXT_LOCALE")?.value;
};

test.describe("locale switcher", () => {
  test.use(ukHeaders);

  test("auto-detects Ukrainian from Accept-Language", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/uk\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "uk");
    await expect(page.getByRole("button", { name: "UA" }).first()).toBeVisible();
  });

  test("switches from auto-detected UA to EN and keeps English after reload", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/uk\/?$/);

    await switchTo(page, "EN");
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("button", { name: "EN" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /help animals feel needed/i
    );
    await expect(
      page.getByText("One-time donation", { exact: true }).filter({ visible: true }).first(),
    ).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: "Home" })).toBeVisible();
    expect(await localeCookie(page)).toBe("en");

    await page.reload();
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /help animals feel needed/i
    );
    expect(await localeCookie(page)).toBe("en");
  });

  test("serves English on /en even with a Ukrainian Accept-Language", async ({
    page,
  }) => {
    await page.goto("/en");
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /help animals feel needed/i
    );
    await expect(
      page.getByText("One-time donation", { exact: true }).filter({ visible: true }).first(),
    ).toBeVisible();
    expect(await localeCookie(page)).toBe("en");
  });

  test("round-trips EN back to UA", async ({ page }) => {
    await page.goto("/uk");
    await switchTo(page, "EN");
    await expect(page).toHaveURL(/\/en\/?$/);

    await switchTo(page, "UA");
    await expect(page).toHaveURL(/\/uk\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "uk");
    await expect(page.getByRole("button", { name: "UA" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /допоможи тваринкам/i
    );
    expect(await localeCookie(page)).toBe("uk");
  });
});
