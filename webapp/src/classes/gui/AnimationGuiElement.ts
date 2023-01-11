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
      width: json.animation.width,
      height: json.animation.height,
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
    //TODO: handle global interval if fps set?
    const yaml = `  #${this.name}
  - id: "${this.esphomeId}"
    file: "${this.animation.path}"
    width: ${this.animation.width}
    height: ${this.animation.height}`;
    return yaml;
  }

  toCPP(): string {
    /*
    ESPHome doc: https://esphome.io/components/display/index.html#animation

      //Ingress shown animation Frame.
      id(my_animation).next_frame();
      // Draw the animation my_animation at position [x=0,y=0]
      it.image(0, 0, id(my_animation), COLOR_ON, COLOR_OFF);
    */
    //TODO: handle fps
    //TODO: handle binary images
    const cpp = `\t// ${this.name}\n\tid(${this.esphomeId}).next_frame();\n\tit.image(${this.x}, ${this.y}, id(${this.esphomeId}));\n`;
    return cpp;
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
