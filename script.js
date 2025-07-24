// Game state
let currentPlayer = 'X';
let gameBoard = Array(9).fill('');
let gameActive = false;
let gameMode = 'player';
let difficulty = 'medium';
let scores = { X: 0, O: 0, ties: 0 };

// DOM elements
const statusText = document.getElementById('status');
const board = document.getElementById('board');
const winModal = document.getElementById('winModal');
const winMessage = document.getElementById('winMessage');
const modeButtons = document.querySelectorAll('.mode-btn');
const difficultySelect = document.getElementById('difficulty');

// Initialize game
function initGame() {
  renderBoard();
  updateScores();
  
  // Event listeners
  modeButtons.forEach(button => {
    button.addEventListener('click', () => setMode(button.dataset.mode));
  });
  
  document.getElementById('restartBtn').addEventListener('click', restartGame);
  document.getElementById('playAgainBtn').addEventListener('click', () => {
    winModal.style.display = 'none';
    restartGame();
  });
  
  difficultySelect.addEventListener('change', (e) => {
    difficulty = e.target.value;
    if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
      setTimeout(computerMove, 500);
    }
  });
}

// Set game mode
function setMode(mode) {
  gameMode = mode;
  modeButtons.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
  restartGame();
  statusText.textContent = `${currentPlayer}'s Turn`;
}

// Restart game
function restartGame() {
  currentPlayer = 'X';
  gameBoard.fill('');
  gameActive = true;
  statusText.textContent = `${currentPlayer}'s Turn`;
  renderBoard();
}

// Render game board
function renderBoard() {
  board.innerHTML = '';
  gameBoard.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.dataset.index = index;
    if (cell) cellDiv.dataset.player = cell;
    cellDiv.textContent = cell;
    cellDiv.addEventListener('click', handleCellClick);
    board.appendChild(cellDiv);
  });
}

// Handle cell click
function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (gameBoard[index] || !gameActive) return;

  makeMove(index, currentPlayer);
}

// Make a move
function makeMove(index, player) {
  gameBoard[index] = player;
  const cell = document.querySelector(`[data-index="${index}"]`);
  cell.textContent = player;
  cell.dataset.player = player;

  if (checkWinner(player)) {
    endGame(`${player} wins!`);
    scores[player]++;
    updateScores();
    return;
  }

  if (gameBoard.every(cell => cell)) {
    endGame("It's a draw!");
    scores.ties++;
    updateScores();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `${currentPlayer}'s Turn`;

  if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
    setTimeout(computerMove, 500);
  }
}

// Computer move logic
function computerMove() {
  let move;
  
  if (difficulty === 'easy') {
    // Random move
    move = getRandomMove();
  } else if (difficulty === 'medium') {
    // 50% chance to make winning/blocking move, else random
    if (Math.random() > 0.5) {
      move = findWinningMove('O') || findWinningMove('X') || getRandomMove();
    } else {
      move = getRandomMove();
    }
  } else {
    // Hard - always makes best move
    move = findWinningMove('O') || findWinningMove('X') || getBestMove();
  }

  if (move !== undefined) {
    makeMove(move, 'O');
  }
}

// Helper functions for AI
function getRandomMove() {
  const emptyIndices = gameBoard
    .map((cell, i) => (cell === '' ? i : null))
    .filter(i => i !== null);
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function findWinningMove(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameBoard[a] === player && gameBoard[b] === player && gameBoard[c] === '') return c;
    if (gameBoard[a] === player && gameBoard[c] === player && gameBoard[b] === '') return b;
    if (gameBoard[b] === player && gameBoard[c] === player && gameBoard[a] === '') return a;
  }
  return null;
}

function getBestMove() {
  // Simple strategy - prioritize center, then corners, then edges
  if (gameBoard[4] === '') return 4;
  
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => gameBoard[i] === '');
  if (availableCorners.length) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  const edges = [1, 3, 5, 7];
  const availableEdges = edges.filter(i => gameBoard[i] === '');
  if (availableEdges.length) {
    return availableEdges[Math.floor(Math.random() * availableEdges.length)];
  }
}

// Check for winner
function checkWinner(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return gameBoard[a] === player && gameBoard[b] === player && gameBoard[c] === player;
  });
}

// End game
function endGame(message) {
  gameActive = false;
  winMessage.textContent = message;
  winModal.style.display = 'flex';
}

// Update scoreboard
function updateScores() {
  document.getElementById('playerX').textContent = `X: ${scores.X}`;
  document.getElementById('playerO').textContent = `O: ${scores.O}`;
  document.getElementById('ties').textContent = `Ties: ${scores.ties}`;
}

// Initialize the game
initGame();