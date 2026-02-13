import { ROWS, COLS, CELL_SIZE_PX, PIECE_INFO } from "./gameinfo"
import { board, currPiece, pieceQueue, currPos, currRotation, holdPiece, getGhostPieceLocation } from "./gameutils";
import type { CELL, CUSTOM_CELL, PIECE } from "./types";

export function drawGame(ctx: CanvasRenderingContext2D) {
  drawBoardBackground(ctx);
  drawPlayfield(ctx);
  drawGhostPiece(ctx);
  drawCurrPiece(ctx);
}

function drawCurrPiece(ctx: CanvasRenderingContext2D) {
  if(currPiece == null) return;
  let px = currPos[0];
  let py = currPos[1];
  let rotation = PIECE_INFO[currPiece].rotations[currRotation];
  ctx.fillStyle = PIECE_INFO[currPiece].color;

  for(let dy = 0; dy < rotation.length; dy++) {
    for(let dx = 0; dx < rotation[dy].length; dx++) {
      if(rotation[dy][dx] == 1) {
        ctx.fillRect((px + dx) * CELL_SIZE_PX, (py + dy) * CELL_SIZE_PX, CELL_SIZE_PX, CELL_SIZE_PX);
      }
    }
  }
}

function drawPlayfield(ctx: CanvasRenderingContext2D) {
  for(let r = 0; r < ROWS; r++) {
    for(let c = 0; c < COLS; c++) {
      const cell = board[r][c];

      if(cell != null) {
        if(cell === "G") ctx.fillStyle = "#7F7F7F";
        else ctx.fillStyle = PIECE_INFO[cell].color;
        ctx.fillRect(c * CELL_SIZE_PX, r * CELL_SIZE_PX, CELL_SIZE_PX, CELL_SIZE_PX);
      }
    }
  }
}



export function drawCustomPlayfield(ctx: CanvasRenderingContext2D, custom_board: CUSTOM_CELL[][]) {
  for(let r = 0; r < custom_board.length; r++) {
    for(let c = 0; c < custom_board[r].length; c++) {
      const cell = custom_board[r][c];

      if(cell != "N") {
        if(cell === "G") ctx.fillStyle = "#7F7F7F";
        else ctx.fillStyle = PIECE_INFO[cell].color;
        ctx.fillRect(c * CELL_SIZE_PX, r * CELL_SIZE_PX, CELL_SIZE_PX, CELL_SIZE_PX);
      }
    }
  }
}

export function drawBoardBackground(ctx: CanvasRenderingContext2D, nRows: number = ROWS, nCols: number = COLS) {
  // draw background and grid
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, nCols * CELL_SIZE_PX, nRows * CELL_SIZE_PX);
  ctx.strokeStyle = "#7F7F7F";
  ctx.lineWidth = 1;

  for(let c = 0; c <= nCols; c++) {
    drawVerticalLine(ctx, c * CELL_SIZE_PX, nRows);
  }

  for(let r = 0; r <= nRows; r++) {
    if(r == 4) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
    }
    
    drawHorizontalLine(ctx, r * CELL_SIZE_PX);

    if(r == 4) {
      ctx.strokeStyle = "#7F7F7F";
      ctx.lineWidth = 1;
    }
  }

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, nCols * CELL_SIZE_PX, nRows * CELL_SIZE_PX);
}

function drawVerticalLine(ctx: CanvasRenderingContext2D, x: number, nRows: number = ROWS) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, nRows * CELL_SIZE_PX);
  ctx.stroke();
}

function drawHorizontalLine(ctx: CanvasRenderingContext2D, y: number, nCols: number = COLS) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(nCols * CELL_SIZE_PX, y);
  ctx.stroke();
}

function drawGhostPiece(ctx: CanvasRenderingContext2D) {
  if(!currPiece) return;
  let [gx, gy] = getGhostPieceLocation();
  console.log(`Gx: ${gx}, Gy: ${gy}`);
  ctx.fillStyle = "#7F7F7F";
  const rMatrix = PIECE_INFO[currPiece].rotations[currRotation];

  for(let dy = 0; dy < rMatrix.length; dy++) {
    for(let dx = 0; dx < rMatrix[dy].length; dx++) {
      let x = gx + dx;
      let y = gy + dy;
      if(rMatrix[dy][dx] == 1) ctx.fillRect(x * CELL_SIZE_PX, y * CELL_SIZE_PX, CELL_SIZE_PX, CELL_SIZE_PX);
    }
  }
}

export function drawPieceQueue(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, CELL_SIZE_PX * 5, CELL_SIZE_PX * 15);

  for(let i = 0; i < 5; i++) {
    let piece: PIECE = pieceQueue[i];
    ctx.fillStyle = PIECE_INFO[piece].color;
    let rMatrix = PIECE_INFO[piece].rotations[0];
    let x = (5 - rMatrix[0].length) / 2 * CELL_SIZE_PX;
    let y = (i * 3 + 0.5) * CELL_SIZE_PX;
    if(rMatrix[0].length == 4) y -= 0.5 * CELL_SIZE_PX;

    for(let dy = 0; dy < rMatrix.length; dy++) {
      for(let dx = 0; dx < rMatrix[dy].length; dx++) {
        if(rMatrix[dy][dx] == 1) ctx.fillRect(x + dx * CELL_SIZE_PX, y + dy * CELL_SIZE_PX, CELL_SIZE_PX, CELL_SIZE_PX);
      }
    }
  }
}

export function drawHoldPiece(ctx: CanvasRenderingContext2D) {
  if(!holdPiece) return;
  ctx.fillStyle = PIECE_INFO[holdPiece].color;
  const rMatrix = PIECE_INFO[holdPiece].rotations[0];
  const x = (5 - rMatrix[0].length) / 2 * CELL_SIZE_PX;
  let y = 0.5 * CELL_SIZE_PX;
  if(rMatrix[0].length == 4) y = 0;

  for(let dy = 0; dy < rMatrix.length; dy++) {
    for(let dx = 0; dx < rMatrix[dy].length; dx++) {
      if(rMatrix[dy][dx] == 1) ctx.fillRect(x + dx * CELL_SIZE_PX, y + dy * CELL_SIZE_PX, CELL_SIZE_PX, CELL_SIZE_PX);
    }
  }
}
