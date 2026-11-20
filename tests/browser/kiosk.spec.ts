import { test, expect } from "@playwright/test";
import {
  createUserAndStartRiddles,
  findAvailableAnswerOption,
  waitUntilTappable,
  restingPosition,
  tapAnswer,
  playUntilGameOver,
  rejoinsAs,
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

  await expect(page.locator("#museum-new-game-button")).toBeInViewport();
});

test("sign out via Sign Out button in open exit panel", async ({ page }) => {
  await createUserAndStartRiddles(page, "kiosk");
  await page.locator("#save-exit-button").tap();

  await expect(page.locator("#sign-out-button")).toBeVisible();
  await expect(page.locator("#cancel-button")).toBeVisible();

  await page.locator("#sign-out-button").tap();

  await expect(page.locator("#museum-new-game-button")).toBeInViewport();
});

test("rejoin game after signing out", async ({ page }) => {
  const { colorName, animalName } = await createUserAndStartRiddles(
    page,
    "kiosk",
  );
  await page.locator("#save-exit-button").tap();
  await page.locator("#sign-out-button").tap();
  await rejoinsAs(page, colorName, animalName);
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

test("after 7 wrong answers the game ends and user score is saved", async ({
  page,
}) => {
  test.slow();

  const saveRequest = page.waitForRequest((request) =>
    request.url().endsWith("/api/signout"),
  );

  await playUntilGameOver(page);

  const statusWheel = page.locator("#status-wheel-container");

  await expect(statusWheel).toContainText("GAME OVER");
  await expect(page.locator("#game-over")).toBeVisible();
  expect((await saveRequest).postDataJSON().scores).toEqual([1]);
});

test("game over shows comparison to average score", async ({ page }) => {
  test.slow();

  await page.route("**/api/stats/average-score", (route) =>
    route.fulfill({ json: { averageScore: 3 } }),
  );

  await playUntilGameOver(page);

  await expect(page.locator("#score-text")).toHaveText("You solved 1 riddle!");
  await expect(page.locator("#score-comparison-text")).toHaveText(
    "That's 2 less than the average score this week",
  );
});

test("starting a new game after game over starts at riddle 1 with 7 hints", async ({
  page,
}) => {
  test.slow();

  await playUntilGameOver(page);

  const statusWheel = page.locator("#status-wheel-container");

  await expect(statusWheel).toContainText("GAME OVER");

  await page.locator("#next-riddle-button").tap();

  await expect(statusWheel).toContainText("RIDDLE 1");

  const hintContainer = (await page
    .locator("#hint-count-layer")
    .boundingBox())!;
  const hintStrip = await restingPosition(
    page.locator("#hint-count-foreground"),
  );

  expect(hintStrip.x).toBeCloseTo(hintContainer.x, 0);
});

test("rejoining a game in progress keeps answer order, wrong guesses, hint count", async ({
  page,
}) => {
  const { colorName, animalName } = await createUserAndStartRiddles(
    page,
    "kiosk",
  );
  const wrongOption = await tapAnswer(page, "wrong");

  await page.locator("#save-exit-button").tap();
  await page.locator("#sign-out-button").tap();
  await rejoinsAs(page, colorName, animalName);

  const correctOption = await findAvailableAnswerOption(page, "correct");
  await waitUntilTappable(page, correctOption);

  const iconBack = await restingPosition(
    page.locator(`#icon-back-${wrongOption}`),
  );
  const iconFront = await restingPosition(
    page.locator(`#icon-front-${wrongOption}`),
  );

  expect(iconFront.y - iconBack.y).toBeCloseTo(234, 0);

  const hintBar = (await page.locator("#hint-count-layer").boundingBox())!;
  const hintStrip = await restingPosition(
    page.locator("#hint-count-foreground"),
  );
  expect(hintBar.x - hintStrip.x).toBeCloseTo(47, 0);
});

test("when 25 seconds go by without interaction, show inactivity screen", async ({
  page,
}) => {
  await page.clock.install();
  await createUserAndStartRiddles(page, "kiosk");

  const inactivityScreen = page.locator("#inactivity-screen");

  await page.clock.fastForward(25_000);

  await expect(inactivityScreen).toHaveCSS("opacity", "1");

  await page.locator("#inactivity-stay-here").tap();

  await expect(inactivityScreen).toHaveCSS("opacity", "0");
  await expect(page.locator("#status-wheel-container")).toContainText(
    "RIDDLE 1",
  );
});

test("sign out from inactivity screen", async ({ page }) => {
  await page.clock.install();
  await createUserAndStartRiddles(page, "kiosk");

  const inactivityScreen = page.locator("#inactivity-screen");

  await page.clock.fastForward(25_000);

  await expect(inactivityScreen).toHaveCSS("opacity", "1");

  await page.locator("#inactivity-sign-out").tap();

  await expect(inactivityScreen).toHaveCSS("opacity", "0");
  await expect(page.locator("#museum-new-game-button")).toBeInViewport();
});

test("8 seconds after inactivity screen appears, user gets saved and signed out", async ({
  page,
}) => {
  await page.clock.install();
  await createUserAndStartRiddles(page, "kiosk");

  const saveRequest = page.waitForRequest((request) =>
    request.url().endsWith("/api/signout"),
  );

  await page.clock.fastForward(25_000);

  await expect(page.locator("#inactivity-screen")).toHaveCSS("opacity", "1");

  await page.clock.fastForward(8_000);
  await saveRequest;

  await expect(page.locator("#museum-new-game-button")).toBeInViewport();
});

test("the 'Use your phone!' screen opens and closes", async ({ page }) => {
  await page.goto("/kiosk");

  await page.locator("#use-phone-button").tap();
  await expect(page.locator("#use-phone-screen")).toBeVisible();
  await expect(page.locator("#museum-new-game-button")).not.toBeInViewport();

  await page.locator("#use-phone-back-button").tap();
  await expect(page.locator("#museum-new-game-button")).toBeInViewport();
  await expect(page.locator("#use-phone-screen")).toBeHidden();
});

test("hitting start over before finishing user creation cleras out selections and badge", async ({
  page,
}) => {
  await page.goto("/kiosk");
  await page.locator("#museum-new-game-button").tap();
  await page.locator("#user-creation-instructions-button").tap();

  await page.locator("#color-picker .color-button").first().tap();

  const animalOption = page
    .locator("#animal-options-container .animal-option")
    .first();
  const animalName = await animalOption
    .locator(".animal-icon-text")
    .innerText();
  await animalOption.locator(".animal-button").tap();

  const selectedColor = page.locator(
    "#color-picker .color-selection-icon.selected",
  );
  const selectedAnimal = page.locator(
    "#animal-options-container .animal-selection-icon.selected",
  );
  const badgeText = page.locator("#badge-text-container");

  await expect(selectedColor).toHaveCount(1);
  await expect(selectedAnimal).toHaveCount(1);
  await expect(badgeText).toHaveClass(/visible/);
  await expect(badgeText).toContainText(animalName);

  await page.locator("#start-over-button").tap();
  await expect(page.locator("#museum-new-game-button")).toBeInViewport();

  await page.locator("#museum-new-game-button").tap();

  await expect(
    page.locator("#user-creation-instructions-button"),
  ).toBeInViewport();
  await expect(selectedColor).toHaveCount(0);
  await expect(selectedAnimal).toHaveCount(0);
  await expect(badgeText).not.toHaveClass(/visible/);
});

test("user can't rejoin with a color that has no animals", async ({ page }) => {
  const usedColorIds = [1, 3, 7];
  await page.route("**/api/colors/used", (route) =>
    route.fulfill({ json: usedColorIds }),
  );

  await page.goto("/kiosk");
  await page.locator("#museum-rejoin-game-button").tap();

  const allColorIds = [1, 2, 3, 4, 5, 6, 7, 8];

  for (const colorId of allColorIds) {
    const indicator = page.locator(
      `.color-unavailability-indicator[data-color-id="${colorId}"]`,
    );
    if (usedColorIds.includes(colorId)) {
      await expect(indicator).not.toHaveClass(/active/);
    } else {
      await expect(indicator).toHaveClass(/active/);
    }
  }
});

test("user can't load animals for a grayed out color on rejoin", async ({
  page,
}) => {
  await page.route("**/api/colors/used", (route) =>
    route.fulfill({ json: [1] }),
  );

  await page.goto("/kiosk");
  await page.locator("#museum-rejoin-game-button").tap();

  const orangeButton = page.locator(
    '[data-action="rejoin-select-color"][data-color="orange"]',
  );
  await expect(orangeButton).toBeVisible();
  await expect(
    page.locator('.color-unavailability-indicator[data-color-id="6"]'),
  ).toHaveClass(/active/);

  await orangeButton.tap({ force: true });

  await expect(page.locator("#rejoin-orange-selected")).not.toHaveClass(
    /selected/,
  );
});

test("the error screen appears if saving fails, and the site reloads", async ({
  page,
}) => {
  await page.clock.install();
  await createUserAndStartRiddles(page, "kiosk");
  await page.route("**/api/signout", (route) => route.fulfill({ status: 500 }));

  await page.locator("#save-exit-button").tap();
  await page.locator("#sign-out-button").tap();

  const errorScreen = page.locator("#error-screen");
  await expect(errorScreen).toBeVisible();

  const reload = page.waitForEvent("load");
  await page.clock.fastForward(6_000);
  await reload;

  await expect(errorScreen).toBeHidden();
  await expect(page.locator("#museum-new-game-button")).toBeInViewport();
});
