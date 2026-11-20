async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      body.error || `GET ${url} failed with status ${response.status}`,
    );
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

export function getUser(colorId, animalId) {
  return getJson(`/api/users?colorId=${colorId}&animalId=${animalId}`);
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.error || `POST ${url} failed with status ${response.status}`,
    );
  }

  return response.json();
}

export function saveRiddleResult(riddleId, wasAnsweredCorrectly, hintsUsed) {
  return postJson("/api/analytics/riddle", {
    riddleId,
    wasAnsweredCorrectly,
    hintsUsed,
  });
}

export function saveGame(userId, scores, hasViewedExitPanel, gameState) {
  return postJson("/api/signout", {
    userId,
    scores,
    hasViewedExitPanel,
    gameState,
  });
}
