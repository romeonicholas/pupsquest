import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

describe("GET /api/riddles/:id", () => {
  it("returns a riddle", async () => {
    const res = await request(app).get("/api/riddles/1");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it("only works for numbers", async () => {
    const res = await request(app).get("/api/riddles/asdfds");
    expect(res.status).toBe(400);
  });

  it("404s for riddles that don't exist", async () => {
    const res = await request(app).get("/api/riddles/99999999999");
    expect(res.status).toBe(404);
  });
});
