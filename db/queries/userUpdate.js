export function updateUser(db, userId, updates) {
  const { gameState, scores, hasViewedExitPanel, ...otherFields } = updates;

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

  if (hasViewedExitPanel !== undefined) {
    setParts.push("hasViewedExitPanel = ?");
    params.push(hasViewedExitPanel);
  }

  for (const [key, value] of Object.entries(otherFields)) {
    if (["userAnimal", "userColor"].includes(key) && value !== undefined) {
      setParts.push(`${key} = ?`);
      params.push(value);
    }
  }

  if (setParts.length === 0) {
    throw new Error("No valid fields to update");
  }

  const sql = `UPDATE users SET ${setParts.join(", ")} WHERE id = ?`;
  params.push(userId);

  const stmt = db.prepare(sql);
  return stmt.run(...params);
}
