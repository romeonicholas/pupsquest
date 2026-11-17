import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1080, height: 1920 }, hasTouch: true });

test("create a user", async ({ page }) => {
  await page.goto("/");

  await page.locator("#museum-new-game-button").tap();
  await page.locator("#user-creation-instructions-button").tap();

  const colorButton = page.locator("#color-picker .color-button").first();
  await colorButton.tap();

  const animalOption = page
    .locator("#animal-options-container .animal-option")
    .first();
  await animalOption.locator(".animal-button").tap();
  const animalName = await animalOption
    .locator(".animal-icon-text")
    .innerText();

  await expect(page.locator("#color-animal-text")).toContainText(animalName);

  await page
    .locator("#create-new-user-screen #animal-confirmation-button")
    .tap();
  await page.locator("#transition-to-riddles-button").tap();

  await expect(page.locator("#status-wheel-container")).toContainText(
    "RIDDLE 1",
  );
});
