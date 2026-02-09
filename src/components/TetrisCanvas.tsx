import { useEffect, useRef } from "react";
import { ROWS, COLS, CELL_SIZE_PX } from "../utils/gameinfo";
import { board, currPiece, currPos, currRotation, initGame, tryMove, tryRotation, hardDropPiece, swapHoldPiece } from "../utils/gameutils";
import { drawGame } from "../utils/drawing";

export default function TetrisCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    canvas.width = COLS * CELL_SIZE_PX;
    canvas.height = ROWS * CELL_SIZE_PX;
    const ctx = canvas.getContext("2d");

    const drawCanvasLoop = (timestamp: number) => {
      if(!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGame(ctx);

      rafIdRef.current = requestAnimationFrame(drawCanvasLoop);
    };

    rafIdRef.current = requestAnimationFrame(drawCanvasLoop);

    // const interval = setInterval(() => {
    //   console.log('hard dropping...');
    //   hardDropPiece();
    // }, 5000);

    const keyListener = (e: KeyboardEvent) => {
      if(!e.repeat) {
        console.log(`Key Pressed: "${e.key}"`);

        if(e.key === "ArrowUp") {
          hardDropPiece();
        }

        if(e.key === "ArrowLeft") {
          tryMove(-1, 0);
        }

        if(e.key === "ArrowRight") {
          tryMove(1, 0);
        }

        if(e.key === "ArrowDown") {
          tryMove(0, 1);
        }
        
        if(e.key == "x") {
          tryRotation(1);
        }

        if(e.key == "z") {
          tryRotation(-1);
        }

        if(e.key == "c") {
          swapHoldPiece();
        }

        if(e.key === "l") {
          console.log(`piece: ${currPiece}, pos: ${JSON.stringify(currPos)}, rotation: ${currRotation}`);
        }

        if(e.key === "b") {
          console.log(`Board: ${JSON.stringify(board)}`);
        }
      }
    };

    addEventListener("keydown", keyListener);
    initGame();

    return () => {
      if(rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      // clearInterval(interval);
      removeEventListener("keydown", keyListener);
    };
  }, []);

  return (
    <div className="outline-[1px] outline-[#999]">
      <canvas ref={canvasRef} />
    </div>
  );
}


