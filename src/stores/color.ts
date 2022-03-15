import { get, writable } from "svelte/store";
import { DOT_COLOR } from "../constants/DotColor";
import type { IColorPickerItem } from "../models/Board";

export const currentColorKey = writable("white");
export const isUnlimitedColorAmount = writable(false);

const setInitialColorPickerItems = (): IColorPickerItem[] => {
  return Object.keys(DOT_COLOR).map(key => ({
    id: DOT_COLOR[key].id,
    count: 0,
    limit: get(isUnlimitedColorAmount) ? Infinity : DOT_COLOR[key].defaultCount,
    displayName: DOT_COLOR[key].displayName,
    hex: DOT_COLOR[key].hex,
    rgb: DOT_COLOR[key].rgb,
    key,
  })
  );
};
>>>>>>> 2958a0b (initial image import)

export const colorPickerItems = writable(
  localStorage.getItem("colorPickerItems")
    ? (JSON.parse(localStorage.getItem("colorPickerItems")).map((item) => {
      // TODO: Don't manually handle setting Infinity for black color
      if (item.id === 11) {
        item.limit = Infinity;
      }
      return item;
    }) as IColorPickerItem[])
    : setInitialColorPickerItems()
);

isUnlimitedColorAmount.subscribe((isUnlimited) => {
  return colorPickerItems.update((items) => {
    return items.map((item) => ({
      ...item,
      limit: isUnlimited ? Infinity : DOT_COLOR[item.key].defaultCount
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
