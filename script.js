const words = [
  { text: "apple", hint: "A common red or green fruit 🍏" },
  { text: "crypto", hint: "A term used in data encryption 🔐" },
  { text: "sun", hint: "Something bright in the sky ☀️" },
  { text: "computer", hint: "An electronic device for processing data 💻" },
  { text: "river", hint: "A flowing natural water body 🌊" },
  { text: "puzzle", hint: "Something that needs solving 🧩" },
  { text: "ocean", hint: "A vast body of salt water 🌊" },
  { text: "forest", hint: "A large area covered with trees 🌲" },
  { text: "friend", hint: "Someone who supports you 🤝" },
  { text: "security", hint: "Protection against threats 🔒" },
  { text: "network", hint: "A system of connected computers 🌐" },
  { text: "cipher", hint: "Used for secret writing 🧠" },
  { text: "internet", hint: "Global connection of computers 🌎" },
  { text: "robot", hint: "A machine that performs tasks 🤖" },
  { text: "matrix", hint: "A grid of numbers or data 🧮" },
  { text: "python", hint: "A popular programming language 🐍" },
  { text: "java", hint: "Write once, run anywhere ☕" },
  { text: "galaxy", hint: "A system of stars in space 🌌" },
  { text: "planet", hint: "Orbits around a star 🪐" },
  { text: "rocket", hint: "Travels beyond the atmosphere 🚀" },
  { text: "music", hint: "Pleasing sounds to the ear 🎵" },
  { text: "flower", hint: "It blooms beautifully 🌸" },
  { text: "secret", hint: "Something hidden or confidential 🤫" },
  { text: "science", hint: "Systematic study of nature 🔬" },
  { text: "hacker", hint: "One who breaks into systems 💻" },
];

let usedIndices = [];
let level = 1;
let questionCount = 0;
let score = 0;
let timeLeft = 180;
let timerInterval;
let currentCipher = "";
let currentWord = "";
let currentHint = "";
let currentAlgo = "";
let hintUsedOnceFree = false;

// Elements
const cipherText = document.getElementById("cipherText");
const feedback = document.getElementById("feedback");
const levelDisplay = document.getElementById("level");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const userInput = document.getElementById("userInput");
const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const skipBtn = document.getElementById("skipBtn");

// Hint + Algorithm labels
const algoElement = document.createElement("p");
algoElement.id = "algorithm";
algoElement.style.color = "#ffeb3b";
algoElement.style.fontWeight = "600";
algoElement.style.marginTop = "6px";
algoElement.style.marginBottom = "10px";

cipherText.insertAdjacentElement("afterend", algoElement);

const hintBtn = document.createElement("button");
hintBtn.textContent = "💡 Show Hint";
hintBtn.style.marginTop = "10px";
hintBtn.style.padding = "8px 15px";
hintBtn.style.background = "#00bcd4";
hintBtn.style.color = "#fff";
hintBtn.style.border = "none";
hintBtn.style.borderRadius = "8px";
hintBtn.style.cursor = "pointer";
hintBtn.style.transition = "all 0.2s ease"; // smooth animation

// 🌟 Hover effect
hintBtn.addEventListener("mouseenter", () => {
  hintBtn.style.color="#00bcd4";
  hintBtn.style.background = "#121212"; // darker cyan-blue
  hintBtn.style.transform = "scale(1.05)";
});

hintBtn.addEventListener("mouseleave", () => {
  hintBtn.style.color="#121212";
  hintBtn.style.background = "#00bcd4"; // original color
  hintBtn.style.transform = "scale(1)";
});

// Hint element
const hintElement = document.createElement("p");
hintElement.id = "hint";
hintElement.style.color = "#00bcd4";
hintElement.style.fontWeight = "500";
hintElement.style.marginTop = "10px";

// Append to container
document.querySelector(".game-container").appendChild(hintBtn);
document.querySelector(".game-container").appendChild(hintElement);

// 💡 Hint button click logic
hintBtn.addEventListener("click", () => {
  hintElement.textContent = `💬 Hint: ${currentHint}`;
  hintBtn.disabled = true;

  if (!hintUsedOnceFree) {
    hintUsedOnceFree = true; // first hint free
  } else {
    score = Math.max(0, score - 5); // -5 for extra hints
  }

  updateUI();
});


function startGame() {
  level = 1;
  score = 0;
  timeLeft = 180;
  questionCount = 0;
  usedIndices = [];
  hintUsedOnceFree = false;
  updateUI();
  startTimer();
  nextQuestion();

  // Hide start button smoothly
  startBtn.style.opacity = "0";
  setTimeout(() => (startBtn.style.display = "none"), 500);

  submitBtn.disabled = false;
  userInput.disabled = false;
  skipBtn.disabled = false;
  feedback.textContent = "";
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(true); // pass a flag meaning time is up
    }
  }, 1000);
}

function getNewWord() {
  let index;
  do {
    index = Math.floor(Math.random() * words.length);
  } while (usedIndices.includes(index));
  usedIndices.push(index);
  return words[index];
}

function encryptWord(word, cipherType) {
  if (cipherType === "caesar") {
    currentAlgo = "Caesar Cipher";
    return word
      .split("")
      .map(ch =>
        ch.match(/[a-z]/i)
          ? String.fromCharCode((ch.toLowerCase().charCodeAt(0) - 97 + 3) % 26 + 97)
          : ch
      )
      .join("");
  } else if (cipherType === "substitution") {
    currentAlgo = "Substitution Cipher";
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const shuffled = alphabet.split("").sort(() => Math.random() - 0.5).join("");
    return word
      .split("")
      .map(ch => (alphabet.includes(ch) ? shuffled[alphabet.indexOf(ch)] : ch))
      .join("");
  } else {
    currentAlgo = "DES Encryption";
    return CryptoJS.DES.encrypt(word, "secretkey123").toString();
  }
}

function nextQuestion() {
  feedback.textContent = "";

  if (level > 3) {
    endGame();
    return;
  }

  if (questionCount === 5) {
    level++;
    questionCount = 0;
    if (level > 3) {
      endGame();
      return;
    }
  }

  const { text, hint } = getNewWord();
  currentWord = text;
  currentHint = hint;
  hintElement.textContent = "";
  hintBtn.disabled = false;

  const pattern = ["caesar", "caesar", "substitution", "des", "des"];
  const cipherType = pattern[questionCount % pattern.length];
  currentCipher = encryptWord(currentWord, cipherType);

  cipherText.textContent = `🔒 Encrypted: ${currentCipher}`;
  algoElement.textContent = `🧠 Algorithm: ${currentAlgo}`;

  userInput.value = "";
  questionCount++;
  updateUI();
}

function checkAnswer() {
  const answer = userInput.value.trim().toLowerCase();
  const gameContainer = document.querySelector(".game-container");

  if (answer === currentWord) {
    score += 10;
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "#4caf50";

    // 🎉 Confetti effect for correct answer
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#00bcd4', '#4caf50', '#ffeb3b']
    });

    userInput.disabled = true;

    // Move to next question after 1.5 seconds
    setTimeout(() => {
      feedback.textContent = "";
      userInput.disabled = false;
      nextQuestion();
    }, 1500);

  } else {
    feedback.textContent = "❌ Try again!";
    feedback.style.color = "#ff5252";

    // ❌ Shake + red flash effect
    gameContainer.classList.add("shake", "flash-red");

    setTimeout(() => {
      gameContainer.classList.remove("shake", "flash-red");
      feedback.textContent = "";
    }, 1000);
  }

  updateUI();
}

function skipQuestion() {
  feedback.textContent = "⏭️ Question Skipped!";
  feedback.style.color = "#ff9800";

  // Small penalty for skipping (optional)
  score = Math.max(0, score - 3);

  // Confetti-like fade animation (optional)
  const gameContainer = document.querySelector(".game-container");
  gameContainer.classList.add("flash-skip");
  setTimeout(() => {
    gameContainer.classList.remove("flash-skip");
  }, 500);

  updateUI();

  // Move to next question after short delay
  setTimeout(() => {
    nextQuestion();
  }, 1000);
}

function updateUI() {
  levelDisplay.textContent = level;
  scoreDisplay.textContent = score;
}

function endGame(timeUp = false) {
  // stop timer safely
  clearInterval(timerInterval);

  cipherText.textContent = timeUp
    ? "⏰ Time’s Up!"
    : "🎮 Game Over!";

  algoElement.textContent = "";
  hintElement.textContent = "";

  feedback.textContent = `🏆 Final Score: ${score}`;
  feedback.style.color = "#ffeb3b";

  submitBtn.disabled = true;
  userInput.disabled = true;
  skipBtn.disabled = true;

  // Show Start button again
  startBtn.style.display = "inline-block";
  startBtn.textContent = "🔁 Restart Game";
  startBtn.disabled = false;
  startBtn.style.opacity = "1";
}

startBtn.addEventListener("click", startGame);
submitBtn.addEventListener("click", checkAnswer);
skipBtn.addEventListener("click", skipQuestion);
