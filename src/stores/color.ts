import { get, writable } from "svelte/store";
import { DOT_COLORS } from "../constants/DotColors";
import type { IColorPickerItem } from "../models/Board";

export const currentColorKey = writable("white");
export const isUnlimitedColorAmount = writable(false);

const setInitialColorPickerItems = (): IColorPickerItem[] => {
  return Object.keys(DOT_COLORS).map(key => ({
    id: DOT_COLORS[key].id,
    count: 0,
    limit: get(isUnlimitedColorAmount) ? Infinity : DOT_COLORS[key].defaultCount,
    displayName: DOT_COLORS[key].displayName,
    hex: DOT_COLORS[key].hex,
    rgb: DOT_COLORS[key].rgb,
    key,
  })
  );
};

export const colorPickerItems = writable(
  localStorage.getItem("colorPickerItems")
    ? (JSON.parse(localStorage.getItem("colorPickerItems")) as IColorPickerItem[])
    : setInitialColorPickerItems()
);

isUnlimitedColorAmount.subscribe((isUnlimited) => {
  return colorPickerItems.update((items) => {
    return items.map((item) => ({
      ...item,
      limit: isUnlimited ? Infinity : DOT_COLORS[item.key]?.defaultCount
    }))
  })
})

export const resetColorPickerItems = () =>
  colorPickerItems.set(setInitialColorPickerItems());

let timer;

const debounceColorPickerItems = (value) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    // TODO: Infinity gets turned into null when stringifying
    localStorage.setItem("colorPickerItems", JSON.stringify(value));
  }, 1000);
};

colorPickerItems.subscribe((value: IColorPickerItem[]) => debounceColorPickerItems(value));
