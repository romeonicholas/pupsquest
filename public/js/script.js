const isVisitor =
  new URLSearchParams(window.location.search).get("device") === "visitor";
let currentUser = null;
let currentGameState = null;
let inactivityTimeout;
let inactivityConfirmationTimeout;
const INACTIVITY_THRESHOLD = 25000;
const INACTIVITY_CONFIRMATION_THRESHOLD = 8000;
let isTimerActive = false;

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
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

document.addEventListener("mousemove", startInactivityTimer);
document.addEventListener("keydown", startInactivityTimer);
document.addEventListener("scroll", startInactivityTimer);
document.addEventListener("touchstart", startInactivityTimer);

function startInactivityTimer() {
  if (!isTimerActive || isVisitor) {
    return;
  }
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(showInactivityScreen, INACTIVITY_THRESHOLD);
}

function startInactivityConfirmationTimer() {
  clearTimeout(inactivityConfirmationTimeout);

  inactivityConfirmationTimeout = setTimeout(
    currentUser ? saveAndExit : startOver,
    INACTIVITY_CONFIRMATION_THRESHOLD
  );
}

function showInactivityScreen() {
  const inactivityScreen = document.getElementById("inactivity-screen");
  inactivityScreen.style.opacity = "1";
  inactivityScreen.style.pointerEvents = "auto";
  startInactivityConfirmationTimer();
}

function dismissInactivityScreen() {
  const inactivityScreen = document.getElementById("inactivity-screen");
  inactivityScreen.style.opacity = "0";
  inactivityScreen.style.pointerEvents = "none";
  clearTimeout(inactivityConfirmationTimeout);
  startInactivityTimer();
}

function showErrorScreenAndReload(error) {
  console.error("An error occurred:", error);
  const errorScreen = document.getElementById("error-screen");
  errorScreen.style.display = "block";
  setTimeout(() => {
    window.location.reload();
  }, 6000);
}

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

  currentGameState.currentShuffledChoices = [];
  currentGameState.currentCorrectAnswerIndex = null;
  currentGameState.currentGuesses = [];
}

function updateRiddleElements(riddle) {
  updateRiddleContent(riddle);
  const shuffledChoices = shuffleAnswerChoices(riddle.answerChoices);
  const correctAnswerIndex = findCorrectAnswerIndex(shuffledChoices);

  currentGameState.currentShuffledChoices = shuffledChoices;
  currentGameState.currentCorrectAnswerIndex = correctAnswerIndex;

  updateSelectionIcons(shuffledChoices);
  updateSelectionTexts(shuffledChoices);
  updateIconBackings(correctAnswerIndex);
  attachClickHandlers(correctAnswerIndex);

  currentShuffledChoices = shuffledChoices;
  currentCorrectAnswerIndex = correctAnswerIndex;
  currentRiddle = riddle;
}

function restoreRiddleState(riddle) {
  updateRiddleContent(riddle);

  const shuffledChoices = currentGameState.currentShuffledChoices;
  const correctAnswerIndex = currentGameState.currentCorrectAnswerIndex;

  updateSelectionIcons(shuffledChoices);
  updateSelectionTexts(shuffledChoices);
  updateIconBackings(correctAnswerIndex);
  attachClickHandlers(correctAnswerIndex);

  restoreIncorrectGuesses();
  restoreVisibleHints();

  currentShuffledChoices = shuffledChoices;
  currentCorrectAnswerIndex = correctAnswerIndex;
  currentRiddle = riddle;
}

function restoreIncorrectGuesses() {
  setTimeout(() => {
    currentGameState.currentGuesses.forEach((iconIndex) => {
      showIconBacking(iconIndex);
      const clickArea = document.getElementById(
        `option-click-area-${iconIndex + 1}`
      );
      replaceElementToRemoveListeners(clickArea);
    });
  }, 2000);
}

function restoreVisibleHints() {
  setTimeout(() => {
    const hintOffset =
      Math.min(currentGameState.currentGuesses.length, 3) * 222;
    selectionLayer.style.transform = `translateY(${276 + hintOffset}px)`;
  }, 2000);
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
  answerChoiceText.innerText = `${answerChoice}`;
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

  const riddleScreen = document.getElementById("riddle-screen");
  riddleScreen.style.display = "block";

  const nextRiddleSheet = document.getElementById("next-riddle-sheet");
  nextRiddleSheet.style.visibility = "hidden";

  setTimeout(() => {
    showRiddle();
  }, 50);
}

async function showRiddle() {
  disableAllInput();
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

    const isRejoining =
      currentGameState.currentShuffledChoices &&
      currentGameState.currentShuffledChoices.length > 0;

    if (isRejoining) {
      restoreRiddleState(currentRiddle);
    } else {
      updateRiddleElements(currentRiddle);
    }

    setTimeout(() => {
      updateRiddleAnswer(
        currentShuffledChoices[currentCorrectAnswerIndex].display,
        currentRiddle.answerDetails,
        currentRiddle.answerImgPath
      );
      updateStatusWheel(`RIDDLE ${getCurrentRiddleNumber()}`);
      const nextRiddleSheet = document.getElementById("next-riddle-sheet");
      nextRiddleSheet.style.visibility = "visible";

      const rejoinScreen = document.getElementById("rejoin-screen");
      rejoinScreen.style.display = "none";
    }, 1000);

    setTimeout(() => {
      if (!isRejoining) {
        showFirstCouplet();
      }
      const gameOver = document.getElementById("game-over");
      gameOver.style.display = "none";
      enableAllInput();
    }, 2000);
  } catch (error) {
    console.error("Error fetching riddle:", error);
    enableAllInput();
  }
}

function getCurrentRiddleNumber() {
  const { queueCursor, startingIndex, riddleQueue } = currentGameState;
  return (
    ((queueCursor - startingIndex + riddleQueue.length) % riddleQueue.length) +
    1
  );
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

function setHints(hints) {
  hintCountForeground.style.transform = `translateX(${-(7 - hints) * 47}px)`;
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

function disableRiddleInput() {
  const riddleScreen = document.getElementById("riddle-screen");
  if (riddleScreen) {
    riddleScreen.style.pointerEvents = "none";
  }
}

function enableAllInput() {
  const container = document.getElementById("container");
  if (container) {
    container.style.pointerEvents = "auto";
  }
}

async function updateScoreText() {
  let averageScore = 0;
  try {
    const response = await fetch("/api/stats/average-score");
    const data = await response.json();
    averageScore = Math.round(data.averageScore);
  } catch (error) {
    console.error("Error fetching average score:", error);
  }

  const scoreTextContainer = document.getElementById("score-text");

  if (currentGameState.currentScore == 0) {
    scoreTextContainer.innerHTML = `<span class="small-score-text">You didn't solve any riddles this time.</span>`;
  } else if (currentGameState.currentScore == 1) {
    scoreTextContainer.innerHTML = `You solved <span class="red-text">${currentGameState.currentScore}</span> riddle!`;
  } else {
    scoreTextContainer.innerHTML = `You solved <span class="red-text">${currentGameState.currentScore}</span> riddles!`;
  }

  const scoreComparisonTextContainer = document.getElementById(
    "score-comparison-text"
  );
  if (currentGameState.currentScore > averageScore) {
    scoreComparisonTextContainer.innerHTML = `That's ${
      currentGameState.currentScore - averageScore
    } more than the average score this week`;
  } else if (currentGameState.currentScore < averageScore) {
    scoreComparisonTextContainer.innerHTML = `That's ${
      averageScore - currentGameState.currentScore
    } less than the average score this week`;
  } else {
    scoreComparisonTextContainer.innerHTML = `That's the same as the average score this week`;
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
        await updateScoreText();
        updateStatusWheel("GAME OVER", false, "red-text");

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

        const answerChoiceText = document.getElementById("answer-choice-text");
        answerChoiceText.innerText = `${answerChoiceText.innerText}.`;
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

    const answerChoiceText = document.getElementById("answer-choice-text");
    answerChoiceText.innerText = `${answerChoiceText.innerText}!`;

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
  const nextStatusText = document.querySelector(".next-text");
  const spanElement = nextStatusText.querySelector(".status-text");

  if (spanElement) {
    spanElement.innerText = nextText;
  } else {
    console.error("Could not find .status-text inside nextStatusText");
  }
  nextStatusText.firstChild.innerText = nextText;
}

function updateStatusWheel(wheelText, instant = false, additionalClass) {
  updateNextStatusText(wheelText);
  let currentStatusText = document.querySelector(".current-text");
  let nextStatusText = document.querySelector(".next-text");

  if (instant) {
    currentStatusText.style.transition = "none";
    nextStatusText.style.transition = "none";
  } else {
    currentStatusText.style.transition = "transform 800ms ease-in";
    nextStatusText.style.transition = "transform 800ms ease-in";
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

  removeOldStatusTexts();
}

function removeOldStatusTexts() {
  setTimeout(() => {
    const previousTexts = document.querySelectorAll(".previous-text");
    previousTexts.forEach((element) => {
      element.remove();
    });
  }, 1000);
}

function setStartOverButtonToActive() {
  const startOverPanel = document.getElementById("start-over-panel");
  startOverPanel.classList.add("visible");
  const saveExitPanel = document.getElementById("save-exit-panel");
  saveExitPanel.classList.remove("visible");

  const startOverButton = document.getElementById("start-over-button");
  startOverButton.style.display = "block";
  const saveExitButton = document.getElementById("save-exit-button");
  saveExitButton.style.display = "none";
}

function setSaveAndExitButtonToActive() {
  const startOverPanel = document.getElementById("start-over-panel");
  startOverPanel.classList.remove("visible");
  const saveExitPanel = document.getElementById("save-exit-panel");
  saveExitPanel.classList.add("visible");

  const startOverButton = document.getElementById("start-over-button");
  startOverButton.style.display = "none";
  const saveExitButton = document.getElementById("save-exit-button");
  saveExitButton.style.display = "block";
}

function lowerStartScreen() {
  const startScreen = document.getElementById("start-screen");
  startScreen.style.transition = "transform 1800ms ease-in";
  startScreen.style.transform = "translateY(1920px)";
}

function returnToStartScreen() {
  clearTimeout(inactivityTimeout);
  isTimerActive = false;
  const startScreen = document.getElementById("start-screen");
  startScreen.style.display = "block";

  startScreen.style.transition = "none";
  startScreen.style.transform = "translateY(0)";
  startScreen.style.opacity = "0";

  startScreen.offsetHeight;

  setTimeout(() => {
    startScreen.style.transition = "opacity 500ms ease-in";
    startScreen.style.opacity = "1";

    const inactivityScreen = document.getElementById("inactivity-screen");
    inactivityScreen.style.opacity = "0";
    inactivityScreen.style.pointerEvents = "none";
  }, 10);
}

function showRejoinGameScreen() {
  isTimerActive = true;
  startInactivityTimer();

  document.getElementById("rejoin-screen").style.display = "block";
  document.getElementById("user-panel").style.display = "block";
  document.getElementById("exit-container").style.display = "block";

  resetBadge();
  const badgeContainer = document.getElementById("badge-container");
  badgeContainer.style.transition = "none";
  badgeContainer.style.transform = "translateY(465px)";
  let isInstant = true;
  updateStatusWheel("ENTER CODE", isInstant);
  setStartOverButtonToActive();
}

function showUsePhoneScreen() {
  isTimerActive = true;
  startInactivityTimer();

  document.getElementById("rejoin-screen").style.display = "none";
  document.getElementById("user-panel").style.display = "none";
  document.getElementById("exit-container").style.display = "none";
  document.getElementById("use-phone-screen").style.display = "block";
}

function showCreateNewUserScreen() {
  isTimerActive = true;
  startInactivityTimer();

  const createNewUserScreen = document.getElementById("create-new-user-screen");
  createNewUserScreen.style.display = "block";

  const userPanel = document.getElementById("user-panel");
  userPanel.style.display = "block";

  let isInstant = true;
  updateStatusWheel("WELCOME", isInstant);

  const exitContainer = document.getElementById("exit-container");
  exitContainer.style.display = "block";

  const riddleScreenConfirmationDummy = document.getElementById(
    "riddle-screen-confirmation-dummy"
  );
  riddleScreenConfirmationDummy.style.display = "block";

  setStartOverButtonToActive();
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
    updateStatusWheel("CODE NAME");
    const badgeContainer = document.getElementById("badge-container");
    badgeContainer.style.transition = "transform 800ms ease-in";
    badgeContainer.style.transform = "translateY(465px)";
  }, 800);
}

function clearColorSelectionIndicators(prefix = "") {
  const prefixStr = prefix ? `${prefix}-` : "";
  document
    .getElementById(`${prefixStr}red-selected`)
    .classList.remove("selected");
  document
    .getElementById(`${prefixStr}yellow-selected`)
    .classList.remove("selected");
  document
    .getElementById(`${prefixStr}green-selected`)
    .classList.remove("selected");
  document
    .getElementById(`${prefixStr}blue-selected`)
    .classList.remove("selected");
}

function showColorSelectionIndicator(colorDisplayName, prefix = "") {
  const prefixStr = prefix ? `${prefix}-` : "";

  const selectedColorIcon = document.getElementById(
    `${prefixStr}${colorDisplayName}-selected`
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

    const noAnimalsMessage = document.querySelector(".no-animals-message.new");
    noAnimalsMessage.style.transition = "opacity 300ms ease-out";
    noAnimalsMessage.style.opacity = "0";

    setTimeout(async () => {
      const response = await fetch(
        `/api/animals/available/html?colorId=${colorId}&limit=8`
      );
      const html = await response.text();

      animalOptionsContainer.innerHTML = html;
      animalOptionsContainer.offsetHeight;
      animalOptionsContainer.style.transition = "opacity 300ms ease-in";
      animalOptionsContainer.style.opacity = "1";

      const animalsExist =
        animalOptionsContainer.querySelectorAll(".animal-option").length > 0;
      if (!animalsExist) {
        noAnimalsMessage.style.transition = "opacity 300ms ease-in";
        noAnimalsMessage.style.opacity = "1";
      }
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

function clearAnimalSelectionIndicators(prefix = "") {
  const selector = prefix
    ? `.${prefix}-animal-selection-icon`
    : `.animal-selection-icon`;

  document.querySelectorAll(selector).forEach((el) => {
    el.classList.remove("selected");
  });
}

function updateAnimalSelection(animalDisplayName, prefix = "") {
  clearAnimalSelectionIndicators(prefix);
  const prefixStr = prefix ? `${prefix}-` : "";

  const animalSelectionIndicator = document.getElementById(
    `${prefixStr}${animalDisplayName.toLowerCase()}-selected`
  );

  animalSelectionIndicator?.classList.add("selected");
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

function getSelectedColor(prefix = "") {
  const prefixStr = prefix ? `${prefix}-` : "";
  const selectedColorIcon = document.querySelector(
    `.${prefixStr}color-selection-icon.selected`
  );
  const color = selectedColorIcon
    ? selectedColorIcon.getAttribute("data-color")
    : "unknown";

  return color;
}

function getSelectedColorId(prefix = "") {
  const prefixStr = prefix ? `${prefix}-` : "";
  const selector = prefix
    ? `.${prefixStr}color-selection-icon.selected`
    : `.color-selection-icon.selected`;

  const selectedColorIcon = document.querySelector(selector);

  const colorId = selectedColorIcon
    ? selectedColorIcon.getAttribute("data-id")
    : null;

  return colorId;
}

function updateBadgeText(color, animalDisplayName) {
  const badgeText = document.getElementById("color-animal-text");
  badgeText.innerText = `${color} ${animalDisplayName}`;

  const badgeTextContainer = document.getElementById("badge-text-container");
  badgeTextContainer.classList.add("visible");
}

function selectAnimal(animalDisplayName, animalImgPath) {
  updateAnimalSelection(animalDisplayName);
  updateBadgeIcon(animalImgPath);
  const color = getSelectedColor();
  updateBadgeText(color, animalDisplayName);

  const confirmationPanel = document.getElementById("confirmation-panel");
  confirmationPanel.style.transition = "transform 300ms ease-in";
  confirmationPanel.style.transform = "translateY(-165px)";
}

function getSelectedAnimalId(prefix = "") {
  const prefixStr = prefix ? `${prefix}-` : "";
  const selector = prefix
    ? `.${prefixStr}animal-selection-icon.selected`
    : `.animal-selection-icon.selected`;

  const selectedAnimalIcon = document.querySelector(selector);
  return selectedAnimalIcon?.getAttribute("data-animal") || null;
}

async function confirmAnimal() {
  const confirmationPanel = document.getElementById("confirmation-panel");
  confirmationPanel.style.transition = "transform 1200ms ease-in";
  confirmationPanel.style.transform = "translateY(-1470px)";

  user = await createUser();
  setUser(user);

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
    showErrorScreenAndReload(error);
    return null;
  }
}

function resetCreateNewUserScreen() {
  const createNewUserScreen = document.getElementById("create-new-user-screen");
  createNewUserScreen.style.display = "none";

  resetBadge();
  clearColorSelectionIndicators();
  clearAnimalSelectionIndicators();

  const noAnimalsMessage = document.querySelector(".no-animals-message.new");
  noAnimalsMessage.style.opacity = "0";

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
}

async function rejoinSelectColor(colorDisplayName, colorId) {
  const rejoinColorPickerInstructions = document.getElementById(
    "rejoin-color-picker-instructions"
  );
  rejoinColorPickerInstructions.innerText = "Now select your animal";

  resetBadge();
  clearColorSelectionIndicators("rejoin");
  showColorSelectionIndicator(colorDisplayName, "rejoin");
  updateBadgeColor(colorDisplayName);

  const rejoinConfirmationPanel = document.getElementById(
    "rejoin-confirmation-panel"
  );
  rejoinConfirmationPanel.style.transform = "translateY(0px)";

  await updateRejoinAnimalContainer(
    colorId,
    "rejoin-animal-options-container",
    "/api/animals/existing/html"
  );
}

async function updateRejoinAnimalContainer(colorId) {
  try {
    const animalOptionsContainer = document.getElementById(
      "rejoin-animal-options-container"
    );
    animalOptionsContainer.style.transition = "opacity 300ms ease-out";
    animalOptionsContainer.style.opacity = "0";

    const noAnimalsMessage = document.querySelector(
      ".no-animals-message.rejoin"
    );
    noAnimalsMessage.style.transition = "opacity 300ms ease-out";
    noAnimalsMessage.style.opacity = "0";

    setTimeout(async () => {
      const response = await fetch(
        `/api/animals/existing/html/?colorId=${colorId}`
      );
      const html = await response.text();

      animalOptionsContainer.innerHTML = html;
      animalOptionsContainer.offsetHeight;
      animalOptionsContainer.style.transition = "opacity 300ms ease-in";
      animalOptionsContainer.style.opacity = "1";

      const animalsExist =
        animalOptionsContainer.querySelectorAll(".animal-option").length > 0;
      if (!animalsExist) {
        noAnimalsMessage.style.transition = "opacity 300ms ease-in";
        noAnimalsMessage.style.opacity = "1";
      }

      const scrollableContainer = document.getElementById(
        "scrollable-container"
      );
      scrollableContainer.scrollTop = 0;
    }, 200);
  } catch (error) {
    console.error("Error updating animal container:", error);
    animalOptionsContainer.style.opacity = "1";
  }
}

function selectRejoinAnimal(animalDisplayName, animalImgPath) {
  updateAnimalSelection(animalDisplayName, "rejoin");
  updateBadgeIcon(animalImgPath);
  const color = getSelectedColor("rejoin");
  updateBadgeText(color, animalDisplayName);

  const confirmationPanel = document.getElementById(
    "rejoin-confirmation-panel"
  );
  confirmationPanel.style.transition = "transform 300ms ease-in";
  confirmationPanel.style.transform = "translateY(-165px)";
}

async function confirmRejoinAnimal() {
  const rejoinConfirmationPanel = document.getElementById(
    "rejoin-confirmation-panel"
  );
  rejoinConfirmationPanel.style.transitionDelay = "50ms";
  rejoinConfirmationPanel.style.transition = "transform 1s ease-in";
  rejoinConfirmationPanel.style.transform = "translateY(-1200px)";

  user = await loginUser();
  setUser(user);

  setSaveAndExitButtonToActive();

  const riddleScreenConfirmationDummy = document.getElementById(
    "riddle-screen-confirmation-dummy"
  );
  riddleScreenConfirmationDummy.style.display = "none";

  transitionToRiddleScreen();
}

async function loginUser() {
  try {
    const selectedColorId = getSelectedColorId("rejoin");
    const selectedAnimalId = getSelectedAnimalId("rejoin");

    if (!selectedColorId || !selectedAnimalId) {
      throw new Error("Please select both a color and an animal.");
    }

    const response = await fetch(
      `/api/users/?colorId=${selectedColorId}&animalId=${selectedAnimalId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error logging in user:", error);
    showErrorScreenAndReload(error);
    return null;
  }
}

function resetRejoinScreen() {
  const rejoinScreen = document.getElementById("rejoin-screen");
  rejoinScreen.style.display = "none";

  resetBadge();
  clearColorSelectionIndicators("rejoin");
  clearAnimalSelectionIndicators("rejoin");

  const rejoinColorPickerInstructions = document.getElementById(
    "rejoin-color-picker-instructions"
  );
  rejoinColorPickerInstructions.innerText =
    "To rejoin your game, select your badge color.";

  const noAnimalsMessage = document.querySelector(".no-animals-message.rejoin");
  noAnimalsMessage.style.opacity = "0";

  const rejoinAnimalOptionsContainer = document.getElementById(
    "rejoin-animal-options-container"
  );
  rejoinAnimalOptionsContainer.innerHTML = "";

  const rejoinConfirmationPanel = document.getElementById(
    "rejoin-confirmation-panel"
  );

  rejoinConfirmationPanel.style.transitionDelay = "0ms";
  rejoinConfirmationPanel.style.transform = "translateY(0px)";

  const statusTextCurrent = document.querySelector(".current-text");
  statusTextCurrent.firstChild.innerText = "ENTER CODE";
}

function resetRiddleScreen() {
  riddleScreen.style.display = "none";
  riddleTextLayerBackground.style.transform = "translateY(0px)";
  selectionLayer.style.transform = "translateY(0px)";
  riddleContainer.style.transform = "translateY(0px)";
  riddleAnswer.style.display = "none";

  const gameOver = document.getElementById("game-over");
  gameOver.style.display = "none";
  const playAgainSheet = document.getElementById("play-again-sheet");
  playAgainSheet.style.display = "none";
  const nextRiddleSheet = document.getElementById("next-riddle-sheet");
  nextRiddleSheet.style.display = "block";
}

function startOver() {
  returnToStartScreen();
  disableAllInput();

  setTimeout(() => {
    document.getElementById("use-phone-screen").style.display = "none";
    resetCreateNewUserScreen();
    resetRejoinScreen();
    setStartOverButtonToActive();
    enableAllInput();
  }, 600);
}

async function markExitPanelViewed() {
  currentUser.hasViewedExitPanel = true;

  if (currentUser && !currentUser.hasViewedExitPanel) {
    try {
      await fetch(`/api/users/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hasViewedExitPanel: true,
        }),
      });
    } catch (error) {
      console.error("Failed to update exit panel viewed status:", error);
      currentUser.hasViewedExitPanel = false;
    }
  }
}

function shouldShowExitPanelDetails() {
  return currentUser && !currentUser.hasViewedExitPanel;
}

function firstTimeSaveAndExit() {
  const userPanel = document.getElementById("user-panel");
  const riddleScreen = document.getElementById("riddle-screen");
  const createNewUserScreen = document.getElementById("create-new-user-screen");

  userPanel.style.transition = "transform 800ms ease-in";
  userPanel.style.transform = "translateY(380px)";
  riddleScreen.style.transition = "transform 800ms ease-in";
  riddleScreen.style.transform = "translateY(380px)";
  createNewUserScreen.style.transition = "transform 800ms ease-in";
  createNewUserScreen.style.transform = "translateY(380px)";

  const cancelButton = document.getElementById("cancel-button");
  const signOutButton = document.getElementById("sign-out-button");
  cancelButton.style.display = "block";
  signOutButton.style.display = "block";

  markExitPanelViewed();
}

function cancelExit() {
  const userPanel = document.getElementById("user-panel");
  const riddleScreen = document.getElementById("riddle-screen");
  const createNewUserScreen = document.getElementById("create-new-user-screen");

  userPanel.style.transition = "transform 800ms ease-in";
  userPanel.style.transform = "translateY(0px)";
  riddleScreen.style.transition = "transform 800ms ease-in";
  riddleScreen.style.transform = "translateY(0px)";
  createNewUserScreen.style.transition = "transform 800ms ease-in";
  createNewUserScreen.style.transform = "translateY(0px)";

  const cancelButton = document.getElementById("cancel-button");
  cancelButton.style.display = "none";
  const signOutButton = document.getElementById("sign-out-button");
  signOutButton.style.display = "none";
}

function hideExitDetails() {
  const userPanel = document.getElementById("user-panel");
  const riddleScreen = document.getElementById("riddle-screen");
  const createNewUserScreen = document.getElementById("create-new-user-screen");

  setTimeout(() => {
    userPanel.style.transition = "none";
    userPanel.style.transform = "translateY(0px)";
    riddleScreen.style.transition = "none";
    riddleScreen.style.transform = "translateY(0px)";
    createNewUserScreen.style.transition = "none";
    createNewUserScreen.style.transform = "translateY(0px)";

    const cancelButton = document.getElementById("cancel-button");
    cancelButton.style.display = "none";
    const signOutButton = document.getElementById("sign-out-button");
    signOutButton.style.display = "none";
  }, 500);
}

async function saveAndExit() {
  clearTimeout(inactivityTimeout);
  clearTimeout(inactivityConfirmationTimeout);
  const inactivityScreen = document.getElementById("inactivity-screen");
  const isInactivityScreenVisible =
    inactivityScreen.style.opacity === "1" &&
    inactivityScreen.style.pointerEvents === "auto";

  if (shouldShowExitPanelDetails() && !isInactivityScreenVisible) {
    // I don't want to show the exit panel if they're inactive and not there anyway
    firstTimeSaveAndExit();
  } else {
    if (currentUser && currentGameState) {
      try {
        const response = await fetch(`/api/users/${currentUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameState: currentGameState,
            scores: currentUser.scores,
            hasViewedExitPanel: currentUser.hasViewedExitPanel,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to save user data: ${response.status}`);
        }

        const data = await response.json();
        setUser(null);

        returnToStartScreen();
        disableAllInput();

        setTimeout(() => {
          document.getElementById("use-phone-screen").style.display = "none";
          resetRiddleScreen();
          resetCreateNewUserScreen();
          resetRejoinScreen();
          setStartOverButtonToActive();
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

function handleInactivitySignOut() {
  clearTimeout(inactivityTimeout);
  clearTimeout(inactivityConfirmationTimeout);

  if (currentUser && currentGameState) {
    saveAndExit();
  } else {
    startOver();
  }
}

function setUser(user) {
  if (!user) {
    currentUser = null;
    currentGameState = null;
    return;
  }

  currentUser = user;
  currentGameState = currentUser.gameState;
  setHints(currentGameState.hintsRemaining);
}
