async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GET ${url} failed with status ${response.status}`);
  }
  return response.json();
}

export function getRiddle(riddleId) {
  return getJson(`/api/riddles/${riddleId}`);
}

export function getAverageScore() {
  return getJson("/api/stats/average-score");
}

export function getUsedColors() {
  return getJson("/api/colors/used");
}

export function getCreationOption() {
  return getJson("/api/users/creation-options");
}
