import { EspHomeFont } from "esphome/font/EspHomeFont";
import { TextBound } from "esphome/font/EspHomeFontJSON";
import { GuiElement } from "gui/GuiElement";
import { FontGuiElementJSON } from "gui/font/FontGuiElementJSON";

export class FontGuiElement extends GuiElement {
  font: EspHomeFont;
  text: string;
  bounds: TextBound;
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
}
