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
