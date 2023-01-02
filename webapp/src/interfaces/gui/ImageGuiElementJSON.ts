import { EspHomeImageJSON } from "interfaces/esphome/EspHomeImageJSON";
import { GuiElementJSON } from "interfaces/gui/GuiElementJSON";

export interface ImageGuiElementJSON extends GuiElementJSON {
  image: EspHomeImageJSON;
}
