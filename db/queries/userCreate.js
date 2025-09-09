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

export function getAvailableAnimalsForColor(db, colorId, limit = null) {
  let query = `
    SELECT ua.id, ua.name, ua.imgPath
    FROM userAnimals ua
    WHERE ua.id NOT IN (
      SELECT u.userAnimal 
      FROM users u 
      WHERE u.userColor = ?
    )
    ORDER BY ua.name
  `;

  if (limit !== null) {
    query += ` LIMIT ?`;
  }

  const stmt = db.prepare(query);

  return limit !== null ? stmt.all(colorId, limit) : stmt.all(colorId);
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

  const getUserById = db.prepare(`
    SELECT 
      u.id,
      u.gameState,
      u.createdAt,
      u.scores,
      uc.id as colorId,
      uc.name as colorName,
      uc.hex as colorHex,
      uc.badgePath as colorBadgePath,
      ua.id as animalId,
      ua.name as animalName,
      ua.imgPath as animalImgPath
    FROM users u
    INNER JOIN userColors uc ON uc.id = u.userColor
    INNER JOIN userAnimals ua ON ua.id = u.userAnimal
    WHERE u.id = ?
  `);

  try {
    const tx = db.transaction(() => {
      const placeholder = JSON.stringify({
        currentRiddleId: null,
        currentGuesses: [],
        hintsRemaining: DEFAULT_HINTS,
        currentScore: 0,
      });
      const info = insertUser.run(animalId, colorId, placeholder);
      const userId = Number(info.lastInsertRowid);

      const allIds = getAllRiddleIds.all().map((r) => r.id);
      const queue = seededShuffle(allIds, userId * 1103515245);
      const state = {
        currentRiddleId: queue[0] ?? null,
        currentGuesses: [],
        hintsRemaining: DEFAULT_HINTS,
        currentScore: 0,
        riddleQueue: queue,
        queueCursor: 0,
        queueVersion: 1,
        completed: [],
      };

      updateState.run(JSON.stringify(state), userId);

      const user = getUserById.get(userId);
      return parseUserData(user);
    });

    return tx();
  } catch (e) {
    if (/UNIQUE constraint failed/i.test(String(e.message))) {
      throw new Error("That animal is already taken for this color.");
    }
    throw e;
  }
}

export function getUserById(db, userId) {
  const getUserById = db.prepare(
    `
    SELECT id, userAnimal, userColor, gameState, createdAt
    FROM users
    WHERE id = ?
  `
  );

  const user = getUserById.get(userId);
  return parseUserData(user);
}

function parseUserData(user) {
  if (!user) return null;

  return {
    ...user,
    gameState: JSON.parse(user.gameState),
    scores: JSON.parse(user.scores || "[]"),
  };
}
