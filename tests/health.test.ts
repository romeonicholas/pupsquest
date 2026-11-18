import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

describe("GET /healthz", () => {
  it("returns 200 when app is running and can reach the database", async () => {
    const res = await request(app).get("/healthz").expect(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
