import { Coord } from "types/Coord";
import { GuiElementType } from "types/GuiElementType";
import { GuiElementJSON } from "interfaces/gui/GuiElementJSON";

//generate a random uuid
const uuid = () => {
  let dt = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};

export abstract class GuiElement implements Coord {
  type: GuiElementType;
  originalData: GuiElementJSON;
  internalId: string; //unique id for this element
  esphomeId: string; //esphome id of the animation/image. or font
  name: string; //user choosen name
  data?: any;
  params?: any;
  x: number;
  y: number;
  zorder: number;

  isMoving: boolean = false; //is element actually being moved on canvas?

  //private internalId: number;
  private startedMovingAt: Coord = { x: 0, y: 0 };
  private lastMovingAt: Coord = { x: 0, y: 0 };

  constructor(guielementjson: GuiElementJSON) {
    if (!guielementjson.type) {
      throw new Error("type must be set");
    }
    this.internalId = guielementjson.internalId || uuid();
    this.esphomeId = guielementjson.esphomeId || "noesphomeid";
    this.name = guielementjson.name || "noname";
    this.originalData = guielementjson;
    this.x = guielementjson.x;
    this.y = guielementjson.y;
    this.zorder = guielementjson.zorder;
    this.type = guielementjson.type;
  }

  abstract getWidth(): number;
  abstract getHeight(): number;
  abstract drawToCanvas(ctx: CanvasRenderingContext2D): void;
  abstract drawGhostToCanvas(
    ctx: CanvasRenderingContext2D,
    coords: Coord
  ): void;

  abstract toYAML(): string;
  abstract toCPP(): string;
  abstract toGuiElementJSON(): GuiElementJSON;

  isAt(coords: Coord) {
    if (coords.x >= this.x && coords.x < this.x + this.getWidth())
      if (coords.y >= this.y && coords.y < this.y + this.getHeight())
        return true;
    return false;
  }

  beginMove(coords: Coord) {
    this.isMoving = true;
    this.startedMovingAt = coords;
    this.lastMovingAt = coords;
  }

  move(offset: Coord) {
    this.x += offset.x - this.lastMovingAt.x;
    this.y += offset.y - this.lastMovingAt.y;
    this.lastMovingAt = offset;
  }

  endMove() {
    this.isMoving = false;
  }

  hasMoved(): boolean {
    return this.startedMovingAt.x != this.x || this.startedMovingAt.y != this.y;
  }

  order(index: number) {
    this.zorder = index;
  }
}
