import { useState } from "react";
import jsonData from '../data/cases.json';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import CustomPlayfieldCanvas from "./CustomPlayfieldCanvas";
import type { CELL, CUSTOM_CELL } from "../utils/types";
import type { PIECE } from "../utils/types";
import { placePieceOnBoard } from "../utils/aiutils";

// T-Piece

// N: 0, E: 1, S: 2, W: 3


export function BoardVisualizationTool() {
  const [index, setIndex] = useState<number>(0);
  if(index < 0 || index > 24) return(<div></div>);
  const _key = index.toString();
  const _piece = jsonData.placed[_key as keyof typeof jsonData.placed] as PIECE;
  const _x = Number(jsonData.x[_key as keyof typeof jsonData.x]);
  const _y = Number(jsonData.y[_key as keyof typeof jsonData.y]);
  const _r = jsonData.r[_key as keyof typeof jsonData.r] as string;
  const _playfield = jsonData["playfield"][_key as keyof typeof jsonData.playfield];
  // console.log(`Piece: ${_piece}, x: ${_x}, y: ${_y}, r: ${_r}, i: ${_key}`);
  let _playfield_mat = [];

  for(let r = 0; r < 40; r++) {
    let row = [];

    for(let c = 0; c < 10; c++) {
      const index = 10 * r + c;
      row.push(_playfield[index]);
    }

    _playfield_mat.unshift(row);
  }

  // console.log(`Playfield: ${JSON.stringify(_playfield_mat)}`);
  const rotMap = {"N": 0, "E": 1, "S": 2, "W": 3};
  let resultBoard: CELL[][] = placePieceOnBoard(_playfield_mat as CELL[][], _piece, _x, _y, rotMap[_r as keyof typeof rotMap]);
  let resultBoardStr = "";

  for(let r = 0; r < 40; r++) {
    let row = "";

    for(let c = 0; c < 10; c++) {
      row += resultBoard[r][c];
    }

    resultBoardStr = row + resultBoardStr;
  }

  // console.log(jsonData["next_playfield"][index.toString() as keyof typeof jsonData.playfield])
  // console.log(`Result str: ${resultBoardStr}`)
  // console.log(`Are same: ${jsonData["next_playfield"][index.toString() as keyof typeof jsonData.playfield] === resultBoardStr}`)
  // console.log(`Result Board: ${JSON.stringify(resultBoard[39])}`);
  // const resultBoard = placePieceOnBoard(_playfield_mat, _piece, _x, _y, rotMap[_r]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-3 justify-center">
        <p className="text-2xl">Piece: {jsonData.placed[index.toString() as keyof typeof jsonData.placed]}</p>
        <p className="text-2xl">x: {jsonData.x[index.toString() as keyof typeof jsonData.x]}</p>
        <p className="text-2xl">y: {jsonData.y[index.toString() as keyof typeof jsonData.y]}</p>
        <p className="text-2xl">r: {jsonData.r[index.toString() as keyof typeof jsonData.r]}</p>
      </div>
      <div className="flex flex-row gap-6">
        <div className="flex items-center justify-center">
          <button
              className="w-10 h-20 flex items-center justify-center cursor-pointer"
              onClick={() => {if(index > 0) setIndex(index-1)}}
            >
            <IoIosArrowBack size={64} />
          </button>
        </div>
        <CustomPlayfieldCanvas board={jsonData["playfield"][index.toString() as keyof typeof jsonData.playfield]} />
        <CustomPlayfieldCanvas board={jsonData["next_playfield"][index.toString() as keyof typeof jsonData.playfield]} />
        <CustomPlayfieldCanvas board={resultBoardStr} />
        <div className="flex items-center justify-cente">
          <button
            className="w-10 h-20 flex items-center justify-center cursor-pointer"
            onClick={() => {if(index < 24) setIndex(index+1)}}
          >
            <IoIosArrowForward size={64} />
          </button>
        </div>
      </div>
    </div>
  );
}
