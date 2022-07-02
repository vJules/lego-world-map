import { DOT_COLOR } from "../constants/DotColor";

const OUTER_SPACING = 20;
const DOTS_PER_SQUARE = 16;

export class CanvasDisplay {
  canvas: HTMLCanvasElement;
  dotSquares: any[];
  cx: CanvasRenderingContext2D;
  scale: number;
  spacing: number;
  xMax: number;
  yMax: number;

  constructor(parent, options = { scale: 10, spacing: 5 }) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = parent.offsetWidth;
    this.canvas.height = parent.offsetHeight;

    this.scale = options.scale;
    this.spacing = options.spacing;
    parent.appendChild(this.canvas);

    this.cx = this.canvas.getContext("2d");
  }

  setDotSquares(dotSquares: any[]) {
    this.dotSquares = dotSquares;
  }

  updateScale(newScale: number) {
    this.scale = newScale;
  }

  drawDotsFromDotSquares() {
    this.xMax = (this.dotSquares[0].length - 1) * DOTS_PER_SQUARE + 15;
    this.yMax = (this.dotSquares.length - 1) * DOTS_PER_SQUARE + 15;
    this.canvas.width = this.scalePosition(this.xMax) + OUTER_SPACING;
    this.canvas.height = this.scalePosition(this.yMax) + OUTER_SPACING;
    this.dotSquares.forEach((row, squareRowIndex) => {
      row.forEach((square, squareColumnIndex) => {
        square.dotRows.forEach((dotRow, dotRowIndex) => {
          dotRow.forEach((dotColumn, dotColumnIndex) => {
            this.drawDot(
              squareColumnIndex * DOTS_PER_SQUARE + dotColumnIndex,
              squareRowIndex * DOTS_PER_SQUARE + dotRowIndex,
              DOT_COLOR[dotColumn.color].hex
            );
          });
        });
      });
    });
  }

  drawDot(x: number, y: number, color: string) {
    if (x < 0 || y < 0 || x > this.xMax || y > this.yMax) {
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

  scalePosition(value: number) {
    const squareIndex = Math.floor(value / DOTS_PER_SQUARE);
    return value * this.scale + OUTER_SPACING + squareIndex * this.spacing;
  }

  descalePosition(value: number) {
    const valueWithoutSpacing = value - OUTER_SPACING;
    const squareIndex = Math.floor(valueWithoutSpacing / (DOTS_PER_SQUARE * this.scale));
    return Math.round((valueWithoutSpacing - squareIndex * this.spacing) / this.scale);
  }

  getDescaledDot(x: number, y: number) {
    return { dotX: this.descalePosition(x), dotY: this.descalePosition(y) };
  }
}
