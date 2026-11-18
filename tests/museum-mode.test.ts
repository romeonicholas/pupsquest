import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

describe("museum mode", () => {
  it("shows the kiosk version of the start screen", async () => {
    const res = await request(app).get("/kiosk").expect(200);
    expect(res.text).toContain('data-device="kiosk"');
  });
});
