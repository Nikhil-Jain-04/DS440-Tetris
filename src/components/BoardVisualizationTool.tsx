import { useState } from "react";
import jsonData from '../data/cases.json';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import CustomPlayfieldCanvas from "./CustomPlayfieldCanvas";
import type { CUSTOM_CELL } from "../utils/types";

export function BoardVisualizationTool() {
  const [index, setIndex] = useState<number>(1);
  // if(index < 0 || index > 24) return(<div></div>);
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