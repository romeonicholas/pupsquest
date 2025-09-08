export async function updateUserGameState(db, userId, gameState) {
  const updateStmt = db.prepare(`
    UPDATE users 
    SET gameState = ? 
    WHERE id = ?
  `);

  return updateStmt.run(JSON.stringify(gameState), userId);
}
