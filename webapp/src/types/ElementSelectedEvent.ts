import { GuiElement } from "classes/gui/GuiElement";

export type ElementSelectedEvent = {
  element: GuiElement | undefined;
  index: number | undefined;
};
