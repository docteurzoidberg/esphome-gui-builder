import { EspHomeImage } from "classes/esphome/EspHomeImage";
import { GuiElement } from "classes/gui/GuiElement";
import { ImageGuiElementJSON } from "interfaces/gui/ImageGuiElementJSON";
import { Coord } from "types/Coord";

export class ImageGuiElement extends GuiElement {
  image: EspHomeImage;
  constructor(json: ImageGuiElementJSON) {
    super({
      internalId: json.internalId,
      esphomeId: json.image.id,
      name: json.name,
      x: json.x,
      y: json.y,
      width: json.image.width,
      height: json.image.height,
      type: "image",
      zorder: json.zorder,
    });
    this.image = new EspHomeImage(json.image);
  }
  getWidth(): number {
    return this.image.width;
  }
  getHeight(): number {
    return this.image.height;
  }
  drawToCanvas(ctx: CanvasRenderingContext2D): void {
    let img = new Image();
    img.src = this.image.dataurl;
    ctx.drawImage(img, this.x, this.y);
  }
  drawGhostToCanvas(ctx: CanvasRenderingContext2D, coords: Coord): void {
    let img = new Image();
    img.src = this.image.dataurl;
    ctx.drawImage(img, coords.x, coords.y);
  }

  toYAML(): string {
    const yaml = `  #${this.name}
  - id: "${this.esphomeId}"
    file: "${this.image.path}"
    width: ${this.image.width}
    height: ${this.image.height}
    type: ${this.image.type}\n`;
    return yaml;
  }
  /*
  toYAML(): string {
    return '\t- id: "' + this.esphomeId + '"\n';
  }
  */
  toCPP(): string {
    return "//TODO: draw image, id:" + this.esphomeId + "\n";
  }
  toGuiElementJSON(): ImageGuiElementJSON {
    return {
      internalId: this.internalId,
      esphomeId: this.esphomeId,
      name: this.name,
      x: this.x,
      y: this.y,
      type: "image",
      zorder: this.zorder,
      image: this.image.originalData,
    };
  }
}
