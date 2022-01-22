export interface IBoard {
  squareRows: IDotsSquare[][];
}

export interface IDotsSquare {
  dotRows: IDot[][];
}
export interface IDot {
  color: string;
}

export interface IColorPickerItem {
  id: string;
  displayName: string;
  hex: string;
  count: number;
  key: string;
}
