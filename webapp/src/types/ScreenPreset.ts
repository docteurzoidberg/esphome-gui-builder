import { RGB24 } from "./RGB";

export type ScreenPreset = {
  name: string;
  width: number;
  height: number;
  scale: number;
  showgrid: boolean;
  gridsize: number;
  colormode: string;
  background: RGB24;
};
