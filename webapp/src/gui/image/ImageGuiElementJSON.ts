import { EspHomeImageJSON } from "esphome/image/EspHomeImageJSON";

export interface ImageGuiElementJSON {
  id: string;
  name: string;
  x: number;
  y: number;
  zorder: number;
  image: EspHomeImageJSON;
}
