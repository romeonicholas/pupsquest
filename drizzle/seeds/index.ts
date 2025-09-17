import { seedAnimals, seedColors } from "./users";
import { seedAnswerChoices } from "./riddles";

export async function seedDatabase() {
  await seedAnimals();
  await seedColors();
  await seedAnswerChoices();
}
