export class CanvasDisplay {
  canvas: HTMLCanvasElement;
  cx: CanvasRenderingContext2D;
  scale: number;
  spacing: number;

  constructor(parent, scale = 10, spacing = 3) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = parent.offsetWidth;
    this.canvas.height = parent.offsetHeight;

    this.scale = scale;
    this.spacing = spacing;
    parent.appendChild(this.canvas);

    this.cx = this.canvas.getContext("2d");
  }

  drawBackground() {
    this.cx.fillStyle = "#505050";
    this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.cx.fillStyle = "grey";
  }

  drawDot(x: number, y: number, color: string) {
    this.cx.fillStyle = color;
    this.cx.beginPath();
    this.cx.arc(
      x * this.scale + this.scale,
      y * this.scale + this.scale,
      this.scale / 2,
      0,
      2 * Math.PI
    );
    this.cx.fill();
    // this.cx.fillStyle = "grey";
    // this.cx.stroke();
  }

  getDot(x: number, y: number) {
    console.log(x, y);
    console.log(
      Math.floor(x / this.scale) % 16,
      Math.floor(y / this.scale) % 16
    );
    // this.cx.fillStyle = "grey";
    // this.cx.stroke();
  }
}
