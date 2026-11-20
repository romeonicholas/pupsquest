import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";

describe("POST /api/users", () => {
  it("returns  a new empty user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ colorId: 5, animalId: 19 })
      .expect(201);

    expect(res.body.user.userColor).toBe(5);
    expect(res.body.user.userAnimal).toBe(19);
    expect(res.body.user.scores).toEqual([]);

    expect(res.body.gameState.riddleQueue.length).toBeGreaterThan(0); // maybe split out into game state testing?
  });

  it("doesn't allow color/animal combos that already exist", async () => {
    await request(app)
      .post("/api/users")
      .send({ colorId: 5, animalId: 19 })
      .expect(409);
  });

  it("fails for colors/animal ids that aren't numbers", async () => {
    await request(app)
      .post("/api/users")
      .send({ colorId: "fdfsa", animalId: 1 })
      .expect(400);

    await request(app)
      .post("/api/users")
      .send({ colorId: 1, animalId: "dsfsgs" })
      .expect(400);
  });
});

describe("GET /api/users", () => {
  it("only works with ids", async () => {
    await request(app).get("/api/users").expect(400);
  });

  it("returns correct user when they exist", async () => {
    const res = await request(app)
      .get("/api/users?colorId=5&animalId=19")
      .expect(200);

    expect(res.body.user.userColor).toBe(5);
    expect(res.body.user.userAnimal).toBe(19);
  });

  it("fails when user doesn't exist", async () => {
    await request(app).get("/api/users?colorId=999&animalId=999").expect(404);
  });
});

describe("POST /api/signout", () => {
  it("saves user info when they leave", async () => {
    const created = await request(app)
      .post("/api/users")
      .send({ colorId: 2, animalId: 7 })
      .expect(201);

    await request(app)
      .post("/api/signout")
      .send({
        userId: created.body.user.id,
        scores: [3],
        hasViewedExitPanel: true,
        gameState: { currentGuesses: [4], hintsRemaining: 5, currentScore: 2 },
      })
      .expect(200);

    const res = await request(app)
      .get("/api/users?colorId=2&animalId=7")
      .expect(200);

    expect(res.body.user.scores).toEqual([3]);
    expect(res.body.gameState.currentGuesses).toEqual([4]);
    expect(res.body.gameState.hintsRemaining).toBe(5);
    expect(res.body.gameState.currentScore).toBe(2);
  });

  it("only works with a user id", async () => {
    await request(app).post("/api/signout").send({ gameState: {} }).expect(400);
  });

  it("returns not found for users that don't exist", async () => {
    await request(app)
      .post("/api/signout")
      .send({ userId: 999999, scores: [], gameState: {} })
      .expect(404);
  });
});

describe("GET /api/users/rejoin-options", () => {
  it("gets animals in use for a color id, including when none are", async () => {
    await request(app)
      .post("/api/users")
      .send({ colorId: 6, animalId: 4 })
      .expect(201);
    await request(app)
      .post("/api/users")
      .send({ colorId: 6, animalId: 11 })
      .expect(201);
    await request(app)
      .post("/api/users")
      .send({ colorId: 8, animalId: 18 })
      .expect(201);

    const res = await request(app)
      .get("/api/users/rejoin-options?colorId=6")
      .expect(200);

    const animalIds = res.body.map((animal: { id: number }) => animal.id);
    expect(animalIds).toHaveLength(2);
    expect(animalIds).toEqual(expect.arrayContaining([4, 11]));
  });

  it("returns empty list when no animals are linked to that color", async () => {
    const res = await request(app)
      .get("/api/users/rejoin-options?colorId=7")
      .expect(200);

    expect(res.body).toEqual([]);
  });
});

describe("GET /api/users/creation-options", () => {
  it("returns 4 colors and 1-8 animals that are still available", async () => {
    const res = await request(app)
      .get("/api/users/creation-options")
      .expect(200);

    expect(res.body).toHaveLength(4);

    const firstOption = res.body[0];
    expect(firstOption.color).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      hex: expect.any(String),
    });

    expect(firstOption.animals.length).toBeGreaterThan(0);
    expect(firstOption.animals[0]).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      imgPath: expect.any(String),
    });
  });
});
