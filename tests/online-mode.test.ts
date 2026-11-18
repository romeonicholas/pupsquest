import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

describe("online mode", () => {
  it("shows the phone version of th estart screen", async () => {
    const res = await request(app).get("/").expect(200);
    expect(res.text).toContain('data-device="phone"');
  });

  it("won't show the kiosk version of the start screen", async () => {
    await request(app).get("/kiosk").expect(404);
  });
});
