export function up(db) {
  const cols = db
    .prepare(`PRAGMA table_info('users')`)
    .all()
    .map((c) => c.name);

  if (!cols.includes("scores")) {
    db.exec(`ALTER TABLE users ADD COLUMN scores TEXT DEFAULT '[]';`);
    db.exec(`UPDATE users SET scores = '[]' WHERE scores IS NULL;`);
  }

  const users = db.prepare(`SELECT id, gameState FROM users`).all();
  const updateGameState = db.prepare(
    `UPDATE users SET gameState = ? WHERE id = ?`
  );

  for (const user of users) {
    try {
      const gameState = JSON.parse(user.gameState);

      if (!gameState.hasOwnProperty("currentScore")) {
        gameState.currentScore = 0;
        updateGameState.run(JSON.stringify(gameState), user.id);
      }
    } catch (error) {
      console.error(`Failed to update gameState for user ${user.id}:`, error);
    }
  }
}
