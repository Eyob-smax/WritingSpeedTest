const randomWord = [];
let numberOfWords = [110, 120, 140, 160, 180, 200];
const res = await fetch(
  "https://random-word-api.herokuapp.com/word?number=" +
    numberOfWords[Math.floor(Math.random() * numberOfWords.length)]
);
const data = await res.json();
await data.forEach((element) => randomWord.push(element));

function shuffleArray(array) {
  const copiedArray = structuredClone(array);
  for (let i = copiedArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
  }

  return copiedArray;
}

function generatingText() {
  const shuffleWords = shuffleArray(randomWord);
  return shuffleWords.join(" ");
}

const textContainer = document.querySelector(".text-container");
const timer = document.querySelector(".timer");
const tryAgain = document.querySelector("#try-again");
const finalScore = document.querySelector(".final-score");

// textContainer.textContent = generatingText();

let totalTyped = "";
let currentCharIndex = 0;
let erros = 0;

let timerStarted = false;
let timecount = 60;
let intervalId;
let textValue = generatingText();

const letterArray = textValue.split("");

function timerStart() {
  if (!timerStarted) {
    timerStarted = true;
    intervalId = setInterval(() => {
      timecount--;
      timer.textContent = `Time left: ${timecount}`;
      if (timecount <= 0) {
        clearInterval(intervalId);
        timerEnd();
      }
    }, 1000);
  }
}

function timerEnd() {
  textContainer.style.display = "none";
  timer.textContent = "Time's up!";
  tryAgain.style.display = "block";
  finalScore.textContent = `Final WPM: ${calculateWPM()}`;
}

function calculateWPM() {
  const adjustedErrors = erros / 3;
  const wordsCount = totalTyped.trim().split(/\s+/).length;
  const WPM = Math.round(wordsCount);
  const adjestedWPM = Math.round(Math.max(WPM - adjustedErrors, 0));
  return adjestedWPM;
}

document.addEventListener("keydown", (e) => {
  timerStart();
  if (e.key === "Backspace") {
    if (totalTyped.length > 0) {
      currentCharIndex = Math.max(0, currentCharIndex - 1);
      totalTyped = totalTyped.slice(0, -1);
    }
  } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    totalTyped += e.key;
    currentCharIndex++;
  }

  erros = 0;
  textContainer.textContent = "";
  for (let i = 0; i < letterArray.length; i++) {
    const spanElement = document.createElement("span");
    if (i < totalTyped.length) {
      if (totalTyped[i] === letterArray[i]) {
        spanElement.classList.add("correct");
      } else {
        spanElement.classList.add("incorrect");
        erros++;
      }
    }

    spanElement.textContent = letterArray[i];
    textContainer.appendChild(spanElement);
  }

  if (totalTyped.length >= 20) {
    const scrollAmount = (totalTyped.length - 20) * 14;
    textContainer.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  }
});

tryAgain.addEventListener("click", () => {
  clearInterval(intervalId);
  textContainer.style.display = "block";
  timer.textContent = "Time left: 60s";
  tryAgain.style.display = "none";
  textContainer.textContent = textValue;
  finalScore.textContent = "";

  erros = 0;
  totalTyped = "";
  currentCharIndex = 0;
  timerStarted = false;
  timecount = 60;
  textContainer.scrollLeft = 0;
  textValue = generatingText();
});

function init() {
  if (isMobileDevice()) {
    textContainer.textContent = "This web app is build for desktop use only!";
    textContainer.style.color = "orange";
    return;
  }
  textContainer.textContent = textValue;
  timer.textContent = `Time left: ${timecount}s`;
}

function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 600;
}
init();

document.querySelector(".dark-mode").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  textContainer.style.color = "black";
});
