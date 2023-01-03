import { GuiElement } from "classes/gui/GuiElement";

export type ElementRemovedEvent = {
  element: GuiElement;
  index: number;
};
export type ElementSelectedEvent = {
  element: GuiElement | undefined;
  index: number | undefined;
};
