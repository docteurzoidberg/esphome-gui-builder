import { Coord } from "types/Coord";
import { GuiElementType } from "types/GuiElementType";
import { GuiElementJSON } from "interfaces/gui/GuiElementJSON";

export abstract class GuiElement implements Coord {
  type: GuiElementType;
  originalData: GuiElementJSON;
  id: string;
  name: string;
  data?: any;
  params?: any;
  x: number;
  y: number;
  zorder: number;

  isMoving: boolean = false;

  //private internalId: number;
  private startedMovingAt: Coord = { x: 0, y: 0 };

  constructor(guielementjson: GuiElementJSON) {
    if (!guielementjson.type) {
      throw new Error("type must be set");
    }
    //this.internalId = new Date().getTime();
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
  abstract drawGhostToCanvas(
    ctx: CanvasRenderingContext2D,
    coords: Coord
  ): void;

  abstract toYAML(): string;
  abstract toCPP(): string;

  isAt(coords: Coord) {
    if (coords.x >= this.x && coords.x < this.x + this.getWidth())
      if (coords.y >= this.y && coords.y < this.y + this.getHeight())
        return true;
    return false;
  }

  beginMove(coords: Coord) {
    this.isMoving = true;
    this.startedMovingAt = coords;
  }

  move(offset: Coord) {
    this.x += offset.x - this.startedMovingAt.x;
    this.y += offset.y - this.startedMovingAt.y;
    this.startedMovingAt = offset;
  }

  endMove() {
    this.isMoving = false;
  }
}
