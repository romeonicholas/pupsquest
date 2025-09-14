let currentUser = null;
let currentGameState = null;

const correctAnswerBacking = "/images/riddles/ui/answer_backing_correct.png";
const incorrectAnswerBackings = [
  "/images/riddles/ui/answer_backing_wrong_1.png",
  "/images/riddles/ui/answer_backing_wrong_2.png",
  "/images/riddles/ui/answer_backing_wrong_3.png",
];

const badgeBase = document.getElementById("badge-base");
const badgeIcon = document.getElementById("badge-icon");
const colorAnimalText = document.getElementById("color-animal-text");

const riddleScreen = document.getElementById("riddle-screen");
const statusWheelContainer = document.getElementById("status-wheel-container");
const riddleHeadline = document.getElementById("riddle-headline");
const couplet1 = document.querySelector(".couplet-1");
const couplet2 = document.querySelector(".couplet-2");
const couplet3 = document.querySelector(".couplet-3");

const iconFront1 = document.getElementById("icon-front-1");
const iconFront2 = document.getElementById("icon-front-2");
const iconFront3 = document.getElementById("icon-front-3");
const iconFront4 = document.getElementById("icon-front-4");

const iconBack1 = document.getElementById("icon-back-1");
const iconBack2 = document.getElementById("icon-back-2");
const iconBack3 = document.getElementById("icon-back-3");
const iconBack4 = document.getElementById("icon-back-4");

const clickAreaOption1 = document.getElementById("option-click-area-1");
const clickAreaOption2 = document.getElementById("option-click-area-2");
const clickAreaOption3 = document.getElementById("option-click-area-3");
const clickAreaOption4 = document.getElementById("option-click-area-4");

const optionText1 = document.getElementById("option-text-1");
const optionText2 = document.getElementById("option-text-2");
const optionText3 = document.getElementById("option-text-3");
const optionText4 = document.getElementById("option-text-4");

const riddleAnswer = document.getElementById("riddle-answer");
const answerCorrectText = document.getElementById("answer-correct-text");
const answerIncorrectText = document.getElementById("answer-incorrect-text");
const answerChoiceText = document.getElementById("answer-choice-text");
const answerDetailsText = document.getElementById("answer-details");
const answerImg = document.getElementById("answer-img");

const hintCountForeground = document.getElementById("hint-count-foreground");

const backToStartButton = document.getElementById("back-to-start-button");

const nextRiddleButton = document.getElementById("next-riddle-button");
const riddleContainer = document.getElementById("riddle-container");
const riddleTextLayerBackground = document.getElementById("riddle-text");
let currentStatusText = document.getElementById("status-text-current");
let nextStatusText = document.getElementById("status-text-next");
const selectionLayer = document.getElementById("selection-layer");

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
// document.addEventListener("contextmenu", function (e) {
//   e.preventDefault();
// });

function closeRiddleContainerFromBottom() {
  selectionLayer.style.transform = "translateY(0)";
  riddleContainer.style.transform = "translateY(-1294px)";
  riddleTextLayerBackground.style.transform = "translateY(-1294px)";
}

function showFirstCouplet() {
  selectionLayer.style.transform = "translateY(276px)";
}

function incrementRiddleQueueCursor() {
  currentGameState.queueCursor++;
  if (currentGameState.queueCursor >= currentGameState.riddleQueue.length) {
    currentGameState.queueCursor = 0;
  }
}

function updateRiddleElements(riddle) {
  updateRiddleContent(riddle);
  const shuffledChoices = shuffleAnswerChoices(riddle.answerChoices);
  const correctAnswerIndex = findCorrectAnswerIndex(shuffledChoices);

  updateSelectionIcons(shuffledChoices);
  updateSelectionTexts(shuffledChoices);
  updateIconBackings(correctAnswerIndex);
  attachClickHandlers(correctAnswerIndex);

  currentShuffledChoices = shuffledChoices;
  currentCorrectAnswerIndex = correctAnswerIndex;
  currentRiddle = riddle;
}

function updateRiddleContent(riddle) {
  riddleHeadline.children[0].innerText = riddle.headline;

  couplet1.children[0].innerText = riddle.body[0];
  couplet1.children[1].innerText = riddle.body[1];
  couplet2.children[0].innerText = riddle.body[2];
  couplet2.children[1].innerText = riddle.body[3];
  couplet3.children[0].innerText = riddle.body[4];
  couplet3.children[1].innerText = riddle.body[5];
}

function shuffleAnswerChoices(answerChoices) {
  return [...answerChoices].sort(() => Math.random() - 0.5);
}

function findCorrectAnswerIndex(shuffledChoices) {
  return shuffledChoices.findIndex((choice) => choice.slotIndex === 0);
}

function updateSelectionIcons(shuffledChoices) {
  const icons = [iconFront1, iconFront2, iconFront3, iconFront4];
  icons.forEach((icon, index) => {
    icon.src = shuffledChoices[index].imgPath;
  });
}

function updateSelectionTexts(shuffledChoices) {
  const texts = [optionText1, optionText2, optionText3, optionText4];
  texts.forEach((text, index) => {
    text.innerText = shuffledChoices[index].display;
  });
}

function updateIconBackings(correctAnswerIndex) {
  const iconBackings = [iconBack1, iconBack2, iconBack3, iconBack4];

  const shuffledIncorrectBackings = [...incorrectAnswerBackings].sort(
    () => Math.random() - 0.5
  );
  let incorrectIconIndex = 0;

  iconBackings.forEach((iconBacking, index) => {
    if (index === correctAnswerIndex) {
      iconBacking.src = correctAnswerBacking;
    } else {
      iconBacking.src = shuffledIncorrectBackings[incorrectIconIndex++];
    }
  });
}

function attachClickHandlers(correctAnswerIndex) {
  const clickables = [
    document.getElementById("option-click-area-1"),
    document.getElementById("option-click-area-2"),
    document.getElementById("option-click-area-3"),
    document.getElementById("option-click-area-4"),
  ];

  clickables.forEach((clickable, index) => {
    if (!clickable) {
      console.warn(`Clickable element at index ${index} not found`);
      return;
    }

    const newClickable = replaceElementToRemoveListeners(clickable);

    if (index === correctAnswerIndex) {
      newClickable.addEventListener("click", (event) =>
        handleCorrectGuess(event.currentTarget, index)
      );
    } else {
      newClickable.addEventListener("click", (event) =>
        handleIncorrectGuess(event.currentTarget, index)
      );
    }
  });
}

function updateRiddleAnswer(answerChoice, answerDetails, answerImgPath) {
  answerChoiceText.innerText = `${answerChoice}!`;
  answerDetailsText.innerHTML = answerDetails;
  answerImg.src = answerImgPath;
  answerCorrectText.style.display = "none";
  answerIncorrectText.style.display = "none";
}

function replaceElementToRemoveListeners(element) {
  if (!element || !element.parentNode) {
    console.error("Element or parent node is null:", element);
    return null;
  }

  const newElement = element.cloneNode(true);
  element.replaceWith(newElement);
  return newElement;
}

function resetIconPositions() {
  const icons = [iconFront1, iconFront2, iconFront3, iconFront4];
  icons.forEach((icon) => {
    icon.style.transition = "none";
    icon.style.transform = "translateY(0)";
  });
}

function transitionToRiddleScreen() {
  const startScreen = document.getElementById("start-screen");
  startScreen.style.display = "none";

  const createNewUserScreen = document.getElementById("create-new-user-screen");
  createNewUserScreen.style.display = "none";

  const nextRiddleSheet = document.getElementById("next-riddle-sheet");
  nextRiddleSheet.style.visibility = "hidden";

  showNewRiddle();
}

async function showNewRiddle() {
  resetIconPositions();
  closeRiddleContainerFromBottom();

  const currentRiddleId =
    currentGameState.riddleQueue[currentGameState.queueCursor];

  try {
    const response = await fetch(`/api/riddles/${currentRiddleId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch riddle: ${response.status}`);
    }

    const currentRiddle = await response.json();
    updateRiddleElements(currentRiddle);

    setTimeout(() => {
      updateRiddleAnswer(
        currentShuffledChoices[currentCorrectAnswerIndex].display,
        currentRiddle.answerDetails,
        currentRiddle.answerImgPath
      );
      updateStatusWheel(
        `RIDDLE ${
          currentGameState.queueCursor + 1 - currentGameState.startingIndex
        }`
      );
      const nextRiddleSheet = document.getElementById("next-riddle-sheet");
      nextRiddleSheet.style.visibility = "visible";
    }, 1000);

    setTimeout(() => {
      showFirstCouplet();
      const gameOver = document.getElementById("game-over");
      gameOver.style.display = "none";
    }, 2000);
  } catch (error) {
    console.error("Error fetching riddle:", error);
  }
}

function decreaseHints() {
  const currentX = getTranslateX(hintCountForeground);
  currentGameState.hintsRemaining--;
  hintCountForeground.style.transition = "transform 1s ease-in";
  hintCountForeground.style.transform = `translateX(${currentX - 47}px)`;
}

function resetHints() {
  currentGameState.hintsRemaining = 7;
  hintCountForeground.style.transition = "transform 1s ease-in";
  hintCountForeground.style.transform = "translateX(0)";
}

function showNextHint() {
  const currentY = getTranslateY(selectionLayer);
  selectionLayer.style.transition =
    "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
  selectionLayer.style.transform = `translateY(${currentY + 222}px)`;
}

function showIconBacking(iconIndex) {
  const icons = [iconFront1, iconFront2, iconFront3, iconFront4];
  const clickedIcon = icons[iconIndex];
  const currentY = getTranslateY(clickedIcon);

  clickedIcon.style.transition =
    "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
  clickedIcon.style.transform = `translateY(${currentY + 234}px)`;
}

function disableAllInput() {
  const container = document.getElementById("container");
  if (container) {
    container.style.pointerEvents = "none";
  }
}

function enableAllInput() {
  const container = document.getElementById("container");
  if (container) {
    container.style.pointerEvents = "auto";
  }
}

function updateScoreText() {
  const scoreText = document.getElementById("score-text");
  if (currentGameState.currentScore == 1) {
    scoreText.innerText = `You solved ${currentGameState.currentScore} riddle!`;
  } else {
    scoreText.innerText = `You solved ${currentGameState.currentScore} riddles!`;
  }
}

async function handleIncorrectGuess(clickedArea, iconIndex) {
  disableAllInput();
  replaceElementToRemoveListeners(clickedArea);

  currentGameState.currentGuesses.push(iconIndex);
  decreaseHints();
  showIconBacking(iconIndex);

  if (
    currentGameState.currentGuesses.length >= 3 ||
    currentGameState.hintsRemaining <= 0
  ) {
    currentGameState.currentGuesses = [];
    setTimeout(async () => {
      riddleTextLayerBackground.style.transition = "transform 1s ease-in";
      riddleTextLayerBackground.style.transform = "translateY(0px)";

      selectionLayer.style.transition = "transform 1s ease-in";
      selectionLayer.style.transform = "translateY(1298px)";

      const gameOver = document.getElementById("game-over");
      const playAgainSheet = document.getElementById("play-again-sheet");
      const nextRiddleSheet = document.getElementById("next-riddle-sheet");

      if (currentGameState.hintsRemaining <= 0) {
        currentGameState.startingIndex = currentGameState.queueCursor;
        updateScoreText();
        riddleAnswer.style.display = "none";
        gameOver.style.display = "flex";
        playAgainSheet.style.display = "block";
        nextRiddleSheet.style.display = "none";
        resetHints();

        currentUser.scores.push(currentGameState.currentScore);
        currentGameState.currentScore = 0;

        try {
          const response = await fetch(`/api/users/${currentUser.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              gameState: currentGameState,
              scores: currentUser.scores,
            }),
          });
        } catch (error) {
          console.error("Error updating user:", error);
        }
      } else {
        gameOver.style.display = "none";
        riddleAnswer.style.display = "flex";
        answerIncorrectText.style.display = "block";
        playAgainSheet.style.display = "none";
        nextRiddleSheet.style.display = "block";
      }
      enableAllInput();
    }, 1500);

    incrementRiddleQueueCursor();
  } else {
    showNextHint();
    setTimeout(() => {
      enableAllInput();
    }, 1000);
  }
}

function handleCorrectGuess(clickedArea, iconIndex) {
  disableAllInput();
  replaceElementToRemoveListeners(clickedArea);

  currentGameState.currentScore++;
  currentGameState.currentGuesses = [];
  showIconBacking(iconIndex);

  setTimeout(() => {
    riddleTextLayerBackground.style.transition = "transform 1s ease-in";
    riddleTextLayerBackground.style.transform = "translateY(0px)";

    selectionLayer.style.transition = "transform 1s ease-in";
    selectionLayer.style.transform = "translateY(1298px)";

    riddleAnswer.style.display = "flex";
    answerCorrectText.style.display = "block";

    enableAllInput();
  }, 1500);

  incrementRiddleQueueCursor();
}

function getTranslateX(element) {
  const style = window.getComputedStyle(element);
  const matrix = style.transform;

  if (matrix === "none") return 0;

  const values = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");
  const translateX = Math.round(parseFloat(values[4]));
  return translateX;
}

function getTranslateY(element) {
  const style = window.getComputedStyle(element);
  const matrix = style.transform;

  if (matrix === "none") return 0;

  const values = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");
  const translateY = Math.round(parseFloat(values[5]));
  return translateY;
}

function updateNextStatusText(nextText) {
  const spanElement = nextStatusText.querySelector(".status-text");
  if (spanElement) {
    spanElement.innerText = nextText;
  } else {
    console.error("Could not find .status-text inside nextStatusText");
  }
  nextStatusText.firstChild.innerText = nextText;
}

function updateStatusWheel(wheelText) {
  updateNextStatusText(wheelText);
  currentStatusText.classList.remove("current-text");
  currentStatusText.classList.add("previous-text");
  nextStatusText.classList.remove("next-text");
  nextStatusText.classList.add("current-text");

  currentStatusText = nextStatusText;
  nextStatusText = document.createElement("div");
  nextStatusText.id = "status-text-next";
  nextStatusText.className = "status-text-wrapper next-text";
  nextStatusText.innerHTML = '<span class="status-text"></span>';
  statusWheelContainer.appendChild(nextStatusText);
}

function setExitButtonToActive() {
  const exitButton = document.getElementById("exit-button");
  exitButton.style.display = "block";

  const saveExitButton = document.getElementById("save-exit-button");
  saveExitButton.style.display = "none";
}

function setSaveAndExitButtonToActive() {
  const saveExitButton = document.getElementById("save-exit-button");
  saveExitButton.style.display = "block";

  const exitButton = document.getElementById("exit-button");
  exitButton.style.display = "none";
}

function lowerStartScreen() {
  const startScreen = document.getElementById("start-screen");
  startScreen.style.transition = "transform 1800ms ease-in";
  startScreen.style.transform = "translateY(1920px)";
}

function raiseStartScreen() {
  const startScreen = document.getElementById("start-screen");
  startScreen.style.transition = "transform 1800ms ease-in";
  startScreen.style.transform = "translateY(0)";
}

function showRejoinGameScreen() {
  document.getElementById("use-phone-screen").style.display = "none";
  document.getElementById("rejoin-screen").style.display = "block";
  document.getElementById("user-panel").style.display = "block";
  document.getElementById("exit-container").style.display = "block";
  resetBadge();
  const badgeContainer = document.getElementById("badge-container");
  badgeContainer.style.transform = "translateY(465px)";
  updateStatusWheel("ENTER CODE");
}

function showUsePhoneScreen() {
  document.getElementById("rejoin-screen").style.display = "none";
  document.getElementById("user-panel").style.display = "none";
  document.getElementById("exit-container").style.display = "none";
  document.getElementById("use-phone-screen").style.display = "block";
}

// Create new user

function showCreateNewUserScreen() {
  const createNewUserScreen = document.getElementById("create-new-user-screen");
  createNewUserScreen.style.display = "block";

  const userPanel = document.getElementById("user-panel");
  userPanel.style.display = "block";

  const exitContainer = document.getElementById("exit-container");
  exitContainer.style.display = "block";
}

function showColorPicker() {
  const userCreationInstructions = document.getElementById(
    "user-creation-instructions"
  );
  const colorPicker = document.getElementById("color-picker");

  userCreationInstructions.style.transition = "transform 800ms ease-in";
  userCreationInstructions.style.transform = "translateY(1270px)";
  colorPicker.style.transition = "transform 800ms ease-in";
  colorPicker.style.transform = "translateY(1337px)";

  setTimeout(() => {
    const statusTextCurrent = document.getElementById("status-text-current");
    const statusTextNext = document.getElementById("status-text-next");
    statusTextCurrent.style.transition = "transform 800ms ease-in";
    statusTextNext.style.transition = "transform 800ms ease-in";

    updateStatusWheel("CODE NAME");
    const badgeContainer = document.getElementById("badge-container");
    badgeContainer.style.transition = "transform 800ms ease-in";
    badgeContainer.style.transform = "translateY(465px)";
  }, 800);
}

function clearColorSelectionIndicators() {
  document.getElementById("red-selected").classList.remove("selected");
  document.getElementById("yellow-selected").classList.remove("selected");
  document.getElementById("green-selected").classList.remove("selected");
  document.getElementById("blue-selected").classList.remove("selected");
}

function showColorSelectionIndicator(colorDisplayName) {
  const selectedColorIcon = document.getElementById(
    `${colorDisplayName}-selected`
  );
  selectedColorIcon.classList.add("selected");
}

function updateBadgeColor(colorDisplayName) {
  const badgeBase = document.getElementById("badge-base");
  badgeBase.src = `images/userCreation/badge_${colorDisplayName}.png`;
}

async function updateAnimalContainer(colorId) {
  try {
    const animalOptionsContainer = document.getElementById(
      "animal-options-container"
    );
    animalOptionsContainer.style.transition = "opacity 300ms ease-out";
    animalOptionsContainer.style.opacity = "0";

    setTimeout(async () => {
      const response = await fetch(
        `/api/animals/available/html?colorId=${colorId}&limit=8`
      );
      const html = await response.text();

      animalOptionsContainer.innerHTML = html;

      animalOptionsContainer.style.transition = "opacity 300ms ease-in";
      animalOptionsContainer.style.opacity = "1";
    }, 200);
  } catch (error) {
    console.error("Error updating animal container:", error);
    animalOptionsContainer.style.opacity = "1";
  }
}

function resetBadge() {
  const badgeBase = document.getElementById("badge-base");
  badgeBase.src = "images/userCreation/badge_gray.png";

  const badgeIcons = document.querySelectorAll(".badge-icon");
  badgeIcons.forEach((icon) => icon.classList.remove("visible"));

  const badgeTextContainer = document.getElementById("badge-text-container");
  badgeTextContainer.classList.remove("visible");
}

function hideConfirmationPanel() {
  const confirmationPanel = document.getElementById("confirmation-panel");
  confirmationPanel.style.transition = "transform 300ms ease-in";
  confirmationPanel.style.transform = "translateY(0px)";
}

async function selectColor(colorDisplayName, colorId) {
  const userCreationInstructions = document.getElementById(
    "user-creation-instructions"
  );
  resetBadge();
  hideConfirmationPanel();
  clearColorSelectionIndicators();
  showColorSelectionIndicator(colorDisplayName);
  updateBadgeColor(colorDisplayName);
  await updateAnimalContainer(colorId);

  if (userCreationInstructions.style.transform !== "translateY(2210px)") {
    userCreationInstructions.style.transition = "transform 800ms ease-in";
    userCreationInstructions.style.transform = "translateY(2210px)";
  }
}

async function fetchAvailableAnimalsForColor(colorId) {
  const response = await fetch(
    `/api/animals/available/html?colorId=${colorId}&limit=8`
  );
  const html = await response.text();
  return html;
}

function clearAnimalSelectionIndicators() {
  document.querySelectorAll(".animal-selection-icon").forEach((el) => {
    el.classList.remove("selected");
  });
}

function updateAnimalSelection(animalDisplayName) {
  clearAnimalSelectionIndicators();

  const animalSelectionIndicator = document.getElementById(
    `${animalDisplayName.toLowerCase()}-selected`
  );
  animalSelectionIndicator.classList.add("selected");
}

let currentBadgeIndex = 1;

function updateBadgeIcon(animalImgPath) {
  const currentIcon = document.getElementById(
    `badge-icon-${currentBadgeIndex}`
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

function getSelectedColor() {
  const selectedColorIcon = document.querySelector(
    ".color-selection-icon.selected"
  );
  const color = selectedColorIcon
    ? selectedColorIcon.getAttribute("data-color")
    : "unknown";

  return color;
}

function getSelectedColorId() {
  const selectedColorIcon = document.querySelector(
    ".color-selection-icon.selected"
  );
  const colorId = selectedColorIcon
    ? selectedColorIcon.getAttribute("data-id")
    : null;

  return colorId;
}

function updateBadgeText(animalDisplayName) {
  const color = getSelectedColor();

  const badgeText = document.getElementById("color-animal-text");
  badgeText.innerText = `${color} ${animalDisplayName}`;

  const badgeTextContainer = document.getElementById("badge-text-container");
  badgeTextContainer.classList.add("visible");
}

function selectAnimal(animalDisplayName, animalId, animalImgPath) {
  updateAnimalSelection(animalDisplayName);
  updateBadgeIcon(animalImgPath);
  updateBadgeText(animalDisplayName);

  const confirmationPanel = document.getElementById("confirmation-panel");
  confirmationPanel.style.transition = "transform 300ms ease-in";
  confirmationPanel.style.transform = "translateY(-165px)";
}

function getSelectedAnimalId() {
  const selectedAnimalIcon = document.querySelector(
    ".animal-selection-icon.selected"
  );
  const animal = selectedAnimalIcon
    ? selectedAnimalIcon.getAttribute("data-animal")
    : "unknown";

  return animal;
}

async function confirmAnimal() {
  const confirmationPanel = document.getElementById("confirmation-panel");
  confirmationPanel.style.transition = "transform 1200ms ease-in";
  confirmationPanel.style.transform = "translateY(-1470px)";

  currentUser = await createUser();
  currentGameState = currentUser.gameState;

  const riddleScreen = document.getElementById("riddle-screen");
  riddleScreen.style.display = "block";

  setSaveAndExitButtonToActive();
}

async function createUser() {
  try {
    const selectedColorId = getSelectedColorId();
    const selectedAnimalId = getSelectedAnimalId();

    if (!selectedColorId || !selectedAnimalId) {
      throw new Error("Please select both a color and an animal.");
    }

    const userData = {
      colorId: parseInt(selectedColorId),
      animalId: parseInt(selectedAnimalId),
    };

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const newUser = await response.json();

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);

    alert(`Failed to create user: ${error.message}`);

    return null;
  }
}

function resetCreateNewUserScreen() {
  setTimeout(() => {
    const createNewUserScreen = document.getElementById(
      "create-new-user-screen"
    );
    createNewUserScreen.style.display = "none";

    resetBadge();
    clearColorSelectionIndicators();
    clearAnimalSelectionIndicators();

    const userCreationInstructions = document.getElementById(
      "user-creation-instructions"
    );
    const colorPicker = document.getElementById("color-picker");
    const badgeContainer = document.getElementById("badge-container");
    const confirmationPanel = document.getElementById("confirmation-panel");

    userCreationInstructions.style.transform = "translateY(0px)";
    colorPicker.style.transform = "translateY(0px)";
    badgeContainer.style.transform = "translateY(0px)";
    confirmationPanel.style.transform = "translateY(0px)";

    const statusTextCurrent = document.querySelector(".current-text");
    statusTextCurrent.firstChild.innerText = "WELCOME";
  }, 1800);
}

async function rejoinSelectColor(colorDisplayName, colorId) {
  const rejoinColorPickerInstructions = document.getElementById(
    "rejoin-color-picker-instructions"
  );
  rejoinColorPickerInstructions.innerText = "Now select your animal";

  resetBadge();
  clearRejoinColorSelectionIndicators();
  showRejoinColorSelectionIndicator(colorDisplayName);
  updateBadgeColor(colorDisplayName);
  // await updateAnimalContainer(colorId);
}

function showRejoinColorSelectionIndicator(colorDisplayName) {
  const selectedColorIcon = document.getElementById(
    `rejoin-${colorDisplayName}-selected`
  );
  selectedColorIcon.classList.add("selected");
}

function clearRejoinColorSelectionIndicators() {
  document.getElementById("rejoin-red-selected").classList.remove("selected");
  document
    .getElementById("rejoin-yellow-selected")
    .classList.remove("selected");
  document.getElementById("rejoin-green-selected").classList.remove("selected");
  document.getElementById("rejoin-blue-selected").classList.remove("selected");
}

function resetRiddleScreen() {
  riddleScreen.style.display = "none";
  riddleTextLayerBackground.style.transform = "translateY(0px)";
  selectionLayer.style.transform = "translateY(0px)";
  riddleContainer.style.transform = "translateY(0px)";
  riddleAnswer.style.display = "none";

  const gameOver = document.getElementById("game-over");
  gameOver.style.display = "none";
}

function showStartScreen() {
  const startScreen = document.getElementById("start-screen");
  startScreen.style.display = "block";
  startScreen.style.transition = "transform 0ms ease-in";
  startScreen.style.transform = "translateY(0px)";
}

function exit() {
  raiseStartScreen();
  resetCreateNewUserScreen();
  setExitButtonToActive();
}

async function saveAndExit() {
  if (currentUser && currentGameState) {
    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameState: currentGameState,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save user data: ${response.status}`);
      }

      const data = await response.json();
      currentUser = null;

      resetRiddleScreen();
      resetCreateNewUserScreen();
      showStartScreen();
      setExitButtonToActive();
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Failed to save user data. Please try again.");
    }
  } else {
    alert("No user is currently logged in.");
  }
}
