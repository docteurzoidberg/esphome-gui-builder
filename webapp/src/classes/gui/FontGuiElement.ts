import { EspHomeFont } from "classes/esphome/EspHomeFont";
import { GuiElement } from "classes/gui/GuiElement";
import { EspHomeFontTextBound } from "interfaces/esphome/EspHomeFontJSON";
import { FontGuiElementJSON } from "interfaces/gui/FontGuiElementJSON";
import { Coord } from "types/Coord";
import { RGB24 } from "types/RGB";

export class FontGuiElement extends GuiElement {
  font: EspHomeFont;
  text: string;
  bounds: EspHomeFontTextBound;
  color?: RGB24;
  constructor(json: FontGuiElementJSON) {
    super({
      internalId: json.internalId,
      esphomeId: json.font.id,
      name: json.name,
      x: json.x,
      y: json.y,
      type: "text",
      zorder: json.zorder,
    });
    this.font = new EspHomeFont(json.font);
    this.text = json.text;
    this.bounds = json.bounds;
    this.color = json.color;
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
    return '\t- id: "' + this.esphomeId + '"\n';
  }

  toCPP(): string {
    return "//not implemented, id:" + this.esphomeId + "\n";
  }

  toGuiElementJSON(): FontGuiElementJSON {
    return {
      internalId: this.internalId,
      esphomeId: this.esphomeId,
      name: this.name,
      x: this.x,
      y: this.y,
      type: "text",
      zorder: this.zorder,
      font: this.font.originalData,
      color: this.color,
      text: this.text,
      bounds: this.bounds,
    };
  }
}
