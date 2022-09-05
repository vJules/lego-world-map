import type { CanvasDisplay } from "../lib/CanvasDisplay";

import type { RGBColor } from "./RGBColor";

export interface IBoard {
  dots: IDot[][];

  createBoard: () => IDot[][];
  updatePlates: ({ xSquares, ySquares }) => void;
  resetBoard: () => void;
  drawBoard: () => void;
  addRenderer: (renderer: CanvasDisplay) => void;
  updateDots: (dots: { x: number, y: number }[]) => void;
  addOverlayDots: () => void;
  updateOverlayDots: (dots: { x: number, y: number }[]) => void;
  moveOverlayDots: (xIncrease: number, yIncrease: number) => void;
  onUpdatingOverlayChange: (callbackFn: (isUpdatingOverlay: boolean) => void) => void;
}

export interface IDot {
  color?: string;
}

export interface IColorPickerItem {
  id: string;
  displayName: string;
  hex: string;
  rgb: RGBColor;
  count: number;
  limit: number;
  key: string;
}
