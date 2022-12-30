import { GuiElementJSON } from "./GuiElementJSON";

export abstract class GuiElement {
  originalData: GuiElementJSON;
  id: string;
  name: string;
  data?: any;
  params?: any;
  x: number;
  y: number;
  zorder: number;
  type: string;

  constructor(guielementjson: GuiElementJSON) {
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

  toJSON(): string {
    const jsonData: GuiElementJSON = {
      x: this.x,
      y: this.y,
      id: this.id,
      type: this.type,
      name: this.name,
      zorder: this.zorder,
      params: this.params,
    };
    return JSON.stringify(jsonData);
  }
}
