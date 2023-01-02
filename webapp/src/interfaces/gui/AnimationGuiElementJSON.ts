import { EspHomeAnimationJSON } from "interfaces/esphome/EspHomeAnimationJSON";
import { GuiElementJSON } from "interfaces/gui/GuiElementJSON";

export interface AnimationGuiElementJSON extends GuiElementJSON {
  animation: EspHomeAnimationJSON;
}
