import { useEffect, useRef, useState } from "react";
import { ROWS, COLS, CELL_SIZE_PX } from "../utils/gameinfo";
import { board, currPiece, currPos, currRotation, holdPiece, pieceQueue, prediction, initGame, tryMove, tryRotation, hardDropPiece, swapHoldPiece } from "../utils/gameutils";
import { drawGame, drawPosDot } from "../utils/drawing";

export default function TetrisCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const selectedRef = useRef<Set<string>>(new Set());
  const [, setTick] = useState(0);

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
      if (prediction) drawPosDot(ctx, prediction.x, prediction.y);
      setTick(t => t + 1);

      rafIdRef.current = requestAnimationFrame(drawCanvasLoop);
    };

    rafIdRef.current = requestAnimationFrame(drawCanvasLoop);

    // const interval = setInterval(() => {
    //   console.log('hard dropping...');
    //   hardDropPiece();
    // }, 5000);
    // const keyDownListener = (e: KeyboardEvent) => {
    //   if(!e.repeat) {
        
    //   }
    // };

    const keyListener = (e: KeyboardEvent) => {
      if(e.key === "ArrowDown") {
        tryMove(0, 1);
      }

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
        
        if(e.key == "x") {
          tryRotation(1);
        }

        if(e.key == "z") {
          tryRotation(-1);
        }

        if(e.key == " ") {
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
    <div className="outline-[1px] outline-[#999]" style={{ position: "relative" }}>
      <canvas ref={canvasRef} />
      <pre style={{ fontSize: 11, lineHeight: 1.3, position: "fixed", top: 0, left: 0, whiteSpace: "pre-wrap", width: 360 }}>
        {`piece: ${currPiece}  hold: ${holdPiece}  queue: ${pieceQueue.slice(0, 5).join("")}\n`}
        {`prediction: x=${prediction?.x ?? "?"} y=${prediction?.y ?? "?"} r=${prediction?.r ?? "?"}\n`}
        {([...board].reverse().map(row => row.map(c => c ?? "N").join("")).join("").padEnd(400, "N"))}
      </pre>
    </div>
  );
}


