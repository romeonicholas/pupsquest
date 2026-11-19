import { test, expect, devices } from "@playwright/test";
import { createUserAndStartRiddles } from "./helpers.ts";

test.use({ ...devices["iPhone 13"] });

test("the phone version of the start screen loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#visitor-new-game-button")).toBeVisible();
});

test("the 'Use your phone!' button is not visisble", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#use-phone-button")).not.toBeVisible();
});

test("a phone user isn't saved as created on the kiosk", async ({ page }) => {
  const createRequest = page.waitForRequest(
    (request) =>
      request.url().endsWith("/api/users") && request.method() === "POST",
  );
  await createUserAndStartRiddles(page, "phone");

  expect((await createRequest).postDataJSON().isKiosk).toBe(false);
});

test("create a user, go to first riddle", async ({ page }) => {
  await createUserAndStartRiddles(page, "phone");
});

test("phone users never see the inactivity screen", async ({ page }) => {
  await page.clock.install();
  await createUserAndStartRiddles(page, "phone");

  await page.clock.fastForward(60_000);
  await expect(page.locator("#inactivity-screen")).toHaveCSS("opacity", "0");
});
