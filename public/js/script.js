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

const startScreenDiv = document.getElementById("start-screen");
const startGameButton = document.getElementById("start-new-game-button");

const createUserButton = document.getElementById("create-user-button");
const createNewUserDiv = document.getElementById("create-new-user");
const colorsHeader = document.querySelector(".follows-colors-slider");
const animalsHeader = document.querySelector(".follows-animals-slider");
const colorsSlider = document.getElementById("colors-slider");
const animalsSlider = document.getElementById("animals-slider");

const riddleScreen = document.getElementById("riddle-screen");
const riddleHeadline = document.getElementById("riddle-headline");
const couplet1 = document.querySelector(".couplet-1");
const couplet2 = document.querySelector(".couplet-2");
const couplet3 = document.querySelector(".couplet-3");

// Icons
const selectionIcon1 = document.getElementById("selection-icon-1");
const selectionIcon2 = document.getElementById("selection-icon-2");
const selectionIcon3 = document.getElementById("selection-icon-3");
const selectionIcon4 = document.getElementById("selection-icon-4");

// Icon backings
const iconBacking1 = document.getElementById("icon-backing-1");
const iconBacking2 = document.getElementById("icon-backing-2");
const iconBacking3 = document.getElementById("icon-backing-3");
const iconBacking4 = document.getElementById("icon-backing-4");

// Clickables
const selectionIcon1Clickable = document.getElementById(
  "selection-icon-1-clickable"
);
const selectionIcon2Clickable = document.getElementById(
  "selection-icon-2-clickable"
);
const selectionIcon3Clickable = document.getElementById(
  "selection-icon-3-clickable"
);
const selectionIcon4Clickable = document.getElementById(
  "selection-icon-4-clickable"
);

// Texts
const selectionText1 = document.getElementById("selection-text-1");
const selectionText2 = document.getElementById("selection-text-2");
const selectionText3 = document.getElementById("selection-text-3");
const selectionText4 = document.getElementById("selection-text-4");

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
    console.log(
      `Scaling to: ${scale}, viewport: ${window.innerWidth}x${window.innerHeight}`
    );
  }
}

window.addEventListener("resize", scaleContainer);
window.addEventListener("load", scaleContainer);
document.addEventListener("DOMContentLoaded", scaleContainer);

async function loadRiddles() {
  try {
    const response = await fetch("/js/riddles.json");
    const jsonData = await response.json();
    riddlesData = jsonData.data;

    console.log("Riddles loaded:", riddlesData);
    console.log("Number of riddles:", riddlesData.length);
  } catch (error) {
    console.error("Error loading riddles:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadRiddles();
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".hide-on-tap").forEach(function (element) {
    element.addEventListener("click", function () {
      makeElementsInvisible.call(this);
    });
  });
});

function makeElementsInvisible() {
  this.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".hide-on-empty").forEach(function (element) {
    element.addEventListener("click", function () {
      if (
        this.children.length === 0 ||
        Array.from(this.children).every(
          (child) => child.offsetWidth === 0 && child.offsetHeight === 0
        )
      ) {
        this.style.display = "none";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".final-page").forEach(function (element) {
    element.addEventListener("click", function () {
      document.querySelectorAll(".hide-on-tap").forEach(function (el) {
        el.style.display = "block";
      });
    });
  });
});

let movedColors = false;
let movedAnimals = false;
let isAnimating = false;

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".slide-on-tap").forEach(function (element) {
    element.addEventListener("click", function (event) {
      if (isAnimating) return;

      const screenMidpoint = window.innerWidth / 2;
      const clickX = event.clientX;

      let slider = element;
      let header = slider.id === "colors-slider" ? colorsHeader : animalsHeader;

      let sliderTranslate = getTranslateX(slider);
      let headerTranslate = getTranslateX(header);

      let colorSliderMaxTranslate = -500;
      let colorSliderMinTranslate = 125;

      let animalSliderMaxTranslate = -375;
      let animalSliderMinTranslate = 375;

      let maxTranslate =
        slider.id === "colors-slider"
          ? colorSliderMaxTranslate
          : animalSliderMaxTranslate;
      let minTranslate =
        slider.id === "colors-slider"
          ? colorSliderMinTranslate
          : animalSliderMinTranslate;

      let shouldMove = false;

      if (clickX > screenMidpoint) {
        if (sliderTranslate > maxTranslate) {
          isAnimating = true;
          shouldMove = true;
          slider.style.transform = `translateX(${sliderTranslate - 125}px)`;
          header.style.transform = `translateX(${headerTranslate - 510}px)`;
        }
      } else {
        if (sliderTranslate < minTranslate) {
          isAnimating = true;
          shouldMove = true;
          slider.style.transform = `translateX(${sliderTranslate + 125}px)`;
          header.style.transform = `translateX(${headerTranslate + 510}px)`;
        }
      }

      if (shouldMove) {
        setTimeout(() => {
          isAnimating = false;
        }, 300);
      }
    });
  });
});

function getTranslateX(element) {
  const style = window.getComputedStyle(element);
  const matrix = style.transform;

  if (matrix === "none") return 0;

  const values = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");
  const translateX = Math.round(parseFloat(values[4]));
  return translateX;
}

document.addEventListener("DOMContentLoaded", function () {
  if (createUserButton) {
    createUserButton.addEventListener("click", function () {
      if (createNewUserDiv) {
        createNewUserDiv.style.display = "none";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const unavailableButtons = document.querySelectorAll(
    "#rejoin-game-button, #use-phone-button"
  );

  unavailableButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const message = document.createElement("div");
      message.textContent = "Unavailable in this hardware-validation build";
      message.style.position = "fixed";
      message.style.top = "50%";
      message.style.left = "50%";
      message.style.transform = "translate(-50%, -50%)";
      message.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      message.style.color = "white";
      message.style.padding = "100px";
      message.style.borderRadius = "50px";
      message.style.fontSize = "2.5em";
      message.style.zIndex = "1000";
      document.body.appendChild(message);

      setTimeout(() => {
        document.body.removeChild(message);
      }, 2000);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  if (startGameButton) {
    startGameButton.addEventListener("click", function () {
      startScreenDiv.style.display = "none";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (backToStartButton) {
    backToStartButton.addEventListener("click", function () {
      if (startScreenDiv) {
        startScreenDiv.style.display = "block";
      }
    });
  }
});

function closeRiddleContainerFromBottom() {
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
  updateRiddleAnswer(
    shuffledChoices[correctAnswerIndex].text,
    riddle.answerDetails,
    riddle.answerImgPath
  );

  window.currentShuffledChoices = shuffledChoices;
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
  const icons = [
    selectionIcon1,
    selectionIcon2,
    selectionIcon3,
    selectionIcon4,
  ];
  icons.forEach((icon, index) => {
    icon.src = shuffledChoices[index].image;
  });
}

function updateSelectionTexts(shuffledChoices) {
  const texts = [
    selectionText1,
    selectionText2,
    selectionText3,
    selectionText4,
  ];
  texts.forEach((text, index) => {
    text.innerText = shuffledChoices[index].text;
  });
}

function updateIconBackings(correctAnswerIndex) {
  const backings = [iconBacking1, iconBacking2, iconBacking3, iconBacking4];
  let incorrectIconIndex = 0;

  backings.forEach((backing, index) => {
    if (index === correctAnswerIndex) {
      backing.src = correctAnswerBacking;
    } else {
      backing.src = incorrectAnswerBackings[incorrectIconIndex++];
    }
  });
}

function attachClickHandlers(correctAnswerIndex) {
  const clickables = [
    selectionIcon1Clickable,
    selectionIcon2Clickable,
    selectionIcon3Clickable,
    selectionIcon4Clickable,
  ];

  clickables.forEach((clickable, index) => {
    const newClickable = replaceElementToRemoveListeners(clickable);

    if (index === correctAnswerIndex) {
      newClickable.addEventListener("click", () => handleCorrectGuess(index));
    } else {
      newClickable.addEventListener("click", () => handleIncorrectGuess(index));
    }
  });
}

function updateRiddleAnswer(answerChoice, answerDetails, answerImgPath) {
  answerChoiceText.innerText = `${answerChoice}!`;
  answerDetailsText.innerHTML = answerDetails;
  answerImg.src = answerImgPath;
}

function replaceElementToRemoveListeners(element) {
  const newElement = element.cloneNode(true);
  element.parentNode.replaceChild(newElement, element);
  return newElement;
}

function showNewRiddle() {
  incrementRiddleIndex();
  updateRiddleElements(riddlesData[currentRiddleIndex]);
  closeRiddleContainerFromBottom();

  setTimeout(() => {
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

let guess = 1;

function handleIncorrectGuess(iconIndex) {
  remainingHints--;
  incorrectGuesses++;

  const currentY = getTranslateY(selectionLayer);
  const currentX = getTranslateX(hintCountForeground);
  const icons = [
    selectionIcon1,
    selectionIcon2,
    selectionIcon3,
    selectionIcon4,
  ];
  const clickedIcon = icons[iconIndex];

  clickedIcon.style.transition =
    "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
  clickedIcon.style.transform = `translateY(${currentY + 234}px)`;

  if (remainingHints <= 0) {
    console.log("No more hints left");
    //move on to next riddle and update remainingHints to 7
  } else if (incorrectGuesses >= 3) {
    setTimeout(() => {
      riddleTextLayerBackground.style.transition = "transform 1s ease-in";
      riddleTextLayerBackground.style.transform = "translateY(0px)";

      selectionLayer.style.transition = "transform 1s ease-in";
      selectionLayer.style.transform = "translateY(1298px)";

      riddleAnswer.style.display = "flex";
      answerIncorrectText.style.display = "block";
    }, 1500);
    //move on to next riddle
  } else {
    selectionLayer.style.transition =
      "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
    selectionLayer.style.transform = `translateY(${currentY + 222}px)`;

    hintCountForeground.style.transition = "transform 1s ease-in";
    hintCountForeground.style.transform = `translateX(${currentX - 45}px)`;
  }
}

function handleCorrectGuess(iconIndex) {
  const currentY = getTranslateY(selectionLayer);
  const icons = [
    selectionIcon1,
    selectionIcon2,
    selectionIcon3,
    selectionIcon4,
  ];
  const clickedIcon = icons[iconIndex];
  clickedIcon.style.transition =
    "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
  clickedIcon.style.transform = `translateY(${currentY + 234}px)`;

  setTimeout(() => {
    riddleTextLayerBackground.style.transition = "transform 1s ease-in";
    riddleTextLayerBackground.style.transform = "translateY(0px)";

    selectionLayer.style.transition = "transform 1s ease-in";
    selectionLayer.style.transform = "translateY(1298px)";

    riddleAnswer.style.display = "flex";
    answerCorrectText.style.display = "block";
  }, 1500);
}

// document.addEventListener("DOMContentLoaded", function () {
//   selectionIcon3Clickable.addEventListener("click", function () {
//     console.log("Selection icon 3 clicked");

//     if (guess === 2) {
//       const currentY = getTranslateY(selectionLayer);
//       const currentX = getTranslateX(hintCountForeground);
//       selectionLayer.style.transition =
//         "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
//       selectionLayer.style.transform = `translateY(${currentY + 222}px)`;

//       selectionIcon3.style.transition =
//         "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
//       selectionIcon3.style.transform = `translateY(${currentY + 234}px)`;

//       hintCountForeground.style.transition = "transform 1s ease-in";
//       hintCountForeground.style.transform = `translateX(${currentX - 45}px)`;

//       guess++;
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  selectionIcon2Clickable.addEventListener("click", function () {
    console.log("Selection icon 2 clicked");

    if (guess === 3) {
      const currentY = getTranslateY(selectionLayer);

      selectionIcon2.style.transition =
        "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
      selectionIcon2.style.transform = `translateY(${currentY + 234}px)`;

      setTimeout(() => {
        riddleTextLayerBackground.style.transition = "transform 1s ease-in";
        riddleTextLayerBackground.style.transform = "translateY(0px)";

        selectionLayer.style.transition = "transform 1s ease-in";
        selectionLayer.style.transform = "translateY(1298px)";

        riddleAnswer.style.display = "block";
      }, 1500);
      guess = 1;

      // Create a temporary overlay button on top of the original
      const tempButton = document.createElement("button");
      tempButton.id = "temp-next-riddle-button";
      tempButton.style.position = "absolute";
      tempButton.style.left = "351px";
      tempButton.style.top = "1758px";
      tempButton.style.width = "382px";
      tempButton.style.height = "106px";
      tempButton.style.background = "transparent";
      tempButton.style.border = "none";
      tempButton.style.zIndex = "85";
      tempButton.style.cursor = "pointer";

      // Add the temporary button to the same parent as the original
      nextRiddleButton.parentNode.appendChild(tempButton);

      // Reset everything to start over when temp button is clicked
      tempButton.addEventListener("click", function () {
        console.log("Clicked on after riddle solution");
        document.querySelectorAll(".show-again").forEach(function (element) {
          element.style.display = "block";
        });

        animalsHeader.style.transform = "translateX(0px)";
        colorsHeader.style.transform = "translateX(0px)";
        colorsSlider.style.transform = "translateX(0px)";
        animalsSlider.style.transform = "translateX(0px)";

        riddleContainer.style.transform = "translateY(0px)";
        riddleTextLayerBackground.style.transform = "translateY(0px)";
        selectionLayer.style.transform = "translateY(0px)";
        riddleAnswer.style.display = "none";
        selectionIcon2.style.transform = "translateY(0px)";
        selectionIcon3.style.transform = "translateY(0px)";
        selectionIcon4.style.transform = "translateY(0px)";
        hintCountForeground.style.transform = "translateX(0px)";

        const message = document.createElement("div");
        message.textContent =
          "Continuing unavailable in this hardware-validation build, returning to start screen";
        message.style.position = "fixed";
        message.style.top = "50%";
        message.style.left = "50%";
        message.style.transform = "translate(-50%, -50%)";
        message.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        message.style.color = "white";
        message.style.padding = "100px";
        message.style.borderRadius = "50px";
        message.style.fontSize = "2.5em";
        message.style.zIndex = "1000";
        document.body.appendChild(message);

        setTimeout(() => {
          document.body.removeChild(message);
        }, 2000);

        // Remove the temporary button to restore original functionality
        tempButton.remove();
      });
    }
  });
});

//when save-exit-panel is tapped, lower

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
  riddleScreen.appendChild(nextStatusText);
}
