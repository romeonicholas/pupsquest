export async function getAverageScore(db) {
  const query = db.prepare(`
    SELECT scores 
    FROM users 
    WHERE scores IS NOT NULL AND scores != ''
  `);

  const users = query.all();

  if (users.length === 0) {
    return { averageScore: 0, totalUsers: 0 };
  }

  let totalScore = 0;
  let validUsers = 0;

  users.forEach((user) => {
    try {
      const scoresArray = JSON.parse(user.scores);
      if (Array.isArray(scoresArray) && scoresArray.length > 0) {
        const userAverage =
          scoresArray.reduce((sum, score) => sum + score, 0) /
          scoresArray.length;
        totalScore += userAverage;
        validUsers++;
      }
    } catch (error) {
      console.warn("Invalid JSON in scores field:", user.scores);
    }
  });

  return {
    averageScore: validUsers > 0 ? totalScore / validUsers : 0,
  };
}
