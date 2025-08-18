export function getAllColors(db) {
  return db
    .prepare(
      `
    SELECT id, name, hex, badgePath
    FROM userColors
    ORDER BY name
  `
    )
    .all();
}

export function getAvailableAnimalsForColor(db, colorId) {
  return db
    .prepare(
      `
    SELECT ua.id, ua.name, ua.imgPath
    FROM userAnimals ua
    WHERE NOT EXISTS (
      SELECT 1 FROM users u
      WHERE u.userAnimal = ua.id
        AND u.userColor  = ?
    )
    ORDER BY ua.name
  `
    )
    .all(colorId);
}

export function createUser(db, { colorId, animalId }) {
  const DEFAULT_HINTS = 7;

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

  const getAllRiddleIds = db.prepare(`SELECT id FROM riddles ORDER BY id`);
  const insertUser = db.prepare(`
    INSERT INTO users (userAnimal, userColor, gameState, createdAt)
    VALUES (?, ?, ?, strftime('%s','now'))
  `);
  const updateState = db.prepare(`
    UPDATE users SET gameState = ? WHERE id = ?
  `);

  try {
    const tx = db.transaction(() => {
      const placeholder = JSON.stringify({
        currentRiddleId: null,
        currentGuesses: [],
        hintsRemaining: DEFAULT_HINTS,
      });
      const info = insertUser.run(animalId, colorId, placeholder);
      const userId = Number(info.lastInsertRowid);

      const allIds = getAllRiddleIds.all().map((r) => r.id);
      const queue = seededShuffle(allIds, userId * 1103515245);
      const state = {
        currentRiddleId: queue[0] ?? null,
        currentGuesses: [],
        hintsRemaining: DEFAULT_HINTS,
        riddleQueue: queue,
        queueCursor: 0,
        queueVersion: 1,
        completed: [],
      };

      updateState.run(JSON.stringify(state), userId);

      return userId;
    });

    return tx();
  } catch (e) {
    if (/UNIQUE constraint failed/i.test(String(e.message))) {
      throw new Error("That animal is already taken for this color.");
    }
    throw e;
  }
}
