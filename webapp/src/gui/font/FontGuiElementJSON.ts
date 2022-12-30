import { EspHomeFontJSON, TextBound } from "esphome/font/EspHomeFontJSON";

export interface FontGuiElementJSON {
  id: string;
  name: string;
  x: number;
  y: number;
  zorder: number;
  font: EspHomeFontJSON;
  text: string;
  bounds: TextBound;
}
