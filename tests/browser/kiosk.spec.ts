import { test, expect, type Page } from "@playwright/test";
import { createUserAndStartRiddles } from "./helpers.ts";

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
