import {
  EspHomeFontJSON,
  EspHomeFontTextBound,
} from "interfaces/esphome/EspHomeFontJSON";
import { GuiElementJSON } from "interfaces/gui/GuiElementJSON";

export interface FontGuiElementJSON extends GuiElementJSON {
  font: EspHomeFontJSON;
  text: string;
  bounds: EspHomeFontTextBound;
}
