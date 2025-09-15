export function up(db) {
  const cols = db
    .prepare(`PRAGMA table_info('users')`)
    .all()
    .map((c) => c.name);

  if (!cols.includes("hasViewedExitPanel")) {
    db.exec(
      `ALTER TABLE users ADD COLUMN hasViewedExitPanel INTEGER DEFAULT 0 CHECK (hasViewedExitPanel IN (0, 1));`
    );

    db.exec(
      `UPDATE users SET hasViewedExitPanel = 0 WHERE hasViewedExitPanel IS NULL;`
    );

    const newCols = db
      .prepare(`PRAGMA table_info('users')`)
      .all()
      .map((c) => c.name);
  }
}

export function down(db) {
  const cols = db
    .prepare(`PRAGMA table_info('users')`)
    .all()
    .map((c) => c.name);

  if (cols.includes("hasViewedExitPanel")) {
    db.exec(`
      CREATE TABLE users_new (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        userAnimal INTEGER NOT NULL,
        userColor  INTEGER NOT NULL,
        gameState  TEXT NOT NULL DEFAULT '{"currentGuesses":[],"hintsRemaining":7,"currentScore":0,"startingIndex":0,"currentShuffledChoices":[],"currentCorrectAnswerIndex":0}',
        createdAt  INTEGER,
        scores     TEXT DEFAULT '[]',
        UNIQUE (userAnimal, userColor),
        FOREIGN KEY (userAnimal) REFERENCES userAnimals(id),
        FOREIGN KEY (userColor)  REFERENCES userColors(id),
        CHECK (json_valid(gameState)),
        CHECK (json_valid(scores))
      );

      INSERT INTO users_new (id, userAnimal, userColor, gameState, createdAt, scores)
      SELECT id, userAnimal, userColor, gameState, createdAt, scores
      FROM users;

      DROP TABLE users;
      ALTER TABLE users_new RENAME TO users;
    `);
  }
}
