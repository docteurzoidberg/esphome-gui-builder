import { EspHomeAnimation } from "classes/esphome/EspHomeAnimation";
import { AnimationGuiElementJSON } from "interfaces/gui/AnimationGuiElementJSON";
import { GuiElement } from "classes/gui/GuiElement";

export class AnimationGuiElement extends GuiElement {
  animation: EspHomeAnimation;
  constructor(json: AnimationGuiElementJSON) {
    super({
      id: json.id,
      name: json.name,
      x: json.x,
      y: json.y,
      type: "animation",
      zorder: json.zorder,
    });
    this.animation = new EspHomeAnimation(json.animation);
  }
  getWidth(): number {
    return this.animation.width;
  }
  getHeight(): number {
    return this.animation.height;
  }
  drawToCanvas(ctx: CanvasRenderingContext2D): void {
    this.animation.update();
    const image = this.animation.getImageData();
    if (!image) return;
    ctx.putImageData(image, this.x, this.y);
  }
}
