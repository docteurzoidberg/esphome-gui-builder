import { GuiElementType } from "types/GuiElementType";

export interface GuiElementJSON {
  id: string;
  name: string;
  type?: GuiElementType;
  x: number;
  y: number;
  zorder: number;
}
