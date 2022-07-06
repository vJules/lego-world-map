import type { CanvasDisplay } from "../lib/CanvasDisplay";

export interface IBoard {
  dots: IDot[][];

  createBoard: () => IDot[][];
  resetBoard: () => void;
  addRenderer: (renderer: CanvasDisplay) => void;
  updateDots: (dots: { x: number, y: number }[]) => void;
}

export interface IDot {
  color: string;
}

export interface IColorPickerItem {
  id: string;
  displayName: string;
  hex: string;
  amountLimit: number;
  currentAmount: number;
  amountLeft: number
  key: string;
}
