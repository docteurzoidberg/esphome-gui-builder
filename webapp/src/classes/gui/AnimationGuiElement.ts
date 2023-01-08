import { EspHomeAnimation } from "classes/esphome/EspHomeAnimation";
import { AnimationGuiElementJSON } from "interfaces/gui/AnimationGuiElementJSON";
import { GuiElement } from "classes/gui/GuiElement";
import { Coord } from "types/Coord";

export class AnimationGuiElement extends GuiElement {
  animation: EspHomeAnimation;
  constructor(json: AnimationGuiElementJSON) {
    super({
      esphomeId: json.animation.id,
      internalId: json.internalId,
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
    const yaml = `  #${this.name}
  - id: "${this.esphomeId}"
    file: "${this.animation.path}"
    width: ${this.animation.width}
    height: ${this.animation.height}`;
    return yaml;
  }

  toCPP(): string {
    return (
      "//TODO: draw animation frame and calling nextframe, id:" +
      this.esphomeId +
      "\n"
    );
  }
  toGuiElementJSON(): AnimationGuiElementJSON {
    return {
      internalId: this.internalId,
      esphomeId: this.esphomeId,
      name: this.name,
      x: this.x,
      y: this.y,
      type: "animation",
      zorder: this.zorder,
      animation: this.animation.originalData,
    };
  }
}
