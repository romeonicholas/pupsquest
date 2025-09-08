export function updateUserScore(db, userId, newScore) {
  const updateScore = db.prepare(`
    UPDATE users 
    SET gameState = json_set(gameState, '$.currentScore', ?) 
    WHERE id = ?
  `);

  return updateScore.run(newScore, userId);
}

export function addScoreToHistory(db, userId, score) {
  const updateScores = db.prepare(`
    UPDATE users 
    SET scores = json_insert(scores, '$[#]', ?) 
    WHERE id = ?
  `);

  return updateScores.run(score, userId);
}

export function getUserScores(db, userId) {
  const getScores = db.prepare(`
    SELECT scores, json_extract(gameState, '$.currentScore') as currentScore
    FROM users 
    WHERE id = ?
  `);

  const result = getScores.get(userId);
  if (result) {
    return {
      currentScore: result.currentScore,
      scoreHistory: JSON.parse(result.scores || "[]"),
    };
  }
  return null;
}
