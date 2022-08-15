import { writable } from "svelte/store";
import { DEFAULT_DOTS_PER_SQUARE, DEFAULT_X_SQUARES, DEFAULT_Y_SQUARES } from "../constants/BoardConfig";

export const xSquares = writable(DEFAULT_X_SQUARES);
export const ySquares = writable(DEFAULT_Y_SQUARES);
export const dotsPerSquare = writable(DEFAULT_DOTS_PER_SQUARE);

