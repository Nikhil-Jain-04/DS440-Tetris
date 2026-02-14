import { useEffect, useRef } from "react";
import { COLS, CELL_SIZE_PX } from "../utils/gameinfo";
import { drawBoardBackground, drawCustomPlayfield } from "../utils/drawing";
import { type CUSTOM_CELL } from "../utils/types";
// import jsonData from "../data/cases.json" with { type: "json" };

export default function CustomPlayfieldCanvas({ board }: { board: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  // const board = jsonData["playfield"][12];
  let custom_playfield: CUSTOM_CELL[][] = [];

  for(let r = 0; r < 40; r++) {
    let row: CUSTOM_CELL[] = [];

    for(let c = 0; c < 10; c++) {
      row.push(board[10 * r + c] as CUSTOM_CELL);
    }

    // custom_playfield.push(row);
    custom_playfield.splice(0, 0, row);
  }

  // custom_playfield = custom_playfield.reverse();
  console.log(`Custom Playfield: ${JSON.stringify(custom_playfield)}`);
  // console.log(`Json: ${JSON.stringify(jsonData)}`);
  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    canvas.width = COLS * CELL_SIZE_PX;
    canvas.height = 40 * CELL_SIZE_PX;
    const ctx = canvas.getContext("2d");

    const drawCanvasLoop = (timestamp: number) => {
      if(!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBoardBackground(ctx, 40, COLS);
      drawCustomPlayfield(ctx, custom_playfield);
      rafIdRef.current = requestAnimationFrame(drawCanvasLoop);
    };

    rafIdRef.current = requestAnimationFrame(drawCanvasLoop);
    // initGame();

    return () => {
      if(rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      // clearInterval(interval);
    };
  }, [board]);

  return (
    <div>
      <div className="outline-[1px] outline-[#999]">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex flex-col">
        <p></p>
      </div>
    </div>
    
  );
}


