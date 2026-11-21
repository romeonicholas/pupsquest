import {
  stopWatchingForInactivity,
  hideInactivityScreen,
} from "./inactivity.js";

export function lowerStartScreen() {
  const startScreen = document.getElementById("start-screen");
  startScreen.style.transition = "transform 1800ms ease-in";
  startScreen.style.transform = "translateY(1920px)";
}

export function returnToStartScreen() {
  stopWatchingForInactivity();
  const startScreen = document.getElementById("start-screen");
  startScreen.style.display = "block";

  startScreen.style.transition = "none";
  startScreen.style.transform = "translateY(0)";
  startScreen.style.opacity = "0";

  void startScreen.offsetHeight;

  setTimeout(() => {
    startScreen.style.transition = "opacity 500ms ease-in";
    startScreen.style.opacity = "1";

    hideInactivityScreen();
  }, 10);
}

export function hideUsePhoneScreen() {
  const usePhoneScreen = document.getElementById("use-phone-screen");
  usePhoneScreen.style.display = "none";
}
