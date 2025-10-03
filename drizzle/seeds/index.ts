import { seedAnimals, seedColors } from "./users";
import { seedAnswerChoices, seedRiddles } from "./riddles";

async function seedDatabase() {
  await seedAnimals();
  await seedColors();
  await seedAnswerChoices();
  await seedRiddles();
}

seedDatabase();
