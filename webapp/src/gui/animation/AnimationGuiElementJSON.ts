import { EspHomeAnimationJSON } from "esphome/animation/EspHomeAnimationJSON";

export interface AnimationGuiElementJSON {
  id: string;
  name: string;
  x: number;
  y: number;
  zorder: number;
  animation: EspHomeAnimationJSON;
}
