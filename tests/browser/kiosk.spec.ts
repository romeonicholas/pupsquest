import { test, expect } from "@playwright/test";
import {
  createUserAndStartRiddles,
  findAvailableAnswerOption,
  waitUntilTappable,
  restingPosition,
  tapAnswer,
} from "./helpers.ts";

test.use({ viewport: { width: 1080, height: 1920 }, hasTouch: true });

test("a kiosk user is saved as created on the kiosk", async ({ page }) => {
  const createRequest = page.waitForRequest(
    (request) =>
      request.url().endsWith("/api/users") && request.method() === "POST",
  );
  await createUserAndStartRiddles(page, "kiosk");

  expect((await createRequest).postDataJSON().isKiosk).toBe(true);
});

test("create a user, go to first riddle", async ({ page }) => {
  await createUserAndStartRiddles(page, "kiosk");
});

test("answer a riddle correctly on first attempt and go to next riddle", async ({
  page,
}) => {
  await createUserAndStartRiddles(page, "kiosk");

  await tapAnswer(page, "correct");

  await expect(page.locator("#answer-correct-text")).toBeVisible();

  await page.locator("#next-riddle-button").tap();

  await expect(page.locator("#status-wheel-container")).toContainText(
    "RIDDLE 2",
  );
});

test("open sign out panel (first time), close it, sign out via Save & Exit", async ({
  page,
}) => {
  await createUserAndStartRiddles(page, "kiosk");
  await page.locator("#save-exit-button").tap();

  await expect(page.locator("#sign-out-button")).toBeVisible();
  await expect(page.locator("#cancel-button")).toBeVisible();

  await page.locator("#cancel-button").tap();

  await expect(page.locator("#sign-out-button")).not.toBeVisible();
  await expect(page.locator("#cancel-button")).not.toBeVisible();

  await page.locator("#save-exit-button").tap();

  await expect(page.locator("#museum-new-game-button")).toBeVisible();
});

test("sign out via Sign Out button in open exit panel", async ({ page }) => {
  await createUserAndStartRiddles(page, "kiosk");
  await page.locator("#save-exit-button").tap();

  await expect(page.locator("#sign-out-button")).toBeVisible();
  await expect(page.locator("#cancel-button")).toBeVisible();

  await page.locator("#sign-out-button").tap();

  await expect(page.locator("#museum-new-game-button")).toBeVisible();
});

test("rejoin game after signing out", async ({ page }) => {
  const { colorName, animalName } = await createUserAndStartRiddles(
    page,
    "kiosk",
  );
  await page.locator("#save-exit-button").tap();
  await page.locator("#sign-out-button").tap();
  await page.locator("#museum-rejoin-game-button").tap();

  await expect(
    page
      .locator(".rejoin-color-option", {
        has: page.locator(`#rejoin-${colorName}-selected`),
      })
      .locator(".color-unavailability-indicator"),
  ).not.toHaveClass(/active/);

  await page
    .locator(".rejoin-color-option", {
      has: page.locator(`#rejoin-${colorName}-selected`),
    })
    .locator("button")
    .tap();

  await page
    .locator("#rejoin-animal-options-container .animal-option", {
      hasText: animalName,
    })
    .locator(".animal-button")
    .tap();

  await page.locator("#rejoin-screen #animal-confirmation-button").tap();

  await expect(page.locator("#status-wheel-container")).toContainText(
    "RIDDLE 1",
  );
});

test("the 'Use your phone!' button is visible", async ({ page }) => {
  await page.goto("/kiosk");
  await expect(page.locator("#use-phone-button")).toBeVisible();
});

test("selecting the wrong answer reveals a hint, hints left goes down", async ({
  page,
}) => {
  await createUserAndStartRiddles(page, "kiosk");

  const wrongOption = await findAvailableAnswerOption(page, "wrong");
  const correctOption = await findAvailableAnswerOption(page, "correct");
  const wrongIcon = page.locator(`#icon-front-${wrongOption}`);
  const selectionPanel = page.locator("#selection-layer");
  const hintCounter = page.locator("#hint-count-foreground");

  await waitUntilTappable(page, wrongOption);
  const panelBefore = await restingPosition(selectionPanel);
  const iconBefore = await restingPosition(wrongIcon);
  const counterBefore = await restingPosition(hintCounter);

  await tapAnswer(page, "wrong");

  await waitUntilTappable(page, correctOption);
  const panelAfter = await restingPosition(selectionPanel);
  const iconAfter = await restingPosition(wrongIcon);
  const counterAfter = await restingPosition(hintCounter);

  expect(panelAfter.y - panelBefore.y).toBeCloseTo(222, 0);

  const iconMovedInPanel =
    iconAfter.y - panelAfter.y - (iconBefore.y - panelBefore.y);

  expect(iconMovedInPanel).toBeCloseTo(234, 0);
  expect(counterAfter.x - counterBefore.x).toBeCloseTo(-47, 0);
});

test("after 3 wrong guesses show wrong answer and riddle info", async ({
  page,
}) => {
  await createUserAndStartRiddles(page, "kiosk");
  const hintCounter = page.locator("#hint-count-foreground");
  const counterBefore = await restingPosition(hintCounter);

  await tapAnswer(page, "wrong");
  await tapAnswer(page, "wrong");
  await tapAnswer(page, "wrong");

  await expect(page.locator("#answer-incorrect-text")).toBeVisible();

  const counterAfter = await restingPosition(hintCounter);
  expect(counterAfter.x - counterBefore.x).toBeCloseTo(-3 * 47, 0);
});
