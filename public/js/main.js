import { saveGame } from "./api.js";

import { state, setUser } from "./state.js";

import { enableAllInput, disableAllInput } from "./input.js";

import {
  lowerStartScreen,
  returnToStartScreen,
  showUsePhoneScreen,
  hideUsePhoneScreen,
} from "./screens/start.js";
import {
  setUpCreateScreen,
  showCreateNewUserScreen,
  showColorPicker,
  selectColor,
  selectAnimal,
  confirmAnimal,
  resetCreateNewUserScreen,
} from "./screens/create.js";
import {
  setUpRejoinScreen,
  showRejoinGameScreen,
  rejoinSelectColor,
  selectRejoinAnimal,
  confirmRejoinAnimal,
  resetRejoinScreen,
} from "./screens/rejoin.js";
import {
  transitionToRiddleScreen,
  showRiddle,
  setHints,
  resetRiddleScreen,
} from "./screens/riddle.js";

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
import { showErrorScreenAndReload, setUpErrorReporting } from "./errors.js";

setUpErrorReporting();

const actions = {
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
  "return-to-start": async () => {
    await returnToStartScreen();
    hideUsePhoneScreen();
  },

  "show-color-picker": () => showColorPicker(),
  "select-color": (button) =>
    selectColor(button.dataset.color, Number(button.dataset.colorId)),
  "select-animal": (button) =>
    selectAnimal(button.dataset.animalName, button.dataset.imgPath),
  "confirm-animal": () => confirmAnimal(),
  "transition-to-riddles": () => transitionToRiddleScreen(),

  "rejoin-select-color": (button) =>
    rejoinSelectColor(button.dataset.color, Number(button.dataset.colorId)),
  "select-rejoin-animal": (button) =>
    selectRejoinAnimal(button.dataset.animalName, button.dataset.imgPath),
  "confirm-rejoin-animal": () => confirmRejoinAnimal(),

  "show-riddle": () => showRiddle(),

  "start-over": () => startOver(),
  "save-and-exit": () => saveAndExit(),
  "cancel-exit": () => cancelExit(),

  "dismiss-inactivity": () => dismissInactivityScreen(),
  "handle-inactivity-sign-out": () => handleInactivitySignOut(),
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
  onNoResponse: () => handleInactivitySignOut(),
});

setUpCreateScreen({
  onUserCreated: (newUser) => setHints(newUser.gameState.hintsRemaining, true),
});

setUpRejoinScreen({
  onUserRejoined: (existingUser) => {
    setHints(existingUser.gameState.hintsRemaining, true);
    void transitionToRiddleScreen();
  },
});

async function returnToStartAndResetScreens() {
  disableAllInput();
  await returnToStartScreen();

  hideUsePhoneScreen();
  resetCreateNewUserScreen();
  resetRejoinScreen();
  resetRiddleScreen();
  hideExitDetails();
  showExitOption("start-over");
  enableAllInput();
}

async function startOver() {
  await returnToStartAndResetScreens();
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
        await returnToStartAndResetScreens();
      } catch (error) {
        showErrorScreenAndReload(error);
      }
    } else {
      await startOver();
    }
  }
}

async function handleInactivitySignOut() {
  clearInactivityTimers();

  if (state.currentUser && state.currentGameState) {
    await saveAndExit();
  } else {
    await startOver();
  }
}
