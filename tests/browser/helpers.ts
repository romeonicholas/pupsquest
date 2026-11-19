import { expect, type Page, type Locator } from "@playwright/test";

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

async function answerWasTapped(page: Page, option: number) {
  const back = await page.locator(`#icon-back-${option}`).boundingBox();
  const front = await page.locator(`#icon-front-${option}`).boundingBox();

  return Math.abs(front!.y - back!.y) > 1;
}

export async function findAvailableAnswerOption(
  page: Page,
  kind: "correct" | "wrong",
) {
  for (let option = 1; option <= 4; option++) {
    if (await answerWasTapped(page, option)) continue;

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
    `No available ${kind} option found, check if riddle was solved or failed`,
  );
}

export async function waitUntilTappable(page: Page, option: number) {
  await page.locator(`#option-click-area-${option}`).tap({ trial: true });
}

export async function restingPosition(locator: Locator) {
  let previous = await locator.boundingBox();

  while (true) {
    await locator.page().waitForTimeout(300);
    const current = await locator.boundingBox();

    if (current?.x === previous?.x && current?.y === previous?.y) {
      return current!;
    }
    previous = current;
  }
}

export async function tapAnswer(page: Page, kind: "correct" | "wrong") {
  const option = await findAvailableAnswerOption(page, kind);

  await waitUntilTappable(page, option);
  await page.locator(`#option-click-area-${option}`).tap();
  await restingPosition(page.locator(`#icon-front-${option}`));

  return option;
}
