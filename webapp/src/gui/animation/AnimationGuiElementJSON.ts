import { EspHomeAnimationJSON } from "esphome/animation/EspHomeAnimationJSON";
import { GuiElementJSON } from "gui/GuiElementJSON";

export interface AnimationGuiElementJSON extends GuiElementJSON {
  animation: EspHomeAnimationJSON;
}
