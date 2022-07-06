import { writable } from "svelte/store";
import { DOT_COLOR } from "../constants/DotColor";
import type { IColorPickerItem } from "../models/Board";

const setInitialColorPickerItems = (): IColorPickerItem[] => {
  let colors = Object.keys(DOT_COLOR).map((key) => {
    return {
      id: DOT_COLOR[key].id,
      currentAmount: 0,
      amountLeft: DOT_COLOR[key].defaultCount,
      amountLimit: DOT_COLOR[key].defaultCount,
      displayName: DOT_COLOR[key].displayName,
      hex: DOT_COLOR[key].hex,
      key,
    };
  });
  return colors;
};

export const currentColorKey = writable("white");

export const colorPickerItems = writable(
  localStorage.getItem("colorPickerItems")
    ? (JSON.parse(localStorage.getItem("colorPickerItems")).map((item: IColorPickerItem) => {
      // TODO: Don't manually handle setting Infinity for black color
      if (item.amountLimit === null) {
        item.amountLimit = Infinity;
        item.amountLeft = Infinity;
      }
      return item;
    }) as IColorPickerItem[])
    : setInitialColorPickerItems()
);

export const resetColorPickerItems = () =>
  colorPickerItems.set(setInitialColorPickerItems());

export const removeColorPickerLimit = () => {
  colorPickerItems.update((items) => {
    return items.map((item) => {
      item.amountLimit = Infinity;
      item.amountLeft = Infinity;
      return item;
    });
  })
}

let timer;

const debounceColorPickerItems = (value) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    // TODO: Infinity gets turned into null when stringifying
    localStorage.setItem("colorPickerItems", JSON.stringify(value));
  }, 1000);
};

colorPickerItems.subscribe((value: IColorPickerItem[]) => debounceColorPickerItems(value));
