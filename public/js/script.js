import {
  getRiddle,
  getAverageScore,
  saveRiddleResult,
  saveGame,
} from "./api.js";
import { state, setUser } from "./state.js";
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
import {
  lowerStartScreen,
  returnToStartScreen,
  showUsePhoneScreen,
  hideUsePhoneScreen,
} from "./screens/start.js";
import { updateStatusWheel } from "./user-panel.js";
import { isKiosk } from "./device.js";
import {
  setUpCreateScreen,
  showCreateNewUserScreen,
  showColorPicker,
  selectColor,
  selectAnimal,
  confirmAnimal,
  resetCreateNewUserScreen,
} from "./screens/create.js";
import { showErrorScreenAndReload } from "./errors.js";
import {
  setUpRejoinScreen,
  showRejoinGameScreen,
  rejoinSelectColor,
  selectRejoinAnimal,
  confirmRejoinAnimal,
  resetRejoinScreen,
} from "./screens/rejoin.js";
import { enableAllInput, disableAllInput } from "./input.js";

const correctAnswerBacking = "/images/riddles/ui/answer_backing_correct.png";
const incorrectAnswerBackings = [
  "/images/riddles/ui/answer_backing_wrong_1.png",
  "/images/riddles/ui/answer_backing_wrong_2.png",
  "/images/riddles/ui/answer_backing_wrong_3.png",
];

const riddleScreen = document.getElementById("riddle-screen");
const riddleHeadline = document.getElementById("riddle-headline");
const couplet1 = document.querySelector(".couplet-1");
const couplet2 = document.querySelector(".couplet-2");
const couplet3 = document.querySelector(".couplet-3");

const iconFronts = buildNumberedRiddleElements("icon-front");
const iconBacks = buildNumberedRiddleElements("icon-back");
const optionTexts = buildNumberedRiddleElements("option-text");

const riddleAnswer = document.getElementById("riddle-answer");
const answerCorrectText = document.getElementById("answer-correct-text");
const answerIncorrectText = document.getElementById("answer-incorrect-text");
const answerChoiceText = document.getElementById("answer-choice-text");
const answerDetailsText = document.getElementById("answer-details");
const answerImg = document.getElementById("answer-img");

const hintCountForeground = document.getElementById("hint-count-foreground");

const riddleContainer = document.getElementById("riddle-container");
const riddleTextLayerBackground = document.getElementById("riddle-text");
const selectionLayer = document.getElementById("selection-layer");

const actions = {
  "save-and-exit": () => saveAndExit(),
  "cancel-exit": () => cancelExit(),
  "start-over": () => startOver(),
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
  "return-to-start": () => {
    returnToStartScreen();
    setTimeout(hideUsePhoneScreen, 600);
  },
  "dismiss-inactivity": () => dismissInactivityScreen(),
  "handle-inactivity-sign-out": () => handleInactivitySignOut(),
  "show-color-picker": () => showColorPicker(),
  "confirm-animal": () => confirmAnimal(),
  "transition-to-riddles": () => transitionToRiddleScreen(),
  "show-riddle": () => showRiddle(),
  "rejoin-select-color": (button) =>
    rejoinSelectColor(button.dataset.color, Number(button.dataset.colorId)),
  "confirm-rejoin-animal": () => confirmRejoinAnimal(),
  "select-color": (button) =>
    selectColor(button.dataset.color, Number(button.dataset.colorId)),
  "select-animal": (button) =>
    selectAnimal(button.dataset.animalName, button.dataset.imgPath),
  "select-rejoin-animal": (button) =>
    selectRejoinAnimal(button.dataset.animalName, button.dataset.imgPath),
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
  isKiosk,
  onNoResponse: () => (state.currentUser ? saveAndExit() : startOver()),
});

setUpCreateScreen({
  onUserCreated: (newUser) => setHints(newUser.gameState.hintsRemaining),
});

setUpRejoinScreen({
  onUserRejoined: (existingUser) => {
    setHints(existingUser.gameState.hintsRemaining);
    transitionToRiddleScreen();
  },
});

function buildNumberedRiddleElements(prefix) {
  const riddleElements = [];
  for (let number = 1; number <= 4; number++) {
    const id = `${prefix}-${number}`;
    riddleElements.push(document.getElementById(id));
  }

  return riddleElements;
}

function closeRiddleContainerFromBottom() {
  selectionLayer.style.transform = "translateY(0)";
  riddleContainer.style.transform = "translateY(-1290px)";
  riddleTextLayerBackground.style.transform = "translateY(-1294px)";
}

function showFirstCouplet() {
  selectionLayer.style.transform = "translateY(276px)";
}

function incrementRiddleQueueCursor() {
  state.currentGameState.queueCursor++;
  if (
    state.currentGameState.queueCursor >=
    state.currentGameState.riddleQueue.length
  ) {
    state.currentGameState.queueCursor = 0;
  }

  state.currentGameState.currentShuffledChoices = [];
  state.currentGameState.currentCorrectAnswerIndex = null;
  state.currentGameState.currentGuesses = [];
}

function updateRiddleElements(riddle) {
  updateRiddleContent(riddle);
  const shuffledChoices = shuffleAnswerChoices(riddle.answerChoices);
  const correctAnswerIndex = findCorrectAnswerIndex(shuffledChoices);

  state.currentGameState.currentShuffledChoices = shuffledChoices;
  state.currentGameState.currentCorrectAnswerIndex = correctAnswerIndex;

  updateSelectionIcons(shuffledChoices);
  updateSelectionTexts(shuffledChoices);
  updateIconBackings(correctAnswerIndex);
  attachClickHandlers(correctAnswerIndex);
}

function restoreRiddleState(riddle) {
  updateRiddleContent(riddle);

  const shuffledChoices = state.currentGameState.currentShuffledChoices;
  const correctAnswerIndex = state.currentGameState.currentCorrectAnswerIndex;

  updateSelectionIcons(shuffledChoices);
  updateSelectionTexts(shuffledChoices);
  updateIconBackings(correctAnswerIndex);
  attachClickHandlers(correctAnswerIndex);

  restoreIncorrectGuesses();
  restoreVisibleHints();
}

function restoreIncorrectGuesses() {
  setTimeout(() => {
    state.currentGameState.currentGuesses.forEach((iconIndex) => {
      showIconBacking(iconIndex);
      const clickArea = document.getElementById(
        `option-click-area-${iconIndex + 1}`,
      );
      replaceElementToRemoveListeners(clickArea);
    });
  }, 2000);
}

function restoreVisibleHints() {
  setTimeout(() => {
    const hintOffset =
      Math.min(state.currentGameState.currentGuesses.length, 3) * 222;
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
  iconFronts.forEach((icon, index) => {
    icon.src = shuffledChoices[index].imgPath;
  });
}

function updateSelectionTexts(shuffledChoices) {
  optionTexts.forEach((text, index) => {
    text.innerText = shuffledChoices[index].display;
  });
}

function updateIconBackings(correctAnswerIndex) {
  const shuffledIncorrectBackings = [...incorrectAnswerBackings].sort(
    () => Math.random() - 0.5,
  );
  let incorrectIconIndex = 0;

  iconBacks.forEach((iconBacking, index) => {
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
        handleCorrectGuess(event.currentTarget, index),
      );
    } else {
      newClickable.addEventListener("click", (event) =>
        handleIncorrectGuess(event.currentTarget, index),
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
  iconFronts.forEach((icon) => {
    icon.style.transition = "none";
    icon.style.transform = "translateY(0)";
  });
}

function transitionToRiddleScreen() {
  const startScreen = document.getElementById("start-screen");
  startScreen.style.display = "none";

  const createNewUserScreen = document.getElementById("create-new-user-screen");
  createNewUserScreen.style.display = "none";

  const rejoinUserPanelShadow = document.querySelector(
    "#rejoin-screen .user-panel-shadow",
  );
  rejoinUserPanelShadow.style.display = "none";

  riddleScreen.style.display = "block";

  const nextRiddleSheet = document.getElementById("next-riddle-sheet");
  nextRiddleSheet.style.visibility = "hidden";

  setTimeout(() => {
    void showRiddle();
  }, 50);
}

async function showRiddle() {
  disableAllInput();
  resetIconPositions();
  closeRiddleContainerFromBottom();

  const currentRiddleId =
    state.currentGameState.riddleQueue[state.currentGameState.queueCursor];

  try {
    const currentRiddle = await getRiddle(currentRiddleId);

    const isRejoining =
      state.currentGameState.currentShuffledChoices &&
      state.currentGameState.currentShuffledChoices.length > 0;

    if (isRejoining) {
      restoreRiddleState(currentRiddle);
    } else {
      updateRiddleElements(currentRiddle);
    }

    const correctChoice =
      state.currentGameState.currentShuffledChoices[
        state.currentGameState.currentCorrectAnswerIndex
      ];

    setTimeout(() => {
      updateRiddleAnswer(
        correctChoice.display,
        currentRiddle.answerDetails,
        currentRiddle.answerImgPath,
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
    showErrorScreenAndReload(error);
  }
}

function getCurrentRiddleNumber() {
  const { queueCursor, startingIndex, riddleQueue } = state.currentGameState;
  return (
    ((queueCursor - startingIndex + riddleQueue.length) % riddleQueue.length) +
    1
  );
}

function decreaseHints() {
  const currentX = getTranslateX(hintCountForeground);
  state.currentGameState.hintsRemaining--;
  hintCountForeground.style.transition = "transform 1s ease-in";
  hintCountForeground.style.transform = `translateX(${currentX - 47}px)`;
}

function resetHints() {
  state.currentGameState.hintsRemaining = 7;
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
  const clickedIcon = iconFronts[iconIndex];
  const currentY = getTranslateY(clickedIcon);
  clickedIcon.style.transition =
    "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";

  clickedIcon.style.transform = `translateY(${currentY + 234}px)`;
}

async function updateScoreText() {
  let averageScore = 0;
  try {
    const data = await getAverageScore();
    averageScore = Math.round(data.averageScore);
  } catch (error) {
    console.error("Error fetching average score:", error);
  }

  const scoreTextContainer = document.getElementById("score-text");

  if (state.currentGameState.currentScore == 0) {
    scoreTextContainer.innerHTML = `<span class="small-score-text">You didn't solve any riddles this time.</span>`;
  } else if (state.currentGameState.currentScore == 1) {
    scoreTextContainer.innerHTML = `You solved <span class="red-text">${state.currentGameState.currentScore}</span> riddle!`;
  } else {
    scoreTextContainer.innerHTML = `You solved <span class="red-text">${state.currentGameState.currentScore}</span> riddles!`;
  }

  const scoreComparisonTextContainer = document.getElementById(
    "score-comparison-text",
  );
  if (state.currentGameState.currentScore > averageScore) {
    scoreComparisonTextContainer.innerHTML = `That's ${
      state.currentGameState.currentScore - averageScore
    } more than the average score this week`;
  } else if (state.currentGameState.currentScore < averageScore) {
    scoreComparisonTextContainer.innerHTML = `That's ${
      averageScore - state.currentGameState.currentScore
    } less than the average score this week`;
  } else {
    scoreComparisonTextContainer.innerHTML = `That's the same as the average score this week`;
  }
}

function recordRiddleResult(wasAnsweredCorrectly) {
  const riddleId =
    state.currentGameState.riddleQueue[state.currentGameState.queueCursor];
  const hintsUsed = state.currentGameState.currentGuesses.length;

  saveRiddleResult(riddleId, wasAnsweredCorrectly, hintsUsed).catch((error) =>
    console.error("Error saving riddle analytics:", error),
  );
}

function slideToRevealAnswer() {
  riddleTextLayerBackground.style.transition = "transform 1s ease-in";
  riddleTextLayerBackground.style.transform = "translateY(0px)";

  selectionLayer.style.transition = "transform 1s ease-in";
  selectionLayer.style.transform = "translateY(1298px)";
}

async function handleIncorrectGuess(clickedArea, iconIndex) {
  disableAllInput();
  replaceElementToRemoveListeners(clickedArea);

  state.currentGameState.currentGuesses.push(iconIndex);
  decreaseHints();
  showIconBacking(iconIndex);

  if (
    state.currentGameState.currentGuesses.length >= 3 ||
    state.currentGameState.hintsRemaining <= 0
  ) {
    recordRiddleResult(false);
    state.currentGameState.currentGuesses = [];
    setTimeout(async () => {
      slideToRevealAnswer();

      const gameOver = document.getElementById("game-over");
      const playAgainSheet = document.getElementById("play-again-sheet");
      const nextRiddleSheet = document.getElementById("next-riddle-sheet");

      if (state.currentGameState.hintsRemaining <= 0) {
        state.currentGameState.startingIndex =
          state.currentGameState.queueCursor;
        await updateScoreText();
        updateStatusWheel("GAME OVER", false, "red-text");

        riddleAnswer.style.display = "none";
        gameOver.style.display = "flex";
        playAgainSheet.style.display = "block";
        nextRiddleSheet.style.display = "none";
        resetHints();

        state.currentUser.scores.push(state.currentGameState.currentScore);
        state.currentGameState.currentScore = 0;

        try {
          await saveGame(
            state.currentUser.id,
            state.currentUser.scores,
            state.currentUser.hasViewedExitPanel,
            state.currentGameState,
          );
        } catch (error) {
          console.error("Error saving user data:", error);
          showErrorScreenAndReload(error);
        }
      } else {
        gameOver.style.display = "none";
        riddleAnswer.style.display = "flex";
        answerIncorrectText.style.display = "block";
        playAgainSheet.style.display = "none";
        nextRiddleSheet.style.display = "block";

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

  state.currentGameState.currentScore++;
  recordRiddleResult(true);
  state.currentGameState.currentGuesses = [];
  showIconBacking(iconIndex);

  setTimeout(() => {
    slideToRevealAnswer();

    riddleAnswer.style.display = "flex";
    answerCorrectText.style.display = "block";

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
    hideUsePhoneScreen();
    resetCreateNewUserScreen();
    resetRejoinScreen();
    showExitOption("start-over");
    enableAllInput();
  }, 600);
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
        returnToStartScreen();
        disableAllInput();

        setTimeout(() => {
          hideUsePhoneScreen();
          resetRiddleScreen();
          resetCreateNewUserScreen();
          resetRejoinScreen();
          showExitOption("start-over");
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

async function handleInactivitySignOut() {
  clearInactivityTimers();

  if (state.currentUser && state.currentGameState) {
    await saveAndExit();
  } else {
    startOver();
  }
}
