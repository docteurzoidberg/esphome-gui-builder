import { EspHomeImageJSON } from "esphome/image/EspHomeImageJSON";
import { GuiElementJSON } from "gui/GuiElementJSON";

export interface ImageGuiElementJSON extends GuiElementJSON {
  image: EspHomeImageJSON;
}
