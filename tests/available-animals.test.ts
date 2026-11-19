import { describe, it, expect } from "vitest";
import { db } from "../drizzle/db.ts";
import { users, userAnimals } from "../drizzle/schema.ts";
import { getAvailableAnimalsForColor } from "../drizzle/queries.ts";

// would require like 30 API calls and a clean db, just keep it separate
describe("getAvailableAnimalsForColor", () => {
  it("won't offer animals for a color when already taken", async () => {
    const allAnimals = await db
      .select({ id: userAnimals.id })
      .from(userAnimals);

    const takenAnimals = allAnimals.slice(0, -8);
    await db
      .insert(users)
      .values(
        takenAnimals.map((animal) => ({ userColor: 1, userAnimal: animal.id })),
      );

    const availableAnimals = allAnimals.slice(-8);
    const availableAnimalsIds = availableAnimals.map((animal) => animal.id);

    const newGameOfferedAnimals = await getAvailableAnimalsForColor(1);
    const newGameOfferedAnimalsIds = newGameOfferedAnimals.map(
      (animal) => animal.id,
    );

    expect(newGameOfferedAnimalsIds).toHaveLength(availableAnimalsIds.length);
    expect(newGameOfferedAnimalsIds).toEqual(
      expect.arrayContaining(availableAnimalsIds),
    );
  });
});
