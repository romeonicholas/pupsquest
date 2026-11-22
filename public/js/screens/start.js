import {
  stopWatchingForInactivity,
  hideInactivityScreen,
  startWatchingForInactivity,
} from "../inactivity.js";
import { wait } from "../transitions.js";

const START_SCREEN_FADE_MS = 500;

export function lowerStartScreen() {
  const startScreen = document.getElementById("start-screen");
  startScreen.classList.add("lowered");
}

export function returnToStartScreen() {
  stopWatchingForInactivity();
  const startScreen = document.getElementById("start-screen");
  startScreen.style.display = "block";

  startScreen.classList.add("hidden-for-return");
  startScreen.classList.remove("lowered");
  void startScreen.offsetHeight;
  startScreen.classList.remove("hidden-for-return");

  hideInactivityScreen();
  return wait(START_SCREEN_FADE_MS);
}

export function showUsePhoneScreen() {
  startWatchingForInactivity();

  document.getElementById("rejoin-screen").style.display = "none";
  document.getElementById("user-panel").style.display = "none";
  document.getElementById("exit-container").style.display = "none";
  document.getElementById("use-phone-screen").style.display = "block";
}

export function hideUsePhoneScreen() {
  const usePhoneScreen = document.getElementById("use-phone-screen");
  usePhoneScreen.style.display = "none";
}
