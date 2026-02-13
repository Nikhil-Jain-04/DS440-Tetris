export type PIECE = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
export type CELL = PIECE | null | "G";
export type CUSTOM_CELL = PIECE | "N" | "G";

export type PIECE_INFO_TYPE = {
  color: string,
  rotations: number[][][],
  kick_index: number
}

export type PIECE_INFO_DICT_TYPE = Record<PIECE, PIECE_INFO_TYPE>;
