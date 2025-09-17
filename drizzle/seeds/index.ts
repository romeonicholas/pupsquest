import { seedAnimals, seedColors } from "./users";

export async function seedDatabase() {
  await seedAnimals();
  await seedColors();
}
