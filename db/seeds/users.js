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

  const upsertCustomUser = db.prepare(`
    INSERT INTO users (userAnimal, userColor, gameState)
    VALUES (?, ?, ?)
    ON CONFLICT(userAnimal, userColor) DO UPDATE SET
      gameState = excluded.gameState
  `);

  const getUserId = db.prepare(`
    SELECT id FROM users WHERE userAnimal = ? AND userColor = ? LIMIT 1
  `);

  const user0 = { colorName: "Green", animalName: "Prairie Dog" };
  const user1 = {
    colorName: "Purple",
    animalName: "Hummingbird",
    gameState: {
      currentRiddleId: 3,
      currentGuesses: [0, 2],
      hintsRemaining: 5,
    },
  };

  db.transaction(() => {
    const c0 = findColorId.get(user0.colorName);
    if (!c0) throw new Error(`Color not found: ${user0.colorName}`);
    const a0 = findAnimalId.get(user0.animalName);
    if (!a0) throw new Error(`Animal not found: ${user0.animalName}`);

    const c1 = findColorId.get(user1.colorName);
    if (!c1) throw new Error(`Color not found: ${user1.colorName}`);
    const a1 = findAnimalId.get(user1.animalName);
    if (!a1) throw new Error(`Animal not found: ${user1.animalName}`);

    insertDefaultUser.run(a0.id, c0.id);
    upsertCustomUser.run(a1.id, c1.id, JSON.stringify(user1.gameState));

    const u0 = getUserId.get(a0.id, c0.id);
    const u1 = getUserId.get(a1.id, c1.id);
    console.log(
      `Seeded user0 id=${u0.id} (${user0.animalName} + ${user0.colorName})`
    );
    console.log(
      `Seeded/updated user1 id=${u1.id} (${user1.animalName} + ${user1.colorName})`
    );
  })();
}
