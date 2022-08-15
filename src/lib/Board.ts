import type { IDot } from "../models/Board";
import { colorPickerItems, resetColorPickerItems } from "../stores/color";
import type { CanvasDisplay } from "./CanvasDisplay";
import { currentColorKey } from "../stores/color";
import { get } from "svelte/store";
const DEFAULT_COLOR = "none";

export class Board {
    dots: IDot[][];
    xSquares: number;
    ySquares: number;
    dotsPerSquare: number;
    renderer: CanvasDisplay;
    timer: NodeJS.Timeout;

    constructor({ xSquares, ySquares, dotsPerSquare }) {
        this.xSquares = xSquares;
        this.ySquares = ySquares;
        this.dotsPerSquare = dotsPerSquare;
        const dots = (JSON.parse(localStorage.getItem("board")) as IDot[][]) || this.createBoard();
        this.dots = dots;
    }

    addRenderer(renderer: CanvasDisplay) {
        this.renderer = renderer;
        this.renderer.drawDots(this.dots);
    };

    createBoard(): IDot[][] {
        return Array.from({ length: this.ySquares * this.dotsPerSquare }, () =>
            Array.from({ length: this.xSquares * this.dotsPerSquare }, () => Object.assign({}, { color: DEFAULT_COLOR }))
        );
    };

    drawBoard() {
        this.renderer.drawDots(this.dots);
    }

    updatePlates({ xSquares, ySquares }) {
        this.xSquares = xSquares;
        this.ySquares = ySquares;
        this.dots = this.createBoard();
        this.renderer.drawDots(this.dots);
        this.updateLocalStorage();
    }

    resetBoard() {
        resetColorPickerItems();
        this.dots = this.createBoard();
        this.renderer.drawDots(this.dots);
        this.updateLocalStorage();
    };

    updateDots(dots: { x: number, y: number }[]) {
        const color = get(currentColorKey);
        dots.forEach(({ x, y }) => {
            const currentColorPicker = get(colorPickerItems).find(
                (colorPickerItem) => colorPickerItem.key === color
            );
            const dotToChange = this.dots[y] && this.dots[y][x];
            if (dotToChange && !(!currentColorPicker || currentColorPicker.count >= currentColorPicker.limit)) {
                const previousColor = dotToChange.color;
                colorPickerItems.update((colorPickerItems) => {
                    return colorPickerItems.map((colorPickerItem) => {
                        const newColorPickerItem = {
                            ...colorPickerItem,
                        };
                        if (colorPickerItem.key === previousColor) {
                            newColorPickerItem.count -= 1;
                        }
                        if (colorPickerItem.key === color) {
                            newColorPickerItem.count += 1;
                        }
                        return newColorPickerItem;
                    });
                });
                dotToChange.color = color;
            };
        });
        this.drawBoard();
        this.updateLocalStorage();
    }

    updateLocalStorage() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            localStorage.setItem("board", JSON.stringify(this.dots));
        }, 1000);
    };
}
