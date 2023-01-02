import { Coord } from "types/Coord";
import { GuiElementType } from "types/GuiElementType";
import { GuiElementJSON } from "interfaces/gui/GuiElementJSON";

export abstract class GuiElement implements Coord {
  originalData: GuiElementJSON;
  id: string;
  name: string;
  data?: any;
  params?: any;
  x: number;
  y: number;
  zorder: number;
  type: GuiElementType;

  constructor(guielementjson: GuiElementJSON) {
    if (!guielementjson.type) {
      throw new Error("type must be set");
    }
    this.originalData = guielementjson;
    this.id = guielementjson.id;
    this.name = guielementjson.name;
    this.x = guielementjson.x;
    this.y = guielementjson.y;
    this.zorder = guielementjson.zorder;
    this.type = guielementjson.type;
  }

  abstract getWidth(): number;
  abstract getHeight(): number;
  abstract drawToCanvas(ctx: CanvasRenderingContext2D): void;

  isAt(coords: Coord) {
    if (coords.x >= this.x && coords.x < this.x + this.getWidth())
      if (coords.y >= this.y && coords.y < this.y + this.getHeight())
        return true;
    return false;
  }
}
