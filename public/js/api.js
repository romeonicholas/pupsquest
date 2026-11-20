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

export function getCreationOptions() {
  return getJson("/api/users/creation-options");
}

export function getRejoinOptions(colorId) {
  return getJson(`/api/users/rejoin-options?colorId=${colorId}`);
}
