import type { RGBColor } from "../models/RGBColor";

const rbgComponentToHex = (c: number) => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return (
    "#" + rbgComponentToHex(r) + rbgComponentToHex(g) + rbgComponentToHex(b)
  );
};

export const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16),
      }
    : null;
};

export const distanceBetweenRGB = (a: RGBColor, b: RGBColor) =>
  Math.sqrt(
    Math.pow(a.red - b.red, 2) +
      Math.pow(a.green - b.green, 2) +
      Math.pow(a.blue - b.blue, 2)
  );
