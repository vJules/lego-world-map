import type { IDot } from "../models/Board";
import { colorPickerItems, resetColorPickerItems } from "../stores/color";
import type { CanvasDisplay } from "./CanvasDisplay";
import { currentColorKey } from "../stores/color";
import { get } from "svelte/store";
const X_SQUARES = 8;
const Y_SQUARES = 5;
const DOTS_PER_SQUARE = 16;
const DEFAULT_COLOR = "black";

export class Board {
    dots: IDot[][];
    xSquares: number;
    ySquares: number;
    dotsPerSquare: number;
    renderer: CanvasDisplay;
    timer: NodeJS.Timeout;

    constructor({ xSquares = X_SQUARES, ySquares = Y_SQUARES, dotsPerSquare = DOTS_PER_SQUARE } = {}) {
        this.xSquares = xSquares;
        this.ySquares = ySquares;
        this.dotsPerSquare = dotsPerSquare;
        const dots = (JSON.parse(localStorage.getItem("board")) as IDot[][]) || this.createBoard();
        this.dots = dots;
    }

    addRenderer(renderer: CanvasDisplay) {
        this.renderer = renderer;
        renderer.drawDots(this.dots);
    };

    createBoard() {
        return Array.from({ length: this.ySquares * this.dotsPerSquare }, () =>
            Array.from({ length: this.xSquares * this.dotsPerSquare }, () => Object.assign({}, { color: DEFAULT_COLOR }))
        );
    };

    resetBoard() {
        resetColorPickerItems();
        this.dots = this.createBoard();
        this.renderer.drawDots(this.dots);
    };

    updateDots(dots: { x: number, y: number }[]) {
        const color = get(currentColorKey);
        dots.forEach(({ x, y }) => {
            const currentColorPicker = get(colorPickerItems).find(
                (colorPickerItem) => colorPickerItem.key === color
            );
            const dotToChange = this.dots[y] && this.dots[y][x];
            if (dotToChange && !(!currentColorPicker || currentColorPicker.count <= 0)) {
                const previousColor = dotToChange.color;
                colorPickerItems.update((colorPickerItems) => {
                    return colorPickerItems.map((colorPickerItem) => {
                        const newColorPickerItem = {
                            ...colorPickerItem,
                        };
                        if (colorPickerItem.key === previousColor) {
                            newColorPickerItem.count += 1;
                        }
                        if (colorPickerItem.key === color) {
                            newColorPickerItem.count -= 1;
                        }
                        return newColorPickerItem;
                    });
                });
                dotToChange.color = color;
            };
        });
        this.renderer.drawDots(this.dots);
        this.updateLocalStorage();
    }

    updateLocalStorage() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            console.log('updating storage')
            localStorage.setItem("board", JSON.stringify(this.dots));
        }, 1000);
    };
}
