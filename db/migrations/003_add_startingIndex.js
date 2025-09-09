export function up(db) {
  const users = db.prepare(`SELECT id, gameState FROM users`).all();
  const updateGameState = db.prepare(
    `UPDATE users SET gameState = ? WHERE id = ?`
  );

  for (const user of users) {
    try {
      const gameState = JSON.parse(user.gameState);

      if (!gameState.hasOwnProperty("startingIndex")) {
        gameState.startingIndex = 0;
        updateGameState.run(JSON.stringify(gameState), user.id);
      }
    } catch (error) {
      console.error(`Failed to update gameState for user ${user.id}:`, error);
    }
  }
}

export function down(db) {
  const users = db.prepare(`SELECT id, gameState FROM users`).all();
  const updateGameState = db.prepare(
    `UPDATE users SET gameState = ? WHERE id = ?`
  );

  for (const user of users) {
    try {
      const gameState = JSON.parse(user.gameState);

      if (gameState.hasOwnProperty("startingIndex")) {
        delete gameState.startingIndex;
        updateGameState.run(JSON.stringify(gameState), user.id);
      }
    } catch (error) {
      console.error(`Failed to rollback gameState for user ${user.id}:`, error);
    }
  }
}
