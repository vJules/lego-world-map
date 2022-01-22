import { writable } from "svelte/store";
import { DOT_COLOR } from "../constants/DotColor";
import type { IColorPickerItem } from "../models/Board";

const setInitialColorPickerItems = (): IColorPickerItem[] => {
  return Object.keys(DOT_COLOR).map((key) => {
    return {
      id: DOT_COLOR[key].id,
      count: DOT_COLOR[key].defaultCount,
      displayName: DOT_COLOR[key].displayName,
      hex: DOT_COLOR[key].hex,
      key,
    };
  });
};

export const currentColorKey = writable("white");

export const colorPickerItems = writable(setInitialColorPickerItems());
export const resetColorPickerItems = () =>
  colorPickerItems.set(setInitialColorPickerItems());
