import { writable } from "svelte/store";
import type { IBoard, IDotsSquare } from "../models/Board";
import { resetColorPickerItems } from "./color";

const createSquare = () => {
  const square: IDotsSquare = { dotRows: [] };
  square.dotRows = Array.from({ length: 16 }, () =>
    Array.from({ length: 16 }, () => Object.assign({}, { color: "black" }))
  );
  return square;
};

const createBoard = () => {
  let board: IBoard = { squareRows: [] };

  const X_SQUARES = 8;
  const Y_SQUARES = 5;
  board.squareRows = Array.from({ length: Y_SQUARES }, () =>
    Array.from({ length: X_SQUARES }, () => createSquare())
  );
  return board;
};

export const board = writable(
  (JSON.parse(localStorage.getItem("board")) as IBoard) || createBoard()
);
export const resetBoard = () => {
  resetColorPickerItems();
  board.set(createBoard());
};

board.subscribe((val: IBoard) =>
  localStorage.setItem("board", JSON.stringify(val))
);
