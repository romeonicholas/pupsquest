import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

describe("GET /api/riddles/:id", () => {
  it("returns a riddle", async () => {
    const res = await request(app).get("/api/riddles/1");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });
});
