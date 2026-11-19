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

export async function findAnswerOption(page: Page, kind: "correct" | "wrong") {
  for (let option = 1; option <= 4; option++) {
    const iconBack = await page
      .locator(`#icon-back-${option}`)
      .getAttribute("src");
    if (iconBack?.includes("answer_backing_correct")) {
      if (kind === "correct") return option;
    } else {
      if (kind === "wrong") return option;
    }
  }

  throw new Error(
    `No ${kind} option found, check if riddle was solved or failed`,
  );
}
