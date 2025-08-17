export function seedUsers(db) {
  const findColorId = db.prepare(
    `SELECT id FROM userColors  WHERE name = ? LIMIT 1`
  );
  const findAnimalId = db.prepare(
    `SELECT id FROM userAnimals WHERE name = ? LIMIT 1`
  );

  const insertDefaultUser = db.prepare(`
    INSERT INTO users (userAnimal, userColor)
    VALUES (?, ?)
    ON CONFLICT(userAnimal, userColor) DO NOTHING
  `);

  const resetUserState = db.prepare(`
    UPDATE users
    SET gameState = ?
    WHERE userAnimal = ? AND userColor = ?
  `);

  const upsertCustomUser = db.prepare(`
    INSERT INTO users (userAnimal, userColor, gameState)
    VALUES (?, ?, ?)
    ON CONFLICT(userAnimal, userColor) DO UPDATE SET
      gameState = excluded.gameState
  `);

  const getUserId = db.prepare(`
    SELECT id FROM users WHERE userAnimal = ? AND userColor = ? LIMIT 1
  `);

  const DEFAULT_GAME_STATE = JSON.stringify({
    currentRiddleId: 0,
    currentGuesses: [],
    hintsRemaining: 7,
  });

  const user1 = { colorName: "Green", animalName: "Prairie Dog" };
  const user2 = {
    colorName: "Purple",
    animalName: "Hummingbird",
    gameState: {
      currentRiddleId: 3,
      currentGuesses: [0, 2],
      hintsRemaining: 5,
    },
  };

  db.transaction(() => {
    const color0 = findColorId.get(user1.colorName);
    if (!color0) throw new Error(`Color not found: ${user1.colorName}`);
    const animal0 = findAnimalId.get(user1.animalName);
    if (!animal0) throw new Error(`Animal not found: ${user1.animalName}`);

    const color1 = findColorId.get(user2.colorName);
    if (!color1) throw new Error(`Color not found: ${user2.colorName}`);
    const animal1 = findAnimalId.get(user2.animalName);
    if (!animal1) throw new Error(`Animal not found: ${user2.animalName}`);

    insertDefaultUser.run(animal0.id, color0.id);
    resetUserState.run(DEFAULT_GAME_STATE, animal0.id, color0.id);

    upsertCustomUser.run(
      animal1.id,
      color1.id,
      JSON.stringify(user2.gameState)
    );

    const u1 = getUserId.get(animal0.id, color0.id);
    const u2 = getUserId.get(animal1.id, color1.id);
    console.log(`Seeded user${u1.id}: ${user1.colorName} ${user1.animalName}`);
    console.log(`Seeded user${u2.id}: ${user2.colorName} ${user2.animalName}`);
  })();
}
