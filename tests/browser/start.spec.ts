import { test, expect } from "@playwright/test";

test("the museum kiosk version of the start screen loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#museum-new-game-button")).toBeVisible();
});

test("the phone version of the start screen loads", async ({ page }) => {
  await page.goto("/?device=visitor");
  await expect(page.locator("#visitor-new-game-button")).toBeVisible();
});
