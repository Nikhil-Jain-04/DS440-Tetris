import { useEffect, useRef } from "react";
import { drawPieceQueue } from "../utils/drawing";
import { CELL_SIZE_PX } from "../utils/gameinfo";

export default function PieceQueueCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return
    canvas.width = CELL_SIZE_PX * 5;
    canvas.height = CELL_SIZE_PX * 15;
    const ctx = canvas.getContext("2d");

    const loop = (ts: number) => {
      if(!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawPieceQueue(ctx);
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if(rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}
