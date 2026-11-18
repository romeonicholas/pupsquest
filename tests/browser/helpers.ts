import { expect, type Page } from "@playwright/test";

export async function createUserAndStartRiddles(
  page: Page,
  device: "kiosk" | "phone",
) {
  if (device === "phone") {
    await page.goto("/");
    await page.locator("#visitor-new-game-button").tap();
  } else {
    await page.goto("/kiosk");
    await page.locator("#museum-new-game-button").tap();
  }

  await page.locator("#user-creation-instructions-button").tap();

  const colorButton = page.locator("#color-picker .color-button").first();
  const colorName = (await colorButton.getAttribute("id"))!.replace(
    "button-",
    "",
  );

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

  return { colorName, animalName };
}
