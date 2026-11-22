import { state } from "./state.js";

function revealExitPanel(shouldReveal) {
  const screensMovedByExitPanel = [
    "user-panel",
    "riddle-screen",
    "create-new-user-screen",
  ];

  for (const id of screensMovedByExitPanel) {
    const screen = document.getElementById(id);
    if (shouldReveal) {
      screen.classList.add("moved-for-exit-panel");
    } else {
      screen.classList.remove("moved-for-exit-panel");
    }
  }
}

function setExitButtonsDisplay(display) {
  document.getElementById("cancel-button").style.display = display;
  document.getElementById("sign-out-button").style.display = display;
}

function markExitPanelViewed() {
  state.currentUser.hasViewedExitPanel = true;
}

export function shouldShowExitPanelDetails() {
  return state.currentUser && !state.currentUser.hasViewedExitPanel;
}

export function firstTimeSaveAndExit() {
  revealExitPanel(true);
  setExitButtonsDisplay("block");
  markExitPanelViewed();
}

export function cancelExit() {
  revealExitPanel(false);
  setExitButtonsDisplay("none");
}

export function hideExitDetails() {
  revealExitPanel(false);
  setExitButtonsDisplay("none");
}

export function showExitOption(toShowPrefix) {
  const toHidePrefix =
    toShowPrefix === "start-over" ? "save-exit" : "start-over";

  document.getElementById(`${toShowPrefix}-panel`).classList.add("visible");
  document.getElementById(`${toShowPrefix}-button`).style.display = "block";

  document.getElementById(`${toHidePrefix}-panel`).classList.remove("visible");
  document.getElementById(`${toHidePrefix}-button`).style.display = "none";
}
