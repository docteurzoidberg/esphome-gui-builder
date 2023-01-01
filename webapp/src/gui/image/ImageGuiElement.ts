import { EspHomeImage } from "esphome/image/EspHomeImage";
import { GuiElement } from "gui/GuiElement";
import { ImageGuiElementJSON } from "gui/image/ImageGuiElementJSON";

export class ImageGuiElement extends GuiElement {
  image: EspHomeImage;
  constructor(json: ImageGuiElementJSON) {
    super({
      id: json.id,
      name: json.name,
      x: json.x,
      y: json.y,
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
}
