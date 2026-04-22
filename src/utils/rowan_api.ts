export async function fetchPrediction(
  placed: string,
  hold: string,
  queue: string,
  init_board: string
) {
  const res = await fetch("http://localhost:8001/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placed, hold, queue, init_board }),
  });
  return res.json(); // { x, y, r }
}