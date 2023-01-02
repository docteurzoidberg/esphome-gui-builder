import { EspHomeFont } from "classes/esphome/EspHomeFont";
import { GuiElement } from "classes/gui/GuiElement";
import { EspHomeFontTextBound } from "interfaces/esphome/EspHomeFontJSON";
import { FontGuiElementJSON } from "interfaces/gui/FontGuiElementJSON";

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
}
