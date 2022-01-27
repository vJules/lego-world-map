import { writable } from "svelte/store";
import { DOT_COLOR } from "../constants/DotColor";
import type { IBoard, IColorPickerItem } from "../models/Board";

const setInitialColorPickerItems = (): IColorPickerItem[] => {
  let colors = Object.keys(DOT_COLOR).map((key) => {
    return {
      id: DOT_COLOR[key].id,
      count: DOT_COLOR[key].defaultCount,
      displayName: DOT_COLOR[key].displayName,
      hex: DOT_COLOR[key].hex,
      key,
    };
  });
  return colors;
};

export const currentColorKey = writable("white");

export const colorPickerItems = writable(
  (JSON.parse(localStorage.getItem("colorPickerItems")).map((item) => {
    // TODO: Don't manually handle setting Infinity for black color
    if (item.id === 11) {
      item.count = Infinity;
    }
    return item;
  }) as IColorPickerItem[]) || setInitialColorPickerItems()
);

export const resetColorPickerItems = () =>
  colorPickerItems.set(setInitialColorPickerItems());

let timer;

const debounce = (value) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    // TODO: Infinity gets turned into null when stringifying
    localStorage.setItem("colorPickerItems", JSON.stringify(value));
  }, 1000);
};

colorPickerItems.subscribe((value: IColorPickerItem[]) => debounce(value));
