import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

describe("GET /api/colors/used", () => {
  it("succeeds but returns empty while there ar eno users", async () => {
    const res = await request(app).get("/api/colors/used");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns with color ids for used colors", async () => {
    await request(app)
      .post("/api/users")
      .send({ colorId: 2, animalId: 12 })
      .expect(201);

    const res = await request(app).get("/api/colors/used");
    expect(res.body).toEqual([2]);
  });
});
