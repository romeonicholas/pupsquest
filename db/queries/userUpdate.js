export function updateUser(db, userId, updates) {
  const { gameState, scores } = updates;

  const setParts = [];
  const params = [];

  if (gameState !== undefined) {
    setParts.push("gameState = ?");
    params.push(JSON.stringify(gameState));
  }

  if (scores !== undefined) {
    setParts.push("scores = ?");
    params.push(JSON.stringify(scores));
  }

  if (setParts.length === 0) {
    throw new Error("No valid fields to update");
  }

  const sql = `UPDATE users SET ${setParts.join(", ")} WHERE id = ?`;
  params.push(userId);

  const stmt = db.prepare(sql);
  return stmt.run(...params);
}
