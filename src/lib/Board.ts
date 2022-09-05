import type { IDot } from "../models/Board";
import { colorPickerItems, resetColorPickerItems } from "../stores/color";
import type { CanvasDisplay } from "./CanvasDisplay";
import { currentColorKey } from "../stores/color";
import { get } from "svelte/store";

interface InputDot {
    x: number;
    y: number;
    dotColorKey: string;
}

export class Board {
    dots: IDot[][];
    overlayDots: IDot[][];
    updateIsUpdatingOverlayCallbacks: Array<(isAddingOverlay: boolean) => void>;
    isAddingOverlay: boolean;
    xSquares: number;
    ySquares: number;
    dotsPerSquare: number;
    renderer: CanvasDisplay;
    timer: NodeJS.Timeout;

    constructor({ xSquares, ySquares, dotsPerSquare }) {
        this.xSquares = xSquares;
        this.ySquares = ySquares;
        this.dotsPerSquare = dotsPerSquare;
        this.updateIsUpdatingOverlayCallbacks = [];
        const dots = (JSON.parse(localStorage.getItem("board")) as IDot[][]) || this.createBoard();
        this.dots = dots;
    }

    addRenderer(renderer: CanvasDisplay) {
        this.renderer = renderer;
        this.renderer.drawDots(this.dots);
    };

    createBoard(): IDot[][] {
        return Array.from({ length: this.ySquares * this.dotsPerSquare }, () =>
            Array.from({ length: this.xSquares * this.dotsPerSquare }, () => Object.assign({}, { color: undefined }))
        );
    };

    drawBoard() {
        this.renderer.drawDots(this.dots);
    }

    drawOverlay() {
        this.drawBoard();
        this.renderer.drawOverlayDots(this.overlayDots);
        this.isAddingOverlay = true;
        this.updateIsUpdatingOverlayCallbacks.forEach(callback => callback(this.isAddingOverlay));
    }

    addOverlayDots() {
        const inputDots: InputDot[] = [];
        // TODO: Shouldn't have to change between data structures to add the dots
        this.overlayDots.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                inputDots.push({
                    dotColorKey: column.color,
                    x: columnIndex,
                    y: rowIndex,
                } as InputDot)
            })
        });
        this.updateDots(inputDots);
        this.drawBoard();
        this.isAddingOverlay = false;
        this.updateIsUpdatingOverlayCallbacks.forEach(callback => callback(this.isAddingOverlay));
    }

    moveOverlayDots(xIncrease: number, yIncrease: number) {
        const newDots: IDot[][] = [];
        this.overlayDots.forEach((row, rowIndex) => {
            if (!newDots[rowIndex + yIncrease]) {
                newDots[rowIndex + yIncrease] = [];
            }
            row.forEach((column, columnIndex) => {
                newDots[rowIndex + yIncrease][columnIndex + xIncrease] = { color: column?.color };
            });
        });
        this.overlayDots = newDots;
        this.drawOverlay();
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


    updateOverlayDots(dots: InputDot[]) {
        const newDots = [] as IDot[][];
        dots.forEach(({ x, y, dotColorKey }) => {
            const dot = { color: dotColorKey } as IDot;
            if (!newDots[y]) {
                newDots[y] = [];
                if (!newDots[y][x]) {
                    newDots[y][x] = dot;
                }
            } else {
                newDots[y][x] = dot;
            }
        });
        this.overlayDots = newDots;
        this.drawOverlay();
    }

    updateDots(dots: InputDot[]) {
        const currentColorPickerKey = get(currentColorKey);
        dots.forEach(({ x, y, dotColorKey }) => {
            const colorKeyToUse = dotColorKey ?? currentColorPickerKey;
            const currentColorPicker = get(colorPickerItems).find(
                (colorPickerItem) => colorPickerItem.key === colorKeyToUse
            );
            const dotToChange = this.dots[y] && this.dots[y][x];
            if (dotToChange && (!(!currentColorPicker || currentColorPicker.count >= currentColorPicker.limit) || currentColorPickerKey === undefined)) {
                const previousColor = dotToChange.color;
                colorPickerItems.update((colorPickerItems) => {
                    return colorPickerItems.map((colorPickerItem) => {
                        const newColorPickerItem = {
                            ...colorPickerItem,
                        };
                        if (colorPickerItem.key === previousColor) {
                            newColorPickerItem.count -= 1;
                        }
                        if (colorPickerItem.key === colorKeyToUse) {
                            newColorPickerItem.count += 1;
                        }
                        return newColorPickerItem;
                    });
                });
                dotToChange.color = colorKeyToUse;
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

    onUpdatingOverlayChange(callbackFn: (isUpdatingOverlay: boolean) => void) {
        this.updateIsUpdatingOverlayCallbacks.push(callbackFn);
    }
}
