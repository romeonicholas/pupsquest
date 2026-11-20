import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

describe("GET /api/stats/average-score", () => {
  it("should be 0 before any scores exist", async () => {
    const res = await request(app).get("/api/stats/average-score");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ averageScore: 0 });
  });

  it("averages the scores saved by users", async () => {
    const newUser = await request(app)
      .post("/api/users")
      .send({ colorId: 5, animalId: 3 })
      .expect(201);

    await request(app)
      .post("/api/signout")
      .send({ userId: newUser.body.user.id, scores: [2, 4], gameState: {} })
      .expect(200);

    const res = await request(app).get("/api/stats/average-score");
    expect(res.body).toEqual({ averageScore: 3 });
  });
});

describe("POST /api/analytics/riddle", () => {
  it("saves how user answered a riddle, returns it", async () => {
    const res = await request(app)
      .post("/api/analytics/riddle")
      .send({ riddleId: 1, wasAnsweredCorrectly: true, hintsUsed: 2 })
      .expect(201);

    expect(res.body).toMatchObject({
      riddleId: 1,
      wasAnswered: true,
      wasAnsweredCorrectly: true,
      hintsUsed: 2,
    });
  });

  it("fails on string riddle ids", async () => {
    await request(app)
      .post("/api/analytics/riddle")
      .send({
        riddleId: "asdfasdfdsd",
        wasAnsweredCorrectly: true,
        hintsUsed: 2,
      })
      .expect(400);
  });

  it("fails for nonexistant riddles", async () => {
    await request(app)
      .post("/api/analytics/riddle")
      .send({ riddleId: 999999999, wasAnsweredCorrectly: true, hintsUsed: 2 })
      .expect(500);
  });
});
