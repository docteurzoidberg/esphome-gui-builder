import { EspHomeAnimation } from "classes/esphome/EspHomeAnimation";
import { AnimationGuiElementJSON } from "interfaces/gui/AnimationGuiElementJSON";
import { GuiElement } from "classes/gui/GuiElement";
import { Coord } from "types/Coord";

export class AnimationGuiElement extends GuiElement {
  toGuiElementJSON(): AnimationGuiElementJSON {
    return {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
      type: "animation",
      zorder: this.zorder,
      animation: this.animation.originalData,
    };
  }
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
  drawGhostToCanvas(ctx: CanvasRenderingContext2D, coords: Coord): void {
    this.animation.update();
    const image = this.animation.getImageData();
    if (!image) return;
    ctx.putImageData(image, coords.x, coords.y);
  }
  toYAML(): string {
    throw new Error("Method not implemented.");
  }
  toCPP(): string {
    throw new Error("Method not implemented.");
  }
}
