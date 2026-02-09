import { type PIECE, type CELL } from "./types";
import { PIECE_INFO, ROWS, COLS, KICK_TABLE } from "./gameinfo";


export let board: CELL[][] = [];
export let currPiece: PIECE | null = null;
export let pieceQueue: PIECE[] = [];
export let currPos = [3, 0];
export let currRotation = 0;
export let holdPiece: PIECE | null = null;
let swapped: boolean = false;

resetBoard();

function resetBoard() {
  board = [];

  for(let r = 0; r < ROWS; r++) {
    let row: CELL[] = [];

    for(let c = 0; c < COLS; c++) {
      row.push(null);
    }

    board.push(row);
  }
}

export function initGame() {
  resetBoard();
  initPieceQueue();
  getNextPiece();
}

function getNextPiece() {
  const nextPiece = pieceQueue.shift();
  if(nextPiece == "O") currPos = [4, 0];
  else currPos = [3, 0];
  currRotation = 0;
  if(nextPiece != undefined) currPiece = nextPiece;
  if(pieceQueue.length <= 7) pieceQueue.push(...getSevenBag());
}

function initPieceQueue() {
  pieceQueue = [];
  const bag1 = getSevenBag();
  const bag2 = getSevenBag();
  pieceQueue.push(...bag1);
  pieceQueue.push(...bag2);
}

function getSevenBag() {
  const pieceMap: PIECE[] = ["I", "O", "T", "S", "Z", "J", "L"];
  const arr = [0, 1, 2, 3, 4, 5, 6];
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.map((val) => pieceMap[val]);
}

export function swapHoldPiece() {
  if(swapped) return;
  if(holdPiece != null) {
    [currPiece, holdPiece] = [holdPiece, currPiece];
    if(currPiece == "O") currPos = [4, 0];
    else currPos = [3, 0];
    currRotation = 0;
  } else {
    holdPiece = currPiece;
    getNextPiece();
  }

  swapped = true;
}

export function hardDropPiece() {
  while(tryMove(0, 1));
  lockPiece();
}

function lockPiece() {
  if(currPiece == null) return;
  let px = currPos[0];
  let py = currPos[1];
  let rotation = PIECE_INFO[currPiece].rotations[currRotation];

  for(let dy = 0; dy < rotation.length; dy++) {
    for(let dx = 0; dx < rotation[dy].length; dx++) {
      if(rotation[dy][dx] == 1) board[py+dy][px+dx] = currPiece;
    }
  }

  clearLines();
  getNextPiece();
  swapped = false;
}

export function tryMove(dx: number, dy: number) {
  if(currPiece == null) return;
  let newX = currPos[0] + dx;
  let newY = currPos[1] + dy;
  let rMatrix = PIECE_INFO[currPiece].rotations[currRotation];

  for(let dy = 0; dy < rMatrix.length; dy++) {
    for(let dx = 0; dx < rMatrix[dy].length; dx++) {
      // positions of cells
      let x = newX + dx;
      let y = newY + dy;

      // checks if there is a mino outside of bounds or overlapping prev placed piece
      if(rMatrix[dy][dx] == 1 && (x < 0 || x >= COLS || y < 0 || y >= ROWS || board[y][x] != null)) {
        return false;
      }

      /* OLD CODE MORE READABLE MAYBE */
      // if(cx < 0 || cx >= COLS || cy < 0 || cy >= COLS) {
      //   if(rotation[i][j] == 1) return false;
      // } else {
      //   if(rotation[i][j] == 1 && board[cx][cy] != null) return false
      // }
    }
  }

  currPos = [newX, newY];
  return true;
}

export function tryRotation(dir: number) {
  if(currPiece == null) return;
  let newRotation = currRotation + dir;
  while(newRotation < 0) newRotation += 4;
  while(newRotation > 3) newRotation -= 4;

  let px = currPos[0];
  let py = currPos[1];
  let rMatrix = PIECE_INFO[currPiece].rotations[newRotation];

  // for(let dy = 0; dy < rMatrix.length; dy++) {
  //   for(let dx = 0; dx < rMatrix[dy].length; dx++) {
  //     // positions of cells
  //     let x = px + dx;
  //     let y = py + dy;

  //     if(rMatrix[dy][dx] == 1 && (x < 0 || x >= COLS || y < 0 || y >= ROWS || board[y][x] != null)) {
  //       return false;
  //     }
  //   }
  // }
  const kicks = KICK_TABLE[PIECE_INFO[currPiece].kick_index][currRotation][newRotation];
  
  for(let i = 0; i < kicks.length; i++) {
    const [dx, dy] = kicks[i];
    if(isValidPosRot(px+dx, py-dy, rMatrix)) {
      currRotation = newRotation;
      currPos = [px + dx, py - dy];
      return true;
    }
  }

  return false;
}

function isValidPosRot(px: number, py: number, rMatrix: number[][]) {
  for(let dy = 0; dy < rMatrix.length; dy++) {
    for(let dx = 0; dx < rMatrix[dy].length; dx++) {
      let x = px + dx;
      let y = py + dy;

      if(rMatrix[dy][dx] == 1 && (x < 0 || x >= COLS || y < 0 || y >= ROWS || board[y][x] != null)) {
        return false;
      }
    }
  }

  return true;
}

function clearLines() {
  for(let row = 0; row < ROWS; row++) {
    if(isRowFull(row)) {
      moveLinesDown(row);
    }
  }
}

function moveLinesDown(row: number) {
  while(row > 0) {
    for(let c = 0; c < COLS; c++) {
      board[row][c] = board[row-1][c];
    }

    row--;
  }

  for(let c = 0; c < COLS; c++) {
    board[row][c] = null;
  }
}

function isRowFull(row: number): boolean {
  for(let c = 0; c < COLS; c++) {
    if(board[row][c] == null) {
      return false;
    }
  }

  return true;
}

export function getGhostPieceLocation() {
  let currY = currPos[1];
  while(validYPos(currY + 1)) currY++;
  return [currPos[0], currY];
}

function validYPos(py: number) {
  if(!currPiece) return;
  let px = currPos[0];
  const rMatrix = PIECE_INFO[currPiece].rotations[currRotation];

  for(let dy = 0; dy < rMatrix.length; dy++) {
    for(let dx = 0; dx < rMatrix[dy].length; dx++) {
      let x = px + dx;
      let y = py + dy;
      if(rMatrix[dy][dx] == 1 && (x < 0 || x >= COLS || y < 0 || y >= ROWS || board[y][x] != null)) return false;
    }
  }

  return true;
}
