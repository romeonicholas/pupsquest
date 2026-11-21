import { saveGame } from "./api.js";
import { state, setUser } from "./state.js";
import {
  setUpInactivity,
  clearInactivityTimers,
  isInactivityScreenShowing,
  dismissInactivityScreen,
} from "./inactivity.js";
import {
  shouldShowExitPanelDetails,
  firstTimeSaveAndExit,
  cancelExit,
  hideExitDetails,
  showExitOption,
} from "./exit.js";
import {
  lowerStartScreen,
  returnToStartScreen,
  showUsePhoneScreen,
  hideUsePhoneScreen,
} from "./screens/start.js";
import { isKiosk } from "./device.js";
import {
  setUpCreateScreen,
  showCreateNewUserScreen,
  showColorPicker,
  selectColor,
  selectAnimal,
  confirmAnimal,
  resetCreateNewUserScreen,
} from "./screens/create.js";
import { showErrorScreenAndReload } from "./errors.js";
import {
  setUpRejoinScreen,
  showRejoinGameScreen,
  rejoinSelectColor,
  selectRejoinAnimal,
  confirmRejoinAnimal,
  resetRejoinScreen,
} from "./screens/rejoin.js";
import { enableAllInput, disableAllInput } from "./input.js";
import {
  transitionToRiddleScreen,
  showRiddle,
  setHints,
  resetRiddleScreen,
} from "./screens/riddle.js";

const actions = {
  "save-and-exit": () => saveAndExit(),
  "cancel-exit": () => cancelExit(),
  "start-over": () => startOver(),
  "new-game": async () => {
    lowerStartScreen();
    await showCreateNewUserScreen();
  },
  "rejoin-game": async () => {
    lowerStartScreen();
    await showRejoinGameScreen();
  },
  "use-phone": () => {
    lowerStartScreen();
    showUsePhoneScreen();
  },
  "return-to-start": () => {
    returnToStartScreen();
    setTimeout(hideUsePhoneScreen, 600);
  },
  "dismiss-inactivity": () => dismissInactivityScreen(),
  "handle-inactivity-sign-out": () => handleInactivitySignOut(),
  "show-color-picker": () => showColorPicker(),
  "confirm-animal": () => confirmAnimal(),
  "transition-to-riddles": () => transitionToRiddleScreen(),
  "show-riddle": () => showRiddle(),
  "rejoin-select-color": (button) =>
    rejoinSelectColor(button.dataset.color, Number(button.dataset.colorId)),
  "confirm-rejoin-animal": () => confirmRejoinAnimal(),
  "select-color": (button) =>
    selectColor(button.dataset.color, Number(button.dataset.colorId)),
  "select-animal": (button) =>
    selectAnimal(button.dataset.animalName, button.dataset.imgPath),
  "select-rejoin-animal": (button) =>
    selectRejoinAnimal(button.dataset.animalName, button.dataset.imgPath),
};

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = actions[button.dataset.action];
  if (action) {
    action(button);
  } else {
    console.warn(
      `Action ${button.dataset.action} doesn't exist, nothing was done`,
    );
  }
});

function scaleContainer() {
  const container = document.getElementById("container");
  if (container) {
    const scaleX = window.innerWidth / 1080;
    const scaleY = window.innerHeight / 1920;
    const scale = Math.min(scaleX, scaleY);
    container.style.transform = `scale(${scale})`;
  }
}

window.addEventListener("resize", scaleContainer);
window.addEventListener("load", scaleContainer);
document.addEventListener("DOMContentLoaded", scaleContainer);
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

setUpInactivity({
  isKiosk,
  onNoResponse: () => handleInactivitySignOut(),
});

setUpCreateScreen({
  onUserCreated: (newUser) => setHints(newUser.gameState.hintsRemaining),
});

setUpRejoinScreen({
  onUserRejoined: (existingUser) => {
    setHints(existingUser.gameState.hintsRemaining);
    transitionToRiddleScreen();
  },
});

function startOver() {
  returnToStartScreen();
  disableAllInput();

  setTimeout(() => {
    hideUsePhoneScreen();
    resetCreateNewUserScreen();
    resetRejoinScreen();
    showExitOption("start-over");
    enableAllInput();
  }, 600);
}

async function saveAndExit() {
  clearInactivityTimers();
  const isInactivityScreenVisible = isInactivityScreenShowing();

  if (shouldShowExitPanelDetails() && !isInactivityScreenVisible) {
    firstTimeSaveAndExit();
  } else {
    if (state.currentUser && state.currentGameState) {
      try {
        await saveGame(
          state.currentUser.id,
          state.currentUser.scores,
          state.currentUser.hasViewedExitPanel,
          state.currentGameState,
        );

        setUser(null);
        returnToStartScreen();
        disableAllInput();

        setTimeout(() => {
          hideUsePhoneScreen();
          resetRiddleScreen();
          resetCreateNewUserScreen();
          resetRejoinScreen();
          showExitOption("start-over");
          hideExitDetails();
          enableAllInput();
        }, 600);
      } catch (error) {
        console.error("Error saving user data:", error);
        showErrorScreenAndReload(error);
      }
    } else {
      console.error("No user or game state to save.");
    }
  }
}

async function handleInactivitySignOut() {
  clearInactivityTimers();

  if (state.currentUser && state.currentGameState) {
    await saveAndExit();
  } else {
    startOver();
  }
}
