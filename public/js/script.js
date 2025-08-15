// State

let currentRiddleIndex = Math.floor(Math.random() * 5);
let riddlesData = null;
let currentRiddleData = null;
let remainingHints = 7;
let incorrectGuesses = 0;

const correctAnswerBacking = "/images/riddles/ui/answer_backing_correct.png";
const incorrectAnswerBackings = [
  "/images/riddles/ui/answer_backing_wrong_1.png",
  "/images/riddles/ui/answer_backing_wrong_2.png",
  "/images/riddles/ui/answer_backing_wrong_3.png",
];

// const startScreenDiv = document.getElementById("start-screen");
// const startGameButton = document.getElementById("start-new-game-button");

// const createUserButton = document.getElementById("create-user-button");
// const createNewUserDiv = document.getElementById("create-new-user");
// const colorsHeader = document.querySelector(".follows-colors-slider");
// const animalsHeader = document.querySelector(".follows-animals-slider");
// const colorsSlider = document.getElementById("colors-slider");
// const animalsSlider = document.getElementById("animals-slider");

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
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

async function loadRiddles() {
  try {
    const response = await fetch("/js/riddles.json");
    const jsonData = await response.json();
    riddlesData = jsonData.data;
  } catch (error) {
    console.error("Error loading riddles:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadRiddles();
});

//Temporary random badge and animal for demo
window.addEventListener("load", function () {
  const badgeColorOptions = [
    {
      color: "Yellow",
      image: "images/userCreation/badge_yellow.png",
    },
    {
      color: "Blue",
      image: "images/userCreation/badge_blue.png",
    },
    {
      color: "Green",
      image: "images/userCreation/badge_green.png",
    },
    {
      color: "Purple",
      image: "images/userCreation/badge_purple.png",
    },
    {
      color: "Orange",
      image: "images/userCreation/badge_orange.png",
    },
    {
      color: "Pink",
      image: "images/userCreation/badge_pink.png",
    },
  ];
  const randomColorIndex = Math.floor(Math.random() * badgeColorOptions.length);

  const badgeAnimalOptions = [
    {
      animal: "Hummingbird",
      image: "images/userCreation/badge_hummingbird.png",
    },
    {
      animal: "Porcupine",
      image: "images/userCreation/badge_porcupine.png",
    },
    {
      animal: "Armadillo",
      image: "images/userCreation/badge_armadillo.png",
    },
    {
      animal: "Fox",
      image: "images/userCreation/badge_fox.png",
    },
    {
      animal: "Prairie Dog",
      image: "images/userCreation/badge_prairie_dog.png",
    },
  ];
  const randomAnimalIndex = Math.floor(
    Math.random() * badgeAnimalOptions.length
  );

  badgeBase.src = badgeColorOptions[randomColorIndex].image;
  badgeIcon.src = badgeAnimalOptions[randomAnimalIndex].image;

  colorAnimalText.innerText = `${badgeColorOptions[randomColorIndex].color} ${badgeAnimalOptions[randomAnimalIndex].animal}`;
});

// document.addEventListener("DOMContentLoaded", function () {
//   document.querySelectorAll(".hide-on-tap").forEach(function (element) {
//     element.addEventListener("click", function () {
//       makeElementsInvisible.call(this);
//     });
//   });
// });

// function makeElementsInvisible() {
//   this.style.display = "none";
// }

// document.addEventListener("DOMContentLoaded", function () {
//   document.querySelectorAll(".hide-on-empty").forEach(function (element) {
//     element.addEventListener("click", function () {
//       if (
//         this.children.length === 0 ||
//         Array.from(this.children).every(
//           (child) => child.offsetWidth === 0 && child.offsetHeight === 0
//         )
//       ) {
//         this.style.display = "none";
//       }
//     });
//   });
// });

// document.addEventListener("DOMContentLoaded", function () {
//   document.querySelectorAll(".final-page").forEach(function (element) {
//     element.addEventListener("click", function () {
//       document.querySelectorAll(".hide-on-tap").forEach(function (el) {
//         el.style.display = "block";
//       });
//     });
//   });
// });

let movedColors = false;
let movedAnimals = false;
let isAnimating = false;

// document.addEventListener("DOMContentLoaded", function () {
//   document.querySelectorAll(".slide-on-tap").forEach(function (element) {
//     element.addEventListener("click", function (event) {
//       if (isAnimating) return;

//       const screenMidpoint = window.innerWidth / 2;
//       const clickX = event.clientX;

//       let slider = element;
//       let header = slider.id === "colors-slider" ? colorsHeader : animalsHeader;

//       let sliderTranslate = getTranslateX(slider);
//       let headerTranslate = getTranslateX(header);

//       let colorSliderMaxTranslate = -500;
//       let colorSliderMinTranslate = 125;

//       let animalSliderMaxTranslate = -375;
//       let animalSliderMinTranslate = 375;

//       let maxTranslate =
//         slider.id === "colors-slider"
//           ? colorSliderMaxTranslate
//           : animalSliderMaxTranslate;
//       let minTranslate =
//         slider.id === "colors-slider"
//           ? colorSliderMinTranslate
//           : animalSliderMinTranslate;

//       let shouldMove = false;

//       if (clickX > screenMidpoint) {
//         if (sliderTranslate > maxTranslate) {
//           isAnimating = true;
//           shouldMove = true;
//           slider.style.transform = `translateX(${sliderTranslate - 125}px)`;
//           header.style.transform = `translateX(${headerTranslate - 510}px)`;
//         }
//       } else {
//         if (sliderTranslate < minTranslate) {
//           isAnimating = true;
//           shouldMove = true;
//           slider.style.transform = `translateX(${sliderTranslate + 125}px)`;
//           header.style.transform = `translateX(${headerTranslate + 510}px)`;
//         }
//       }

//       if (shouldMove) {
//         setTimeout(() => {
//           isAnimating = false;
//         }, 300);
//       }
//     });
//   });
// });

// document.addEventListener("DOMContentLoaded", function () {
//   if (createUserButton) {
//     createUserButton.addEventListener("click", function () {
//       if (createNewUserDiv) {
//         createNewUserDiv.style.display = "none";
//       }
//     });
//   }
// });

// document.addEventListener("DOMContentLoaded", function () {
//   const unavailableButtons = document.querySelectorAll(
//     "#rejoin-game-button, #use-phone-button"
//   );

//   unavailableButtons.forEach(function (button) {
//     button.addEventListener("click", function () {
//       const message = document.createElement("div");
//       message.textContent = "Unavailable in this hardware-validation build";
//       message.style.position = "fixed";
//       message.style.top = "50%";
//       message.style.left = "50%";
//       message.style.transform = "translate(-50%, -50%)";
//       message.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
//       message.style.color = "white";
//       message.style.padding = "100px";
//       message.style.borderRadius = "50px";
//       message.style.fontSize = "2.5em";
//       message.style.zIndex = "1000";
//       document.body.appendChild(message);

//       setTimeout(() => {
//         document.body.removeChild(message);
//       }, 2000);
//     });
//   });
// });

// document.addEventListener("DOMContentLoaded", function () {
//   if (startGameButton) {
//     startGameButton.addEventListener("click", function () {
//       startScreenDiv.style.display = "none";
//     });
//   }
// });

// document.addEventListener("DOMContentLoaded", function () {
//   if (backToStartButton) {
//     backToStartButton.addEventListener("click", function () {
//       if (startScreenDiv) {
//         startScreenDiv.style.display = "block";
//       }
//     });
//   }
// });

function closeRiddleContainerFromBottom() {
  selectionLayer.style.transform = "translateY(0)";
  riddleContainer.style.transform = "translateY(-1294px)";
  riddleTextLayerBackground.style.transform = "translateY(-1294px)";
}

function showFirstCouplet() {
  selectionLayer.style.transform = "translateY(276px)";
}

function incrementRiddleIndex() {
  currentRiddleIndex++;
  if (currentRiddleIndex >= riddlesData.length) {
    currentRiddleIndex = 0;
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

  const couplets = [couplet1, couplet2, couplet3];
  couplets.forEach((couplet, index) => {
    couplet.children[0].innerText = riddle.couplets[index][0];
    couplet.children[1].innerText = riddle.couplets[index][1];
  });
}

function shuffleAnswerChoices(answerChoices) {
  return [...answerChoices].sort(() => Math.random() - 0.5);
}

function findCorrectAnswerIndex(shuffledChoices) {
  return shuffledChoices.findIndex((choice) => choice.is_correct);
}

function updateSelectionIcons(shuffledChoices) {
  const icons = [iconFront1, iconFront2, iconFront3, iconFront4];
  icons.forEach((icon, index) => {
    icon.src = shuffledChoices[index].image;
  });
}

function updateSelectionTexts(shuffledChoices) {
  const texts = [optionText1, optionText2, optionText3, optionText4];
  texts.forEach((text, index) => {
    text.innerText = shuffledChoices[index].text;
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

function showNewRiddle() {
  resetHints(); // temporary, only for this demo deliverable
  resetIconPositions();

  incrementRiddleIndex();
  closeRiddleContainerFromBottom();
  updateRiddleElements(riddlesData[currentRiddleIndex]);

  setTimeout(() => {
    updateRiddleAnswer(
      currentShuffledChoices[currentCorrectAnswerIndex].text,
      currentRiddle.answerDetails,
      currentRiddle.answerImgPath
    );
    updateStatusWheel(`RIDDLE ${currentRiddleIndex + 1}`);
  }, 1000);

  setTimeout(() => {
    showFirstCouplet();
  }, 2000);
}

document.addEventListener("DOMContentLoaded", function () {
  nextRiddleButton.addEventListener("click", function () {
    showNewRiddle();
  });
});

function decreaseHints() {
  const currentX = getTranslateX(hintCountForeground);
  remainingHints--;
  hintCountForeground.style.transition = "transform 1s ease-in";
  hintCountForeground.style.transform = `translateX(${currentX - 45}px)`;
}

function resetHints() {
  remainingHints = 7;
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

function handleIncorrectGuess(clickedArea, iconIndex) {
  disableAllInput();
  replaceElementToRemoveListeners(clickedArea);

  incorrectGuesses++;
  decreaseHints();
  showIconBacking(iconIndex);

  if (incorrectGuesses >= 3) {
    incorrectGuesses = 0;
    setTimeout(() => {
      riddleTextLayerBackground.style.transition = "transform 1s ease-in";
      riddleTextLayerBackground.style.transform = "translateY(0px)";

      selectionLayer.style.transition = "transform 1s ease-in";
      selectionLayer.style.transform = "translateY(1298px)";

      riddleAnswer.style.display = "flex";
      answerIncorrectText.style.display = "block";
      enableAllInput();
    }, 1500);
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

  incorrectGuesses = 0;
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
}

// document.addEventListener("DOMContentLoaded", function () {
//   clickAreaOption3.addEventListener("click", function () {
//     console.log("Selection icon 3 clicked");

//     if (guess === 2) {
//       const currentY = getTranslateY(selectionLayer);
//       const currentX = getTranslateX(hintCountForeground);
//       selectionLayer.style.transition =
//         "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
//       selectionLayer.style.transform = `translateY(${currentY + 222}px)`;

//       iconFront3.style.transition =
//         "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
//       iconFront3.style.transform = `translateY(${currentY + 234}px)`;

//       hintCountForeground.style.transition = "transform 1s ease-in";
//       hintCountForeground.style.transform = `translateX(${currentX - 45}px)`;

//       guess++;
//     }
//   });
// });

// document.addEventListener("DOMContentLoaded", function () {
//   clickAreaOption2.addEventListener("click", function () {
//     console.log("Selection icon 2 clicked");

//     if (guess === 3) {
//       const currentY = getTranslateY(selectionLayer);

//       iconFront2.style.transition =
//         "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
//       iconFront2.style.transform = `translateY(${currentY + 234}px)`;

//       setTimeout(() => {
//         riddleTextLayerBackground.style.transition = "transform 1s ease-in";
//         riddleTextLayerBackground.style.transform = "translateY(0px)";

//         selectionLayer.style.transition = "transform 1s ease-in";
//         selectionLayer.style.transform = "translateY(1298px)";

//         riddleAnswer.style.display = "block";
//       }, 1500);
//       guess = 1;

//       // Create a temporary overlay button on top of the original
//       const tempButton = document.createElement("button");
//       tempButton.id = "temp-next-riddle-button";
//       tempButton.style.position = "absolute";
//       tempButton.style.left = "351px";
//       tempButton.style.top = "1758px";
//       tempButton.style.width = "382px";
//       tempButton.style.height = "106px";
//       tempButton.style.background = "transparent";
//       tempButton.style.border = "none";
//       tempButton.style.zIndex = "85";
//       tempButton.style.cursor = "pointer";

//       // Add the temporary button to the same parent as the original
//       nextRiddleButton.parentNode.appendChild(tempButton);

//       // Reset everything to start over when temp button is clicked
//       tempButton.addEventListener("click", function () {
//         console.log("Clicked on after riddle solution");
//         document.querySelectorAll(".show-again").forEach(function (element) {
//           element.style.display = "block";
//         });

//         animalsHeader.style.transform = "translateX(0px)";
//         colorsHeader.style.transform = "translateX(0px)";
//         colorsSlider.style.transform = "translateX(0px)";
//         animalsSlider.style.transform = "translateX(0px)";

//         riddleContainer.style.transform = "translateY(0px)";
//         riddleTextLayerBackground.style.transform = "translateY(0px)";
//         selectionLayer.style.transform = "translateY(0px)";
//         riddleAnswer.style.display = "none";
//         iconFront2.style.transform = "translateY(0px)";
//         iconFront3.style.transform = "translateY(0px)";
//         iconFront4.style.transform = "translateY(0px)";
//         hintCountForeground.style.transform = "translateX(0px)";

//         const message = document.createElement("div");
//         message.textContent =
//           "Continuing unavailable in this hardware-validation build, returning to start screen";
//         message.style.position = "fixed";
//         message.style.top = "50%";
//         message.style.left = "50%";
//         message.style.transform = "translate(-50%, -50%)";
//         message.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
//         message.style.color = "white";
//         message.style.padding = "100px";
//         message.style.borderRadius = "50px";
//         message.style.fontSize = "2.5em";
//         message.style.zIndex = "1000";
//         document.body.appendChild(message);

//         setTimeout(() => {
//           document.body.removeChild(message);
//         }, 2000);

//         // Remove the temporary button to restore original functionality
//         tempButton.remove();
//       });
//     }
//   });
// });

//when save-exit-panel is tapped, lower

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
