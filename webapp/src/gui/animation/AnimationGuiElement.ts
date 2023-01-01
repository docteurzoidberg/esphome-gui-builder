import { EspHomeAnimation } from "esphome/animation/EspHomeAnimation";
import { AnimationGuiElementJSON } from "gui/animation/AnimationGuiElementJSON";
import { GuiElement } from "gui/GuiElement";

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
