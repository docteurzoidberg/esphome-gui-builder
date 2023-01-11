import { EspHomeTextAlign } from "classes/esphome/EspHomeTextAlign";
import {
  EspHomeFontJSON,
  EspHomeFontTextBound,
} from "interfaces/esphome/EspHomeFontJSON";

import { GuiElementJSON } from "interfaces/gui/GuiElementJSON";
import { RGB24 } from "types/RGB";

export interface FontGuiElementJSON extends GuiElementJSON {
  font: EspHomeFontJSON;
  text: string;
  color?: RGB24;
  align?: EspHomeTextAlign;
  bounds: EspHomeFontTextBound;
}
