import { useRef, useEffect } from "react";
import { drawHoldPiece } from "../utils/drawing";
import { CELL_SIZE_PX } from "../utils/gameinfo";

export default function HoldPieceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    canvas.width = 5 * CELL_SIZE_PX;
    canvas.height = 3 * CELL_SIZE_PX;
    const ctx = canvas.getContext("2d");

    const loop = (ts: number) => {
      if(!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      drawHoldPiece(ctx);
      rafIdRef.current = requestAnimationFrame(loop);
    }

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
