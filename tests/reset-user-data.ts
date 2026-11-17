import { beforeAll } from "vitest";
import { db } from "../drizzle/db.ts";
import { users, gameStates } from "../drizzle/schema.ts";

beforeAll(async () => {
  await db.delete(users);
  await db.delete(gameStates);
});
