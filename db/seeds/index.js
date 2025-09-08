import { seedUserColors } from "./userColors.js";
import { seedUserAnimals } from "./userAnimals.js";
import { seedAnswerChoices } from "./answerChoices.js";
import { seedUsers } from "./users.js";
import { seedRiddles } from "./riddles.js";

export async function runAllSeeds(db) {
  seedUserColors(db);
  seedUserAnimals(db);
  seedAnswerChoices(db);
  seedRiddles(db);
  seedUsers(db);
}
