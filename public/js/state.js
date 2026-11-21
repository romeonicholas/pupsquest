export const state = {
  creationOptions: [],
  currentUser: null,
  currentGameState: null,
};

export function setUser(userData) {
  if (!userData) {
    state.currentUser = null;
    state.currentGameState = null;
    return;
  }

  state.currentUser = userData.user;
  state.currentGameState = userData.gameState;
}
