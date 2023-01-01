import { EspHomeFontJSON, TextBound } from "esphome/font/EspHomeFontJSON";
import { GuiElementJSON } from "gui/GuiElementJSON";

export interface FontGuiElementJSON extends GuiElementJSON {
  font: EspHomeFontJSON;
  text: string;
  bounds: TextBound;
}
