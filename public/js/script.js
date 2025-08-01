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

let colorsHeader = document.querySelector(".follows-colors-slider");
let animalsHeader = document.querySelector(".follows-animals-slider");

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
  const createUserButton = document.getElementById("create-user-button");
  if (createUserButton) {
    createUserButton.addEventListener("click", function () {
      const createNewUserDiv = document.getElementById("create-new-user");
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
  const startGameButton = document.getElementById("start-new-game-button");
  if (startGameButton) {
    startGameButton.addEventListener("click", function () {
      const createNewUserDiv = document.getElementById("start-screen");

      createNewUserDiv.style.display = "none";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const backToStartButton = document.getElementById("back-to-start-button");
  if (backToStartButton) {
    backToStartButton.addEventListener("click", function () {
      const startScreenDiv = document.getElementById("start-screen");
      if (startScreenDiv) {
        startScreenDiv.style.display = "block";
      }
    });
  }
});

const nextRiddleButton = document.getElementById("next-riddle-button");
const riddleContainer = document.getElementById("riddle-container");
const riddleTextLayer = document.getElementById("riddle-text-layer");
const statusWheel = document.getElementById("status-wheel");
const selectionLayer = document.getElementById("selection-layer");

document.addEventListener("DOMContentLoaded", function () {
  nextRiddleButton.addEventListener("click", function () {
    riddleContainer.style.transform = "translateY(-1294px)";
    riddleTextLayer.style.transform = "translateY(-1294px)";
    setTimeout(() => {
      statusWheel.style.transform = "rotate(36deg)";
    }, 1000);
    setTimeout(() => {
      selectionLayer.style.transform = "translateY(276px)";
    }, 2000);
  });
});

let guess = 1;

document.addEventListener("DOMContentLoaded", function () {
  const selectionIcon4 = document.getElementById("selection-icon-4");
  const selectionIcon4Clickable = document.getElementById(
    "selection-icon-4-clickable"
  );

  const hintCountForeground = document.getElementById("hint-count-foreground");

  selectionIcon4Clickable.addEventListener("click", function () {
    console.log("Selection icon 4 clicked");

    if (guess === 1) {
      const currentY = getTranslateY(selectionLayer);
      const currentX = getTranslateX(hintCountForeground);
      selectionLayer.style.transition =
        "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
      selectionLayer.style.transform = `translateY(${currentY + 222}px)`;

      selectionIcon4.style.transition =
        "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
      selectionIcon4.style.transform = `translateY(${currentY + 234}px)`;

      hintCountForeground.style.transition = "transform 1s ease-in";
      hintCountForeground.style.transform = `translateX(${currentX - 45}px)`;

      guess++;
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const selectionIcon3 = document.getElementById("selection-icon-3");
  const selectionIcon3Clickable = document.getElementById(
    "selection-icon-3-clickable"
  );

  const hintCountForeground = document.getElementById("hint-count-foreground");

  selectionIcon3Clickable.addEventListener("click", function () {
    console.log("Selection icon 3 clicked");

    if (guess === 2) {
      const currentY = getTranslateY(selectionLayer);
      const currentX = getTranslateX(hintCountForeground);
      selectionLayer.style.transition =
        "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
      selectionLayer.style.transform = `translateY(${currentY + 222}px)`;

      selectionIcon3.style.transition =
        "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
      selectionIcon3.style.transform = `translateY(${currentY + 234}px)`;

      hintCountForeground.style.transition = "transform 1s ease-in";
      hintCountForeground.style.transform = `translateX(${currentX - 45}px)`;

      guess++;
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const selectionIcon2 = document.getElementById("selection-icon-2");
  const selectionIcon2Clickable = document.getElementById(
    "selection-icon-2-clickable"
  );
  const riddleSolution = document.getElementById("riddle-solution");

  const hintCountForeground = document.getElementById("hint-count-foreground");

  selectionIcon2Clickable.addEventListener("click", function () {
    console.log("Selection icon 2 clicked");

    if (guess === 3) {
      const currentY = getTranslateY(selectionLayer);
      const currentX = getTranslateX(hintCountForeground);
      //   selectionLayer.style.transition =
      //     "transform 1s cubic-bezier(0.36, 0, 0.66, -0.56)";
      //   selectionLayer.style.transform = `translateY(${currentY + 222}px)`;

      selectionIcon2.style.transition =
        "transform 1s cubic-bezier(0.54, -0.16, 0.735, 0.045)";
      selectionIcon2.style.transform = `translateY(${currentY + 234}px)`;

      setTimeout(() => {
        riddleTextLayer.style.transition = "transform 1s ease-in";
        riddleTextLayer.style.transform = "translateY(0px)";

        selectionLayer.style.transition = "transform 1s ease-in";
        selectionLayer.style.transform = "translateY(1298px)";

        riddleSolution.style.display = "block";
      }, 1500);
      guess = 1;

      const nextRiddleButton = document.getElementById("next-riddle-button");

      const newNextRiddleButton = nextRiddleButton.cloneNode(true);
      nextRiddleButton.parentNode.replaceChild(
        newNextRiddleButton,
        nextRiddleButton
      );

      newNextRiddleButton.addEventListener("click", function () {
        console.log("Clicked on after riddle solution");
        document.querySelectorAll(".show-again").forEach(function (element) {
          element.style.display = "block";
        });

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
      });
    }
  });
});


function getTranslateY(element) {
  const style = window.getComputedStyle(element);
  const matrix = style.transform;

  if (matrix === "none") return 0;

  const values = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");
  const translateY = Math.round(parseFloat(values[5]));
  return translateY;
}
