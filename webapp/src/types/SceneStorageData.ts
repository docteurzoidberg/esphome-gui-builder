import { GuiElementJSON } from "interfaces/gui/GuiElementJSON";

export type SceneStorageData = {
  version: string;
  elements: GuiElementJSON[];
};
