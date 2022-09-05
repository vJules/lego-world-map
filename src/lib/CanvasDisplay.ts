import { DOT_COLORS } from "../constants/DotColors";
import { PLATE_COLORS } from "../constants/PlateColors";
import type { IDot } from "../models/Board";

const OUTER_SPACING = 40;
const DOTS_PER_SQUARE = 16;

export class CanvasDisplay {
  canvasElement: HTMLCanvasElement;
  cx: CanvasRenderingContext2D;
  scale: number;
  spacing: number;
  dotSpacing: number;
  xMax: number;
  yMax: number;

  constructor(parent, options = { scale: 10, spacing: 5, dotSpacing: 0.5 }) {
    this.canvasElement = document.createElement("canvas");
    this.canvasElement.width = parent.offsetWidth;
    this.canvasElement.height = parent.offsetHeight;

    this.scale = options.scale;
    this.spacing = options.spacing;
    this.dotSpacing = options.dotSpacing;
    parent.appendChild(this.canvasElement);

    this.cx = this.canvasElement.getContext("2d");
  }


  // TODO: Move out the part that sets the size of the canvas. This is used multiple times and doesn't need to set the size every time.
  drawDots(dots: IDot[][]) {
    this.xMax = dots[0]?.length;
    this.yMax = dots.length;
    this.canvasElement.width = this.scalePosition(this.xMax) + OUTER_SPACING;
    this.canvasElement.height = this.scalePosition(this.yMax) + OUTER_SPACING;
    dots.forEach((row, dotRowIndex) => {
      row.forEach((dotColumn, dotColumnIndex) => {
        this.drawDot(
          dotColumnIndex,
          dotRowIndex,
          DOT_COLORS[dotColumn.color]?.hex || PLATE_COLORS['black']?.hex
        );
      });
    });
  }

  drawOverlayDots(dots: IDot[][]) {
    dots.forEach((row, dotRowIndex) => {
      row.forEach((dotColumn, dotColumnIndex) => {
        this.drawDot(
          dotColumnIndex,
          dotRowIndex,
          DOT_COLORS[dotColumn.color]?.hex
        );
      });
    });
  }

  drawDot(x: number, y: number, color: string) {
    if (x < 0 || y < 0 || x >= this.xMax || y >= this.yMax) {
      return;
    }
    this.cx.fillStyle = color;

    this.cx.beginPath();
    this.cx.arc(
      this.scalePosition(x),
      this.scalePosition(y),
      this.scale / 2,
      0,
      2 * Math.PI
    );
    this.cx.fill();
  }

  updateScale(newScale: number) {
    this.scale = newScale;
  }

  scalePosition(value: number) {
    const squareIndex = Math.floor(value / DOTS_PER_SQUARE);
    return value * (this.scale + this.dotSpacing) + OUTER_SPACING + squareIndex * this.spacing;
  }

  descalePosition(value: number) {
    const valueWithoutOuterSpacing = value - OUTER_SPACING;
    const squareIndex = Math.floor(valueWithoutOuterSpacing / (DOTS_PER_SQUARE * this.scale + (DOTS_PER_SQUARE - 1 * this.dotSpacing)));
    const valueWithoutSquareSpacing = valueWithoutOuterSpacing - squareIndex * this.spacing;
    const position = Math.round(valueWithoutSquareSpacing / (this.scale + this.dotSpacing));
    return position;
  }

  getDescaledDot(x: number, y: number) {
    return { dotX: this.descalePosition(x), dotY: this.descalePosition(y) };
  }
}
