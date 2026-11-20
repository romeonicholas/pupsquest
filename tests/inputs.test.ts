import { describe, it } from "vitest";
import request from "supertest";
import app from "../app.ts";

const idsToReject = ["4.5", "-2", "99999999999"];
const hintCountsToReject = ["4.5", "-2"];

describe("routes with ids in params/body fail for bad ids", () => {
  for (const id of idsToReject) {
    it(`GET /api/users with colorId ${id}`, async () => {
      await request(app).get(`/api/users?colorId=${id}&animalId=1`).expect(400);
    });
  }

  for (const id of idsToReject) {
    it(`POST /api/users with colorId ${id}`, async () => {
      await request(app)
        .post("/api/users")
        .send({ colorId: id, animalId: 1 })
        .expect(400);
    });
  }

  for (const id of idsToReject) {
    it(`POST /api/signout with userId ${id}`, async () => {
      await request(app)
        .post("/api/signout")
        .send({ userId: id, scores: [], gameState: {} })
        .expect(400);
    });
  }

  for (const id of idsToReject) {
    it(`GET /api/users/rejoin-options with colorId ${id}`, async () => {
      await request(app)
        .get(`/api/users/rejoin-options?colorId=${id}`)
        .expect(400);
    });
  }

  for (const id of idsToReject) {
    it(`GET /api/riddles/${id}`, async () => {
      await request(app).get(`/api/riddles/${id}`).expect(400);
    });
  }

  for (const id of idsToReject) {
    it(`POST /api/analytics/riddle with riddleId ${id}`, async () => {
      await request(app)
        .post("/api/analytics/riddle")
        .send({ riddleId: id, wasAnsweredCorrectly: true, hintsUsed: 1 })
        .expect(400);
    });
  }

  for (const hints of hintCountsToReject) {
    it(`POST /api/analytics/riddle with hintsUsed ${hints}`, async () => {
      await request(app)
        .post("/api/analytics/riddle")
        .send({ riddleId: 1, wasAnsweredCorrectly: true, hintsUsed: hints })
        .expect(400);
    });
  }
});
