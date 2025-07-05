const choices = ["rock", "paper", "scissors"];
let playerScore = 0;
let computerScore = 0;
let playerStats = { wins: 0, losses: 0, draws: 0 };

const playerScoreDisplay = document.getElementById("player-score");
const computerScoreDisplay = document.getElementById("computer-score");
const resultText = document.getElementById("result-text");
const choicesButtons = document.querySelectorAll(".choice");
const resetButton = document.getElementById("reset");
const logoutButton = document.getElementById("logout");
const playerNameInput = document.getElementById("player-name");
const registerButton = document.getElementById("register-btn");
const loginSection = document.getElementById("login-section");
const welcomeText = document.getElementById("welcome-text");
const playerDisplayName = document.getElementById("player-display-name");
const statsBoard = document.getElementById("stats-board");
const winsDisplay = document.getElementById("wins");
const lossesDisplay = document.getElementById("losses");
const drawsDisplay = document.getElementById("draws");
const winRateDisplay = document.getElementById("win-rate");

choicesButtons.forEach(button => {
    button.addEventListener("click", () => playGame(button.id));
});

resetButton.addEventListener("click", resetGame);
logoutButton.addEventListener("click", logout);
registerButton.addEventListener("click", registerPlayer);

function loadPlayerData() {
    const savedPlayer = localStorage.getItem("rps-player");
    if (savedPlayer) {
        const { name, stats, playerScore: savedPlayerScore, computerScore: savedComputerScore } = JSON.parse(savedPlayer);
        playerDisplayName.textContent = name;
        playerStats = stats;
        playerScore = savedPlayerScore;
        computerScore = savedComputerScore;
        updateUIAfterLogin();
    }
}

function savePlayerData() {
    const playerData = {
        name: playerDisplayName.textContent,
        stats: playerStats,
        playerScore,
        computerScore
    };
    localStorage.setItem("rps-player", JSON.stringify(playerData));
}

function registerPlayer() {
    const name = playerNameInput.value.trim();
    if (name) {
        playerDisplayName.textContent = name;
        updateUIAfterLogin();
        savePlayerData();
    } else {
        alert("Please enter a valid name!");
    }
}

function updateUIAfterLogin() {
    loginSection.style.display = "none";
    welcomeText.style.display = "block";
    logoutButton.style.display = "inline-block";
    statsBoard.style.display = "block";
    choicesButtons.forEach(button => button.disabled = false);
    updateStats();
}

function logout() {
    localStorage.removeItem("rps-player");
    playerScore = 0;
    computerScore = 0;
    playerStats = { wins: 0, losses: 0, draws: 0 };
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;
    loginSection.style.display = "block";
    welcomeText.style.display = "none";
    logoutButton.style.display = "none";
    statsBoard.style.display = "none";
    resultText.textContent = "Choose your move!";
    resultText.parentElement.classList.remove("winner", "loser", "draw");
    choicesButtons.forEach(button => button.disabled = true);
}

function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        playerStats.draws++;
        return "It's a draw!";
    }

    if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) {
        playerScore++;
        playerStats.wins++;
        playerScoreDisplay.textContent = playerScore;
        return `You win! ${playerChoice} beats ${computerChoice}.`;
    } else {
        computerScore++;
        playerStats.losses++;
        computerScoreDisplay.textContent = computerScore;
        return `You lose! ${computerChoice} beats ${playerChoice}.`;
    }
}

function updateStats() {
    winsDisplay.textContent = playerStats.wins;
    lossesDisplay.textContent = playerStats.losses;
    drawsDisplay.textContent = playerStats.draws;
    const totalGames = playerStats.wins + playerStats.losses + playerStats.draws;
    const winRate = totalGames > 0 ? ((playerStats.wins / totalGames) * 100).toFixed(1) : 0;
    winRateDisplay.textContent = `${winRate}%`;
}

function playGame(playerChoice) {
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);
    resultText.textContent = result;
    resultText.parentElement.classList.remove("winner", "loser", "draw");
    if (result.includes("win")) {
        resultText.parentElement.classList.add("winner");
    } else if (result.includes("lose")) {
        resultText.parentElement.classList.add("loser");
    } else {
        resultText.parentElement.classList.add("draw");
    }
    updateStats();
    savePlayerData();
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    playerStats = { wins: 0, losses: 0, draws: 0 };
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;
    resultText.textContent = "Choose your move!";
    resultText.parentElement.classList.remove("winner", "loser", "draw");
    updateStats();
    savePlayerData();
}

document.addEventListener("DOMContentLoaded", loadPlayerData);