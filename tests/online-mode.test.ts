import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../app.ts";

vi.mock("../config.ts", () => ({
  config: { mode: "online", port: 3000, host: "0.0.0.0" },
}));

describe("online mode", () => {
  it("shows the phone version of the start screen", async () => {
    const res = await request(app).get("/").expect(200);
    expect(res.text).toContain('data-device="phone"');
  });

  it("won't show the kiosk version of the start screen", async () => {
    await request(app).get("/kiosk").expect(404);
  });
});
