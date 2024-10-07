const ROWS = 10;
const COLS = 10;
const BOMB_COUNT = 15;
let board = [];
let gameOver = false;
let timer;
let timeElapsed = 0;

// Initialize the game
function initGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    placeBombs();
    calculateNumbers();
    renderBoard();
    resetTimer();
    gameOver = false;
    document.getElementById("congratulations").classList.add("hidden");
}

// Place bombs randomly on the board
function placeBombs() {
    let bombsPlaced = 0;
    while (bombsPlaced < BOMB_COUNT) {
        const row = Math.floor(Math.random() * ROWS);
        const col = Math.floor(Math.random() * COLS);
        if (board[row][col] !== "💣") {
            board[row][col] = "💣";
            bombsPlaced++;
        }
    }
}

// Calculate numbers for each cell based on surrounding bombs
function calculateNumbers() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === "💣") continue;
            let bombCount = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = r + i;
                    const newCol = c + j;
                    if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol] === "💣") {
                        bombCount++;
                    }
                }
            }
            board[r][c] = bombCount;
        }
    }
}

// Render the game board
function renderBoard() {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = '';
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.dataset.row = r;
            cellElement.dataset.col = c;

            cellElement.addEventListener("click", () => {
                if (!gameOver) {
                    handleCellClick(r, c);
                }
            });

            cellElement.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (!gameOver) {
                    toggleFlag(r, c);
                }
            });

            gameContainer.appendChild(cellElement);
        });
    });
}

// Handle left-click on a cell
function handleCellClick(row, col) {
    const cellElement = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cellElement.classList.contains("flag")) {
        // If flagged, remove the flag and reveal it
        cellElement.classList.remove("flag");
        cellElement.innerText = '';
    }

    if (!timer) startTimer();
    if (board[row][col] === "💣") {
        gameOver = true;
        revealBombs();
        alert("Game Over! You clicked a bomb.");
        clearInterval(timer);
    } else {
        revealCell(row, col);
        checkWinCondition();
    }
}

// Reveal the clicked cell
function revealCell(row, col) {
    const cellElement = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cellElement.classList.contains("revealed")) return;

    cellElement.classList.add("revealed");
    cellElement.style.backgroundColor = "#fff";
    cellElement.innerText = board[row][col] > 0 ? board[row][col] : '';

    if (board[row][col] === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                    const adjacentCell = document.querySelector(`.cell[data-row="${newRow}"][data-col="${newCol}"]`);
                    if (!adjacentCell.classList.contains("revealed")) {
                        revealCell(newRow, newCol);
                    }
                }
            }
        }
    }
}

// Reveal all bombs when the game is over
function revealBombs() {
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell === "💣") {
                const bombCell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                bombCell.classList.add("bomb");
                bombCell.innerText = "💣";
            }
        });
    });
}

// Check if the user has won the game
function checkWinCondition() {
    let correctlyFlaggedBombs = 0;
    let totalCellsRevealed = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cellElement = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
            if (board[r][c] === "💣" && cellElement.classList.contains("flag")) {
                correctlyFlaggedBombs++;
            }
            if (cellElement.classList.contains("revealed")) {
                totalCellsRevealed++;
            }
        }
    }

    const totalCells = ROWS * COLS;
    if (correctlyFlaggedBombs === BOMB_COUNT && totalCellsRevealed === totalCells - BOMB_COUNT) {
        clearInterval(timer);
        document.getElementById("congratulations").classList.remove("hidden");
        gameOver = true;
    }
}

// Toggle flag on a cell
function toggleFlag(row, col) {
    const cellElement = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (!cellElement.classList.contains("revealed")) {
        cellElement.classList.toggle("flag");
        cellElement.innerText = cellElement.classList.contains("flag") ? "🚩" : '';
    }
}

// Start the timer
function startTimer() {
    timer = setInterval(() => {
        timeElapsed++;
        document.getElementById("timer").innerText = `Time: ${timeElapsed} seconds`;
    }, 1000);
}

// Reset the game
document.getElementById("reset-button").addEventListener("click", initGame);

// Reset the timer
function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeElapsed = 0;
    document.getElementById("timer").innerText = "Time: 0 seconds";
}

// Initialize the game on page load
initGame();
