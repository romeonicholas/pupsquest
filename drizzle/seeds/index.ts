import { seedAnimals } from "./users";

export async function seedDatabase() {
  await seedAnimals();
}
