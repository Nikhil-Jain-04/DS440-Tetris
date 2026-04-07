import { type PIECE, type CELL } from "./types";
import { PIECE_INFO, ROWS, COLS } from "./gameinfo";

export type Placement = {
  board: CELL[][],
  rotation: number,
  x: number,
  y: number,
};

function copyBoard(board: CELL[][]): CELL[][] {
  return board.map(row => [...row]);
}

function isValidPosition(board: CELL[][], rMatrix: number[][], px: number, py: number): boolean {
  for (let dy = 0; dy < rMatrix.length; dy++) {
    for (let dx = 0; dx < rMatrix[dy].length; dx++) {
      if (rMatrix[dy][dx] === 1) {
        const x = px + dx;
        const y = py + dy;
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS || board[y][x] !== null) {
          return false;
        }
      }
    }
  }
  return true;
}

function lockPieceOnBoard(board: CELL[][], piece: PIECE, rMatrix: number[][], px: number, py: number): void {
  for (let dy = 0; dy < rMatrix.length; dy++) {
    for (let dx = 0; dx < rMatrix[dy].length; dx++) {
      if (rMatrix[dy][dx] === 1) {
        board[py + dy][px + dx] = piece;
      }
    }
  }
}

function clearLinesOnBoard(board: CELL[][]): void {
  for (let row = 0; row < ROWS; row++) {
    if (board[row].every(cell => cell !== null)) {
      for (let r = row; r > 0; r--) {
        for (let c = 0; c < COLS; c++) {
          board[r][c] = board[r - 1][c];
        }
      }
      for (let c = 0; c < COLS; c++) {
        board[0][c] = null;
      }
    }
  }
}

export function placePieceOnBoard(
  board: CELL[][],
  piece: PIECE,
  x: number,
  y: number,
  rotation: number
): CELL[][] {
  const rMatrix = PIECE_INFO[piece].rotations[rotation];
  y = 39 - y;
  x += PIECE_INFO[piece].tetrPosToMineTranslation[rotation][0]
  y += PIECE_INFO[piece].tetrPosToMineTranslation[rotation][1]

  for (let dy = 0; dy < rMatrix.length; dy++) {
    for (let dx = 0; dx < rMatrix[dy].length; dx++) {
      if (rMatrix[dy][dx] == 1) {
        const row = y + dy;
        const col = x + dx;
        if (row >= 0 && row < 40 && col >= 0 && col < COLS) {
          board[row][col] = piece
        }
      }
    }
  }

  return board;
}

// Enumerates all possible final board states from dropping a piece straight down
// at every valid (rotation, column) combination. Does not account for tucks or
// spin placements that require lateral movement after partial drops.
export function getAllPlacements(piece: PIECE, board: CELL[][]): Placement[] {
  const placements: Placement[] = [];
  const seen = new Set<string>();
  const rotations = PIECE_INFO[piece].rotations;

  for (let r = 0; r < rotations.length; r++) {
    const rMatrix = rotations[r];

    // Find bounding box of actual minos within the rotation matrix
    let minCol = rMatrix[0].length, maxCol = -1;
    let minRow = rMatrix.length;
    for (let dy = 0; dy < rMatrix.length; dy++) {
      for (let dx = 0; dx < rMatrix[dy].length; dx++) {
        if (rMatrix[dy][dx] === 1) {
          minCol = Math.min(minCol, dx);
          maxCol = Math.max(maxCol, dx);
          minRow = Math.min(minRow, dy);
        }
      }
    }

    // x range: leftmost mino can't go below col 0, rightmost can't exceed col 9
    const xMin = -minCol;
    const xMax = COLS - 1 - maxCol;
    // Start y so the topmost mino sits at board row 0
    const yStart = -minRow;

    for (let x = xMin; x <= xMax; x++) {
      if (!isValidPosition(board, rMatrix, x, yStart)) continue;

      // Hard drop: find lowest valid y
      let y = yStart;
      while (isValidPosition(board, rMatrix, x, y + 1)) {
        y++;
      }

      const newBoard = copyBoard(board);
      lockPieceOnBoard(newBoard, piece, rMatrix, x, y);
      clearLinesOnBoard(newBoard);

      // Deduplicate identical boards (e.g. O piece has 4 identical rotations)
      const key = JSON.stringify(newBoard);
      if (!seen.has(key)) {
        seen.add(key);
        placements.push({ board: newBoard, rotation: r, x, y });
      }
    }
  }

  return placements;
}
