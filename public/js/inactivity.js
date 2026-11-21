import { isKiosk } from "./device.js";

const INACTIVITY_THRESHOLD = 25000;
const INACTIVITY_CONFIRMATION_THRESHOLD = 8000;

let inactivityTimeout;
let inactivityConfirmationTimeout;

let isWatchingForInactivity = false;
const isInactivityEnabled = isKiosk;

let onNoResponse = () => {};

export function setUpInactivity(options) {
  onNoResponse = options.onNoResponse;

  document.addEventListener("mousemove", restartInactivityTimer);
  document.addEventListener("keydown", restartInactivityTimer);
  document.addEventListener("scroll", restartInactivityTimer);
  document.addEventListener("touchstart", restartInactivityTimer);
}

function restartInactivityTimer() {
  if (!isWatchingForInactivity || !isInactivityEnabled) {
    return;
  }
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(showInactivityScreen, INACTIVITY_THRESHOLD);
}

function startInactivityConfirmationTimer() {
  clearTimeout(inactivityConfirmationTimeout);

  inactivityConfirmationTimeout = setTimeout(
    onNoResponse,
    INACTIVITY_CONFIRMATION_THRESHOLD,
  );
}

function showInactivityScreen() {
  const inactivityScreen = document.getElementById("inactivity-screen");
  inactivityScreen.style.opacity = "1";
  inactivityScreen.style.pointerEvents = "auto";
  startInactivityConfirmationTimer();
}

export function hideInactivityScreen() {
  const inactivityScreen = document.getElementById("inactivity-screen");
  inactivityScreen.style.opacity = "0";
  inactivityScreen.style.pointerEvents = "none";
}

export function dismissInactivityScreen() {
  hideInactivityScreen();
  clearTimeout(inactivityConfirmationTimeout);
  restartInactivityTimer();
}

export function startWatchingForInactivity() {
  isWatchingForInactivity = true;
  restartInactivityTimer();
}

export function stopWatchingForInactivity() {
  isWatchingForInactivity = false;
  clearInactivityTimers();
}

export function clearInactivityTimers() {
  clearTimeout(inactivityTimeout);
  clearTimeout(inactivityConfirmationTimeout);
}

export function isInactivityScreenShowing() {
  const inactivityScreen = document.getElementById("inactivity-screen");
  return (
    inactivityScreen.style.opacity === "1" &&
    inactivityScreen.style.pointerEvents === "auto"
  );
}
