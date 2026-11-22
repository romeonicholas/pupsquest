import { wait } from "./transitions.js";

const STATUS_WHEEL_TURN_MS = 800;

const statusWheelContainer = document.getElementById("status-wheel-container");

export function setStatusText(position, text) {
  const statusText = document.querySelector(`.${position}-text .status-text`);

  if (statusText) {
    statusText.innerText = text;
  } else {
    console.error(`Could not find .status-text inside .${position}-text`);
  }
}

export function updateStatusWheel(wheelText, instant = false, additionalClass) {
  setStatusText("next", wheelText);
  let currentStatusText = document.querySelector(".current-text");
  let nextStatusText = document.querySelector(".next-text");

  if (instant) {
    currentStatusText.classList.add("instant");
    nextStatusText.classList.add("instant");
  } else {
    currentStatusText.classList.remove("instant");
    nextStatusText.classList.remove("instant");
  }

  if (additionalClass) {
    nextStatusText.classList.add(additionalClass);
  }

  currentStatusText.classList.remove("current-text");
  currentStatusText.classList.add("previous-text");
  nextStatusText.classList.remove("next-text");
  nextStatusText.classList.add("current-text");

  currentStatusText = nextStatusText;
  nextStatusText = document.createElement("div");
  nextStatusText.className = "status-text-wrapper next-text";
  nextStatusText.innerHTML = '<span class="status-text"></span>';
  statusWheelContainer.appendChild(nextStatusText);

  void removeOldStatusTexts();
}

async function removeOldStatusTexts() {
  await wait(STATUS_WHEEL_TURN_MS);

  const previousTexts = document.querySelectorAll(".previous-text");
  previousTexts.forEach((element) => {
    element.remove();
  });
}

export function lowerBadge(shouldLower, isInstant) {
  const badgeContainer = document.getElementById("badge-container");

  if (isInstant) {
    badgeContainer.classList.add("instant");
  } else {
    badgeContainer.classList.remove("instant");
  }

  if (shouldLower) {
    badgeContainer.classList.add("lowered");
  } else {
    badgeContainer.classList.remove("lowered");
  }
}

export function updateBadgeColor(colorDisplayName) {
  const badgeBase = document.getElementById("badge-base");
  badgeBase.src = `/images/users/badges/${colorDisplayName}.png`;
}

export function updateBadgeText(color, animalDisplayName) {
  const badgeText = document.getElementById("color-animal-text");
  badgeText.innerText = `${color} ${animalDisplayName}`;

  const badgeTextContainer = document.getElementById("badge-text-container");
  badgeTextContainer.classList.add("visible");
}

let currentBadgeIndex = 1;

export function updateBadgeIcon(animalImgPath) {
  const currentIcon = document.getElementById(
    `badge-icon-${currentBadgeIndex}`,
  );
  const nextIndex = currentBadgeIndex === 1 ? 2 : 1;
  const nextIcon = document.getElementById(`badge-icon-${nextIndex}`);

  nextIcon.src = animalImgPath;

  if (currentIcon.classList.contains("visible")) {
    currentIcon.classList.remove("visible");
    nextIcon.classList.add("visible");
  } else {
    nextIcon.classList.add("visible");
  }

  currentBadgeIndex = nextIndex;
}

export function resetBadge() {
  const badgeBase = document.getElementById("badge-base");
  badgeBase.src = "/images/users/badges/gray.png";

  const badgeIcons = document.querySelectorAll(".badge-icon");
  badgeIcons.forEach((icon) => icon.classList.remove("visible"));

  const badgeTextContainer = document.getElementById("badge-text-container");
  badgeTextContainer.classList.remove("visible");
}
