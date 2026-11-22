import { getCreationOptions, createUser } from "../api.js";
import { state, setUser } from "../state.js";
import { isKiosk } from "../device.js";
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

const COLOR_PICKER_SLIDE_MS = 800;

let onUserCreated = () => {};

export function setUpCreateScreen(options) {
  onUserCreated = options.onUserCreated;
}

export async function showCreateNewUserScreen() {
  startWatchingForInactivity();

  try {
    state.creationOptions = await getCreationOptions();
    renderColorOptions(state.creationOptions);
  } catch (error) {
    showErrorScreenAndReload(error);
  }

  const createNewUserScreen = document.getElementById("create-new-user-screen");
  createNewUserScreen.style.display = "block";

  const userPanel = document.getElementById("user-panel");
  userPanel.style.display = "block";

  let isInstant = true;
  updateStatusWheel("WELCOME", isInstant);

  const exitContainer = document.getElementById("exit-container");
  exitContainer.style.display = "block";

  const riddleScreenConfirmationDummy = document.getElementById(
    "riddle-screen-confirmation-dummy",
  );
  riddleScreenConfirmationDummy.style.display = "block";

  showExitOption("start-over");
}

export async function showColorPicker() {
  const userCreationInstructions = document.getElementById(
    "user-creation-instructions",
  );
  const colorPicker = document.getElementById("color-picker");

  userCreationInstructions.classList.add("at-color-picker");
  colorPicker.classList.add("shown");

  await wait(COLOR_PICKER_SLIDE_MS);

  updateStatusWheel("CODE NAME");
  const shouldLower = true;
  const isInstant = false;
  lowerBadge(shouldLower, isInstant);
}

function hideConfirmationPanel() {
  const confirmationPanel = document.getElementById("confirmation-panel");
  confirmationPanel.classList.remove("shown", "confirmed");
}

export async function selectColor(colorDisplayName, colorId) {
  const userCreationInstructions = document.getElementById(
    "user-creation-instructions",
  );
  resetBadge();
  hideConfirmationPanel();
  clearColorSelectionIndicators();
  showColorSelectionIndicator(colorDisplayName);
  updateBadgeColor(colorDisplayName);
  updateAnimalOptions(colorId);

  userCreationInstructions.classList.remove("at-color-picker");
  userCreationInstructions.classList.add("at-animals");
}

export function selectAnimal(animalDisplayName, animalImgPath) {
  updateAnimalSelection(animalDisplayName);
  updateBadgeIcon(animalImgPath);
  const color = getSelectedColor();
  updateBadgeText(color, animalDisplayName);

  const confirmationPanel = document.getElementById("confirmation-panel");
  confirmationPanel.classList.add("shown");
}

export async function confirmAnimal() {
  const confirmationPanel = document.getElementById("confirmation-panel");
  confirmationPanel.classList.add("confirmed");

  const newUser = await createUserFromSelection();
  if (!newUser) {
    return;
  }

  setUser(newUser);
  onUserCreated(newUser);

  const riddleScreen = document.getElementById("riddle-screen");
  riddleScreen.style.display = "block";

  showExitOption("save-exit");
}

async function createUserFromSelection() {
  try {
    const selectedColorId = getSelectedColorId();
    const selectedAnimalId = getSelectedAnimalId();

    if (!selectedColorId || !selectedAnimalId) {
      throw new Error("Please select both a color and an animal.");
    }

    return await createUser(
      Number(selectedColorId),
      Number(selectedAnimalId),
      isKiosk,
    );
  } catch (error) {
    showErrorScreenAndReload(error);
    return null;
  }
}

export function resetCreateNewUserScreen() {
  const createNewUserScreen = document.getElementById("create-new-user-screen");
  createNewUserScreen.style.display = "none";

  resetBadge();
  clearColorSelectionIndicators();
  clearAnimalSelectionIndicators();

  const userCreationInstructions = document.getElementById(
    "user-creation-instructions",
  );
  const colorPicker = document.getElementById("color-picker");
  const confirmationPanel = document.getElementById("confirmation-panel");

  userCreationInstructions.classList.remove("at-color-picker", "at-animals");
  colorPicker.classList.remove("shown");
  confirmationPanel.classList.remove("shown", "confirmed");

  const shouldLower = false;
  const isInstant = true;
  lowerBadge(shouldLower, isInstant);
  setStatusText("current", "WELCOME");
}

function renderColorOptions(colorOptions) {
  const colorOptionsContainer = document.getElementById(
    "color-options-container",
  );
  const colorNamesContainer = document.getElementById("color-text-container");
  const colorOptionTemplate = document.getElementById("color-option-template");
  const colorNameTemplate = document.getElementById("color-name-template");

  colorOptionsContainer.replaceChildren();
  colorNamesContainer.replaceChildren();

  for (const { color } of colorOptions) {
    const key = color.name.toLowerCase();

    const colorOption = colorOptionTemplate.content
      .querySelector(".color-option")
      .cloneNode(true);
    colorOption.id = `option-${key}`;
    colorOption.style.backgroundColor = color.hex;

    const colorButton = colorOption.querySelector(".color-button");
    colorButton.id = `button-${key}`;
    colorButton.dataset.color = key;
    colorButton.dataset.colorId = color.id;

    const colorCheckmark = colorOption.querySelector(".color-selection-icon");
    colorCheckmark.id = `${key}-selected`;
    colorCheckmark.dataset.color = color.name;
    colorCheckmark.dataset.id = color.id;

    colorOptionsContainer.append(colorOption);

    const colorNameLabel = colorNameTemplate.content
      .querySelector(".color-text")
      .cloneNode(true);
    colorNameLabel.textContent = color.name;
    colorNamesContainer.append(colorNameLabel);
  }

  for (
    let emptyColorSlot = colorOptions.length;
    emptyColorSlot < 4;
    emptyColorSlot++
  ) {
    const placeholder = colorOptionTemplate.content
      .querySelector(".color-option")
      .cloneNode(true);
    placeholder.classList.add("placeholder");

    const placeholderButton = placeholder.querySelector(".color-button");
    placeholderButton.removeAttribute("data-action");
    placeholderButton.disabled = true;

    colorOptionsContainer.append(placeholder);

    const emptyNameLabel = colorNameTemplate.content
      .querySelector(".color-text")
      .cloneNode(true);
    colorNamesContainer.append(emptyNameLabel);
  }
}

function updateAnimalOptions(colorId) {
  const animalOptionsContainer = document.getElementById(
    "animal-options-container",
  );
  const option = state.creationOptions.find(
    (option) => option.color.id === colorId,
  );
  const animals = option ? option.animals : [];

  animalOptionsContainer.style.transition = "opacity 300ms ease-out";
  animalOptionsContainer.style.opacity = "0";

  setTimeout(() => {
    animalOptionsContainer.replaceChildren(
      ...animals.map((animal) => buildAnimalOption(animal, "create")),
    );
    void animalOptionsContainer.offsetHeight;
    animalOptionsContainer.style.transition = "opacity 300ms ease-in";
    animalOptionsContainer.style.opacity = "1";
  }, 200);
}
