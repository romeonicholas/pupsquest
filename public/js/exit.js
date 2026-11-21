import { state } from "./state.js";

function moveScreensForExitPanel(transform, transition) {
  const screensMovedByExitPanel = [
    "user-panel",
    "riddle-screen",
    "create-new-user-screen",
  ];

  for (const id of screensMovedByExitPanel) {
    const screen = document.getElementById(id);
    screen.style.transition = transition;
    screen.style.transform = transform;
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
  moveScreensForExitPanel("translateY(380px)", "transform 800ms ease-in");
  setExitButtonsDisplay("block");
  markExitPanelViewed();
}

export function cancelExit() {
  moveScreensForExitPanel("translateY(0px)", "transform 800ms ease-in");
  setExitButtonsDisplay("none");
}

export function hideExitDetails() {
  setTimeout(() => {
    moveScreensForExitPanel("translateY(0px)", "none");
    setExitButtonsDisplay("none");
  }, 500);
}

export function showExitOption(toShowPrefix) {
  const toHidePrefix =
    toShowPrefix === "start-over" ? "save-exit" : "start-over";

  document.getElementById(`${toShowPrefix}-panel`).classList.add("visible");
  document.getElementById(`${toShowPrefix}-button`).style.display = "block";

  document.getElementById(`${toHidePrefix}-panel`).classList.remove("visible");
  document.getElementById(`${toHidePrefix}-button`).style.display = "none";
}
