import { EspHomeFont } from "classes/esphome/EspHomeFont";
import { GuiElement } from "classes/gui/GuiElement";
import { EspHomeFontTextBound } from "interfaces/esphome/EspHomeFontJSON";
import { FontGuiElementJSON } from "interfaces/gui/FontGuiElementJSON";
import { Coord } from "types/Coord";

export class FontGuiElement extends GuiElement {
  font: EspHomeFont;
  text: string;
  bounds: EspHomeFontTextBound;
  constructor(json: FontGuiElementJSON) {
    super({
      id: json.id,
      name: json.name,
      x: json.x,
      y: json.y,
      type: "text",
      zorder: json.zorder,
    });
    this.font = new EspHomeFont(json.font);
    this.text = json.text;
    this.bounds = json.bounds;
  }
  getWidth(): number {
    return this.bounds.width;
  }
  getHeight(): number {
    return this.bounds.height;
  }
  drawToCanvas(ctx: CanvasRenderingContext2D): void {
    const result = this.font.render(this.text);
    if (!result) return;
    ctx.putImageData(result.image, this.x, this.y);
  }
  drawGhostToCanvas(ctx: CanvasRenderingContext2D, coords: Coord): void {
    const result = this.font.render(this.text);
    if (!result) return;
    ctx.putImageData(result.image, coords.x, coords.y);
  }
  toYAML(): string {
    throw new Error("Method not implemented.");
  }
  toCPP(): string {
    throw new Error("Method not implemented.");
  }
  toGuiElementJSON(): FontGuiElementJSON {
    return {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
      type: "text",
      zorder: this.zorder,
      font: this.font.originalData,
      text: this.text,
      bounds: this.bounds,
    };
  }
}
