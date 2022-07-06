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
        this.updateLocalStorage();
    };

    updateDots(dots: { x: number, y: number }[]) {
        const currentColor = get(currentColorKey);
        dots.forEach(({ x, y }) => {
            const currentColorPicker = get(colorPickerItems).find(
                (colorPickerItem) => colorPickerItem.key === currentColor
            );
            const dotToChange = this.dots[y] && this.dots[y][x];
            if (dotToChange && !(!currentColorPicker || currentColorPicker.amountLeft <= 0)) {
                const previousColor = dotToChange.color;
                dotToChange.color = currentColor;
                colorPickerItems.update((colorPickerItems) => {
                    // TODO: Don't loop through all the items when updating one of them.
                    return colorPickerItems.map((colorPickerItem) => {
                        const newColorPickerItem = {
                            ...colorPickerItem,
                        };
                        if (colorPickerItem.key === previousColor) {
                            newColorPickerItem.currentAmount -= 1;
                        }
                        if (colorPickerItem.key === currentColor) {
                            newColorPickerItem.currentAmount += 1;
                        }
                        newColorPickerItem.amountLeft = newColorPickerItem.amountLimit === Infinity ? Infinity : newColorPickerItem.amountLimit - newColorPickerItem.currentAmount;
                        return newColorPickerItem;
                    });
                });
            };
        });
        this.renderer.drawDots(this.dots);
        this.updateLocalStorage();
    }

    updateLocalStorage() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            localStorage.setItem("board", JSON.stringify(this.dots));
        }, 1000);
    };
}
