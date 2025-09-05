export function seedUsers(db) {
  function seededShuffle(array, seed) {
    let s = seed >>> 0 || 1;
    const rand = () => (s = (s * 1664525 + 1013904223) >>> 0) / 0x100000000;
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getAllRiddleIds() {
    return db
      .prepare("SELECT id FROM riddles ORDER BY id")
      .all()
      .map((r) => r.id);
  }

  function initialStateForUser(userId, riddleIds) {
    const queue = seededShuffle(riddleIds, userId * 1103515245);
    return {
      currentRiddleId: queue[0] ?? null,
      currentGuesses: [],
      hintsRemaining: 7,
      riddleQueue: queue,
      queueCursor: 0,
      queueVersion: 1,
    };
  }

  function stateWithCurrent(
    userId,
    riddleIds,
    { currentRiddleId, currentGuesses = [], hintsRemaining = 7 }
  ) {
    const queue = seededShuffle(riddleIds, (userId * 1103515245) ^ 0x9e3779b9);

    if (currentRiddleId != null && !queue.includes(currentRiddleId))
      queue.unshift(currentRiddleId);
    const cursor =
      currentRiddleId != null ? Math.max(0, queue.indexOf(currentRiddleId)) : 0;

    return {
      currentRiddleId: queue[cursor] ?? null,
      currentGuesses,
      hintsRemaining,
      riddleQueue: queue,
      queueCursor: cursor,
      queueVersion: 1,
    };
  }

  const findColorId = db.prepare(
    `SELECT id FROM userColors  WHERE name = ? LIMIT 1`
  );
  const findAnimalId = db.prepare(
    `SELECT id FROM userAnimals WHERE name = ? LIMIT 1`
  );

  const insertIfMissing = db.prepare(`
    INSERT INTO users (userAnimal, userColor, createdAt)
    VALUES (?, ?, ?)
    ON CONFLICT(userAnimal, userColor) DO NOTHING
  `);

  const updateStateByIds = db.prepare(`
    UPDATE users
    SET gameState = ?
    WHERE userAnimal = ? AND userColor = ?
  `);

  const getUserIdByIds = db.prepare(`
    SELECT id FROM users WHERE userAnimal = ? AND userColor = ? LIMIT 1
  `);

  const rows = [
    {
      colorName: "Green",
      animalName: "Prairie Dog",
      which: "user1",
      createdAt: Math.floor(Date.now() / 1000) - 86400,
    },
    {
      colorName: "Red",
      animalName: "Hummingbird",
      which: "user2",
      createdAt: Math.floor(Date.now() / 1000) - 3600,
    },
  ];

  const allRiddleIds = getAllRiddleIds();

  db.transaction(() => {
    for (const { colorName, animalName, which, createdAt } of rows) {
      const color = findColorId.get(colorName);
      if (!color)
        throw new Error(
          `Color not found: "${colorName}". Seed userColors first.`
        );
      const animal = findAnimalId.get(animalName);
      if (!animal)
        throw new Error(
          `Animal not found: "${animalName}". Seed userAnimals first.`
        );

      insertIfMissing.run(animal.id, color.id, createdAt);

      const userRow = getUserIdByIds.get(animal.id, color.id);
      if (!userRow) throw new Error("Failed to fetch user id after insert");

      let state;
      if (which === "user1") {
        state = initialStateForUser(userRow.id, allRiddleIds);
      } else if (which === "user2") {
        state = stateWithCurrent(userRow.id, allRiddleIds, {
          currentRiddleId: 3,
          currentGuesses: [0, 2],
          hintsRemaining: 5,
          queueCursor: 2,
        });
      }

      updateStateByIds.run(JSON.stringify(state), animal.id, color.id);
    }
  })();
}
