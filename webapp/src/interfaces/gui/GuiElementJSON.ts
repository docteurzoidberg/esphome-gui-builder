import { GuiElementType } from "types/GuiElementType";

export interface GuiElementJSON {
  internalId?: string;
  esphomeId?: string;
  name?: string;
  type?: GuiElementType;
  x: number;
  y: number;
  zorder: number;
}
