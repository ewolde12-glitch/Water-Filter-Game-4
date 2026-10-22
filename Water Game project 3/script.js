
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const streakElement = document.getElementById("streak");
const messageElement = document.getElementById("message");
const rewardElement = document.getElementById("reward");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const progressBar = document.getElementById("progress-bar");
const dropButtons = document.querySelectorAll(".drop");
const resetButton = document.getElementById("reset-button");

// Game state variables
let score = 0;
let lives = 3;
let streak = 0;
let gameOver = false;
let round = 0;

const winningScore = 100;

// Arrays store groups of possible game messages
const cleanMessages = [
  "Wonderful! You collected clean water!",
  "Great job! Every drop counts!",
  "Amazing! You are helping a community!",
  "Fantastic! Keep your clean water streak going!"
];

const dirtyMessages = [
  "Oh no! That water is dirty. You lost a life!",
  "Careful! Dirty water is dangerous!",
  "Try again! Choose clean water next time!"
];

// Start or restart the game
function resetGame() {
  score = 0;
  lives = 3;
  streak = 0;
  gameOver = false;
  round = 0;

  dropButtons.forEach(button => {
    button.disabled = false;
    button.textContent = "💧";
    button.style.backgroundColor = "";
  });

  messageElement.textContent =
    "Pick a drop to start your clean water journey.";

  rewardElement.textContent = "";

  updateScreen();
}

// Update the page whenever the game state changes
function updateScreen() {
  scoreElement.textContent = score;
  livesElement.textContent =
    "❤️ ".repeat(lives) + "🤍 ".repeat(3 - lives);
  streakElement.textContent = streak;

  progressText.textContent = `${score} / ${winningScore}`;

  const progress = Math.min(
    (score / winningScore) * 100,
    100
  );

  progressFill.style.width = `${progress}%`;
  progressBar.setAttribute("aria-valuenow", progress);
}

// Pick a random message from an array
function randomMessage(messages) {
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
}

// Randomly assign clean water or dirty water
function createRound() {
  const waterTypes = ["clean", "clean", "dirty"];
  const shuffledWater = [...waterTypes];

  // Randomly shuffle the possible water types
  for (let i = shuffledWater.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffledWater[i], shuffledWater[j]] =
      [shuffledWater[j], shuffledWater[i]];
  }

  dropButtons.forEach((button, index) => {
    button.disabled = false;
    button.textContent = "💧";
    button.style.backgroundColor = "";
    button.dataset.type = shuffledWater[index];
  });
}

// Handle a player's choice
function chooseDrop(event) {
  if (gameOver) {
    return;
  }

  const button = event.currentTarget;
  const type = button.dataset.type;

  // Prevent the player from choosing the same drop twice
  if (button.disabled) {
    return;
  }

  button.disabled = true;
  round++;

  if (type === "clean") {
    streak++;

    // Earn bonus points for a streak of 3 or more
    if (streak >= 3) {
      score += 20;
      messageElement.textContent =
        "Amazing streak! You earned 20 points!";
      rewardElement.textContent = "⭐ Streak bonus!";
    } else {
      score += 10;
      messageElement.textContent = randomMessage(cleanMessages);
      rewardElement.textContent = "+10 clean water points!";
    }

    button.textContent = "💧";
    button.style.backgroundColor = "#c7f4dc";

  } else if (type === "dirty") {
    lives--;
    streak = 0;

    messageElement.textContent = randomMessage(dirtyMessages);
    rewardElement.textContent = "Your streak has reset.";

    button.textContent = "☣️";
    button.style.backgroundColor = "#ffe0d6";
  }

  updateScreen();

  // Check whether the player has won or lost
  if (score >= winningScore) {
    gameOver = true;
    messageElement.textContent =
      "🎉 You win! You reached the clean water goal!";
    rewardElement.textContent =
      "🏆 Clean Water Champion! Great work!";
    celebrate();
    disableDrops();

  } else if (lives <= 0) {
    gameOver = true;
    messageElement.textContent =
      "Game over! You can try again and help more communities.";
    rewardElement.textContent = `Final score: ${score}`;
    disableDrops();

  } else if ([...dropButtons].every(drop => drop.disabled)) {
    // Start another round after all 3 drops are chosen
    createRound();
  }
}

// Disable all drops when the game ends
function disableDrops() {
  dropButtons.forEach(button => {
    button.disabled = true;
  });
}

// Simple winning celebration
function celebrate() {
  document.querySelector(".game-area").classList.add("winner");
}

// Connect the buttons to their functions
dropButtons.forEach(button => {
  button.addEventListener("click", chooseDrop);
});

resetButton.addEventListener("click", () => {
  document.querySelector(".game-area").classList.remove("winner");
  resetGame();
});

// Initialize the game
resetGame();
createRound();
