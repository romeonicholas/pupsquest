export async function getRiddle(riddleId) {
  const response = await fetch(`/api/riddles/${riddleId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch riddle: ${response.status}`);
  }

  return response.json();
}

export async function getAverageScore() {
  const response = await fetch("/api/stats/average-score");
  const data = await response.json();
  return Math.round(data.averageScore);
}
