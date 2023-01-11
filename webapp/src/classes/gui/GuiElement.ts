import { Coord } from "types/Coord";
import { GuiElementType } from "types/GuiElementType";
import { GuiElementJSON } from "interfaces/gui/GuiElementJSON";
import { Size } from "types/Size";
import { Rect } from "types/Rect";
import { HandleCorner } from "types/HandleCorner";

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

export abstract class GuiElement implements Coord, Size {
  type: GuiElementType;
  originalData: GuiElementJSON;
  internalId: string; //unique id for this element
  esphomeId: string; //esphome id of the animation/image. or font
  name: string; //user choosen name
  data?: any;
  params?: any;
  x: number;
  y: number;
  width: number;
  height: number;
  zorder: number;

  resizable: boolean = false;

  isMoving: boolean = false; //is element actually being moved on canvas?
  isResizing: boolean = false; //is element actually being resized on canvas?

  //private internalId: number;
  private startedMovingAt: Coord = { x: 0, y: 0 };
  private lastMovingAt: Coord = { x: 0, y: 0 };
  private resizeCorner: HandleCorner | null = null;

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
    this.width = guielementjson.width || 0;
    this.height = guielementjson.height || 0;
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
    if (coords.x > this.x && coords.x <= this.x + this.getWidth())
      if (coords.y > this.y && coords.y <= this.y + this.getHeight())
        return true;
    return false;
  }

  getScaledRect(
    x: number,
    y: number,
    canvasscale: number,
    gridwidth: number = 0
  ): Rect {
    const elemWidth = this.getWidth();
    const elemHeight = this.getHeight();
    const elemScaledWidth =
      elemWidth * canvasscale + gridwidth * (elemWidth - 1);
    const elemScaledHeight =
      elemHeight * canvasscale + gridwidth * (elemHeight - 1);
    return {
      x: x * canvasscale + gridwidth * (x + 1),
      y: y * canvasscale + gridwidth * (y + 1),
      w: elemScaledWidth,
      h: elemScaledHeight,
    };
  }

  beginMove(coords: Coord) {
    this.isMoving = true;
    this.startedMovingAt = coords;
    this.lastMovingAt = coords;
  }

  beginResize(selectedHandleCorner: HandleCorner, coords: Coord) {
    this.isResizing = true;
    this.resizeCorner = selectedHandleCorner;
    this.startedMovingAt = coords;
    this.lastMovingAt = coords;
  }

  resize(offset: Coord) {
    if (!this.isResizing || !this.resizeCorner) return;

    const mouseMovedX = offset.x - this.lastMovingAt.x;
    const mouseMovedY = offset.y - this.lastMovingAt.y;

    switch (this.resizeCorner) {
      case HandleCorner.TopLeft:
        this.x += mouseMovedX;
        this.y += mouseMovedY;
        this.width -= mouseMovedX;
        this.height -= mouseMovedY;
        break;
      case HandleCorner.TopRight:
        this.y += mouseMovedY;
        this.width += mouseMovedX;
        this.height -= mouseMovedY;
        break;
      case HandleCorner.BottomLeft:
        this.x += mouseMovedX;
        this.width -= mouseMovedX;
        this.height += mouseMovedY;
        break;
      case HandleCorner.BottomRight:
        this.width += mouseMovedX;
        this.height += mouseMovedY;
        break;
    }

    //also switch corner
    if (this.width < 0 && this.resizeCorner == HandleCorner.TopLeft)
      this.resizeCorner = HandleCorner.TopRight;
    else if (this.width < 0 && this.resizeCorner == HandleCorner.TopRight)
      this.resizeCorner = HandleCorner.TopLeft;
    else if (this.width < 0 && this.resizeCorner == HandleCorner.BottomLeft)
      this.resizeCorner = HandleCorner.BottomRight;
    else if (this.width < 0 && this.resizeCorner == HandleCorner.BottomRight)
      this.resizeCorner = HandleCorner.BottomLeft;
    else if (this.height < 0 && this.resizeCorner == HandleCorner.TopLeft)
      this.resizeCorner = HandleCorner.BottomLeft;
    else if (this.height < 0 && this.resizeCorner == HandleCorner.TopRight)
      this.resizeCorner = HandleCorner.BottomRight;
    else if (this.height < 0 && this.resizeCorner == HandleCorner.BottomLeft)
      this.resizeCorner = HandleCorner.TopLeft;
    else if (this.height < 0 && this.resizeCorner == HandleCorner.BottomRight)
      this.resizeCorner = HandleCorner.TopRight;

    //switch origin when negative width/height
    if (this.width < 0) {
      this.x += this.width;
      this.width = -this.width;
    }
    if (this.height < 0) {
      this.y += this.height;
      this.height = -this.height;
    }

    this.lastMovingAt = offset;
  }

  endResize() {
    this.isResizing = false;
    this.resizeCorner = null;
  }

  move(offset: Coord) {
    if (!this.isMoving) return;
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
