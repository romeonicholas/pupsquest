import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["iPhone 13"] });

test("the phone version of the start screen loads", async ({ page }) => {
  await page.goto("/?device=visitor");
  await expect(page.locator("#visitor-new-game-button")).toBeVisible();
});

test("the 'Use your phone!' button is not visisble", async ({ page }) => {
  await page.goto("/?device=visitor");
  await expect(page.locator("use-phone-button")).not.toBeVisible();
});
