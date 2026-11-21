function addPrefix(prefix, name) {
  if (prefix) {
    return `${prefix}-${name}`;
  }
  return name;
}

export function clearColorSelectionIndicators(prefix) {
  const selectionIcons = document.querySelectorAll(
    `.${addPrefix(prefix, "color-selection-icon")}`,
  );
  selectionIcons.forEach((icon) => icon.classList.remove("selected"));
}

export function showColorSelectionIndicator(colorDisplayName, prefix) {
  const selectedColorIcon = document.getElementById(
    addPrefix(prefix, `${colorDisplayName}-selected`),
  );
  selectedColorIcon.classList.add("selected");
}

export function clearAnimalSelectionIndicators(prefix) {
  const selector = `.${addPrefix(prefix, "animal-selection-icon")}`;

  document.querySelectorAll(selector).forEach((el) => {
    el.classList.remove("selected");
  });
}

export function updateAnimalSelection(animalDisplayName, prefix) {
  clearAnimalSelectionIndicators(prefix);
  const animalSelectionIndicator = document.getElementById(
    addPrefix(prefix, `${animalDisplayName.toLowerCase()}-selected`),
  );

  animalSelectionIndicator?.classList.add("selected");
}

export function getSelectedColor(prefix) {
  const selectedColorIcon = document.querySelector(
    `.${addPrefix(prefix, "color-selection-icon")}.selected`,
  );
  const color = selectedColorIcon
    ? selectedColorIcon.getAttribute("data-color")
    : "unknown";

  return color;
}

export function getSelectedColorId(prefix) {
  const selector = `.${addPrefix(prefix, "color-selection-icon")}.selected`;
  const selectedColorIcon = document.querySelector(selector);

  const colorId = selectedColorIcon
    ? selectedColorIcon.getAttribute("data-id")
    : null;

  return colorId;
}

export function getSelectedAnimalId(prefix) {
  const selector = `.${addPrefix(prefix, "animal-selection-icon")}.selected`;
  const selectedAnimalIcon = document.querySelector(selector);
  return selectedAnimalIcon?.getAttribute("data-animal") || null;
}

export function buildAnimalOption(animal, screen) {
  const isRejoinScreen = screen === "rejoin";

  const animalOptionTemplate = document.getElementById(
    "animal-option-template",
  );
  const key = animal.name.toLowerCase();
  const animalOption = animalOptionTemplate.content
    .querySelector(".animal-option")
    .cloneNode(true);

  const animalIcon = animalOption.querySelector(".animal-icon");
  animalIcon.src = animal.imgPath;

  const animalCheckmark = animalOption.querySelector(".animal-selection-icon");
  animalCheckmark.id = `${key}-selected`;
  animalCheckmark.dataset.animal = animal.id;

  const animalNameLabel = animalOption.querySelector(".animal-icon-text");
  animalNameLabel.textContent = animal.name;

  const animalButton = animalOption.querySelector(".animal-button");
  animalButton.id = `button-${key}`;
  animalButton.dataset.action = "select-animal";
  animalButton.dataset.animalName = animal.name;
  animalButton.dataset.imgPath = animal.imgPath;

  if (isRejoinScreen) {
    animalCheckmark.id = `rejoin-${key}-selected`;
    animalCheckmark.classList.replace(
      "animal-selection-icon",
      "rejoin-animal-selection-icon",
    );
    animalButton.dataset.action = "select-rejoin-animal";
  }

  return animalOption;
}
