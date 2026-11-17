import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.ts";
import { db } from "../drizzle/db.ts";
import { eq } from "drizzle-orm";
import { users, userAnalytics, gameStates } from "../drizzle/schema.ts";

import { deleteExpiredUsers } from "../drizzle/queries.ts";

describe("deleteExpiredUsers", () => {
  it("deletes users over the exp date", async () => {
    await request(app)
      .post("/api/users")
      .send({ colorId: 3, animalId: 4 })
      .expect(201);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDayOldUser = await request(app)
      .post("/api/users")
      .send({ colorId: 8, animalId: 7 })
      .expect(201);

    await db
      .update(users)
      .set({ createdAt: twoDaysAgo })
      .where(eq(users.id, twoDayOldUser.body.user.id));

    await deleteExpiredUsers();
    await request(app).get("/api/users?colorId=3&animalId=4").expect(200);
    await request(app).get("/api/users?colorId=8&animalId=7").expect(404);
  });

  it("deletes gameStates when it deletes users", async () => {
    const remaining = await db.select().from(gameStates);
    expect(remaining).toHaveLength(1);
  });

  it("adds info to userAnalytics after deletion", async () => {
    const records = await db.select().from(userAnalytics);
    expect(records).toHaveLength(1);
  });
});
