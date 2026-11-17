import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1080, height: 1920 }, hasTouch: true });

test("create a user, answer a riddle correctly, sign out", async ({ page }) => {
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

  const statusWheel = page.locator("#status-wheel-container");
  await expect(statusWheel).toContainText("RIDDLE 1");

  for (let option = 1; option <= 4; option++) {
    const backing = await page
      .locator(`#icon-back-${option}`)
      .getAttribute("src");

    //only way to know correct answer right now x_x
    if (backing?.includes("answer_backing_correct")) {
      await page.locator(`#option-click-area-${option}`).tap();
    }
  }

  await expect(page.locator("#answer-correct-text")).toBeVisible();

  await page.locator("#save-exit-button").tap();
  await page.locator("#sign-out-button").tap();

  await expect(page.locator("#museum-new-game-button")).toBeVisible();
});
