import { getUsedColors, getRejoinOptions, getUser } from "../api.js";
import { setUser } from "../state.js";
import { startWatchingForInactivity } from "../inactivity.js";
import { showExitOption } from "../exit.js";
import { showErrorScreenAndReload } from "../errors.js";
import {
  setStatusText,
  updateStatusWheel,
  lowerBadge,
  updateBadgeColor,
  updateBadgeText,
  updateBadgeIcon,
  resetBadge,
} from "../user-panel.js";
import {
  clearColorSelectionIndicators,
  showColorSelectionIndicator,
  clearAnimalSelectionIndicators,
  updateAnimalSelection,
  getSelectedColor,
  getSelectedColorId,
  getSelectedAnimalId,
  buildAnimalOption,
} from "../picker.js";
import { wait } from "../transitions.js";
import { disableAllInput, enableAllInput } from "../input.js";

const REJOIN_ANIMAL_FADE_OUT_MS = 300;
let onUserRejoined = () => {};

export function setUpRejoinScreen(options) {
  onUserRejoined = options.onUserRejoined;
}

export async function showRejoinGameScreen() {
  try {
    const usedColors = await getUsedColors();
    const indicators = document.querySelectorAll(
      ".color-unavailability-indicator",
    );
    indicators.forEach((indicator) => {
      const colorId = parseInt(indicator.getAttribute("data-color-id"), 10);
      if (!usedColors.includes(colorId)) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });
  } catch (error) {
    console.error("Error fetching used colors:", error);
  }

  startWatchingForInactivity();

  document.getElementById("rejoin-screen").style.display = "block";
  document.getElementById("user-panel").style.display = "block";
  document.getElementById("exit-container").style.display = "block";

  resetBadge();
  const shouldLower = true;
  const isInstant = true;
  lowerBadge(shouldLower, isInstant);
  updateStatusWheel("ENTER CODE", isInstant);
  showExitOption("start-over");
}

export async function rejoinSelectColor(colorDisplayName, colorId) {
  showColorSelectionIndicator(colorDisplayName, "rejoin");
  updateBadgeColor(colorDisplayName);

  const rejoinColorPicker = document.getElementById("rejoin-color-picker");
  rejoinColorPicker.classList.add("raised");

  await updateRejoinAnimalContainer(colorId);
}

async function updateRejoinAnimalContainer(colorId) {
  const animalOptionsContainer = document.getElementById(
    "rejoin-animal-options-container",
  );
  const noAnimalsMessage = document.querySelector(".no-animals-message.rejoin");

  animalOptionsContainer.classList.add("faded");
  noAnimalsMessage.classList.remove("visible");

  disableAllInput();

  try {
    await wait(REJOIN_ANIMAL_FADE_OUT_MS);
    const animals = await getRejoinOptions(colorId);

    animalOptionsContainer.replaceChildren(
      ...animals.map((animal) => buildAnimalOption(animal, "rejoin")),
    );

    animalOptionsContainer.classList.remove("faded");

    if (animals.length === 0) {
      noAnimalsMessage.classList.add("visible");
    }

    document.getElementById("scrollable-container").scrollTop = 0;
  } catch (error) {
    showErrorScreenAndReload(error);
  }

  enableAllInput();
}

export function selectRejoinAnimal(animalDisplayName, animalImgPath) {
  updateAnimalSelection(animalDisplayName, "rejoin");
  updateBadgeIcon(animalImgPath);
  const color = getSelectedColor("rejoin");
  updateBadgeText(color, animalDisplayName);

  const rejoinConfirmationPanel = document.getElementById(
    "rejoin-confirmation-panel",
  );
  rejoinConfirmationPanel.classList.add("shown");
}

export async function confirmRejoinAnimal() {
  const rejoinConfirmationPanel = document.getElementById(
    "rejoin-confirmation-panel",
  );
  rejoinConfirmationPanel.classList.add("confirmed");

  const existingUser = await loginUser();
  if (!existingUser) {
    return;
  }

  setUser(existingUser);
  showExitOption("save-exit");

  const riddleScreenConfirmationDummy = document.getElementById(
    "riddle-screen-confirmation-dummy",
  );
  riddleScreenConfirmationDummy.style.display = "none";

  onUserRejoined(existingUser);
}

async function loginUser() {
  try {
    const selectedColorId = getSelectedColorId("rejoin");
    const selectedAnimalId = getSelectedAnimalId("rejoin");

    if (!selectedColorId || !selectedAnimalId) {
      throw new Error("Please select both a color and an animal.");
    }

    const user = await getUser(selectedColorId, selectedAnimalId);

    return user;
  } catch (error) {
    console.error("Error logging in user:", error);
    showErrorScreenAndReload(error);
    return null;
  }
}

export function resetRejoinScreen() {
  const rejoinUserPanelShadow = document.querySelector(
    "#rejoin-screen .user-panel-shadow",
  );
  rejoinUserPanelShadow.style.display = "block";

  const rejoinScreen = document.getElementById("rejoin-screen");
  rejoinScreen.style.display = "none";

  resetBadge();
  clearColorSelectionIndicators("rejoin");
  clearAnimalSelectionIndicators("rejoin");

  const rejoinColorPicker = document.getElementById("rejoin-color-picker");
  rejoinColorPicker.classList.remove("raised");

  const noAnimalsMessage = document.querySelector(".no-animals-message.rejoin");
  noAnimalsMessage.classList.remove("visible");

  const rejoinAnimalOptionsContainer = document.getElementById(
    "rejoin-animal-options-container",
  );
  rejoinAnimalOptionsContainer.innerHTML = "";

  const rejoinConfirmationPanel = document.getElementById(
    "rejoin-confirmation-panel",
  );
  rejoinConfirmationPanel.classList.remove("shown", "confirmed");

  setStatusText("current", "ENTER CODE");
}
