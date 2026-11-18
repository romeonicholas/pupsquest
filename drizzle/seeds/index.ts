import { pool } from "../db.ts";
import { seedAnimals, seedColors } from "./users.ts";
import { seedAnswerChoices, seedRiddles } from "./riddles.ts";

async function seedDatabase() {
  await seedAnimals();
  await seedColors();
  await seedAnswerChoices();
  await seedRiddles();
}

await seedDatabase();
await pool.end();
