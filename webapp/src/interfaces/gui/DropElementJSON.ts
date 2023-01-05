import { GuiElementType } from "types/GuiElementType";

export interface DropElementJSON {
  //id: string;
  //name: string;
  type: GuiElementType;
  originalData?: any;
  params?: any;
}
