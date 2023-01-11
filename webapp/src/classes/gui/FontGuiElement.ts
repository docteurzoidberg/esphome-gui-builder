import { EspHomeFont } from "classes/esphome/EspHomeFont";
import { EspHomeTextAlign } from "classes/esphome/EspHomeTextAlign";
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
  align?: EspHomeTextAlign;
  constructor(json: FontGuiElementJSON) {
    super({
      internalId: json.internalId,
      esphomeId: json.font.id,
      name: json.name,
      x: json.x,
      y: json.y,
      width: json.width || json.bounds.width,
      height: json.height || json.bounds.height,
      type: "text",
      zorder: json.zorder,
    });
    this.font = new EspHomeFont(json.font);
    this.text = json.text;
    this.bounds = json.bounds;
    this.resizable = true;
    if (json.align) this.align = json.align;
    if (json.color) this.color = json.color;
  }
  getWidth(): number {
    return this.width !== undefined ? this.width : this.bounds.width;
  }
  getHeight(): number {
    return this.height !== undefined ? this.height : this.bounds.height;
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
    //TODO: Handle global yaml color: ?
    const yaml = `  #${this.name}
  - id: "${this.esphomeId}"
    file: "${this.font.path}"
    size: ${this.font.height}
    glyphs: "${this.font.glyphstr.replace(/"/g, '\\"')}"\n`;
    return yaml;
  }
  toCPP(): string {
    /*
      ESPHome doc: https://esphome.io/components/display/index.html#drawing-static-text

        // Print the string "Hello World!" at [0,10]
        it.print(0, 10, id(my_font), "Hello World!");

        // Aligned on right edge
        it.print(it.get_width(), 0, id(my_font), TextAlign::TOP_RIGHT, "Right aligned");

         / Syntax is always: it.print(<x>, <y>, <font>, [color=COLOR_ON], [align=TextAlign::TOP_LEFT], <text>);
        it.print(0, 0, id(my_font), COLOR_ON, "Left aligned");

        it.printf(0, 0, id(my_font), "The sensor value is: %.1f", id(my_sensor).state);
        // If the sensor has the value 30.02, the result will be: "The sensor value is: 30.0"

    */

    //espace double quote in text
    const text = this.text.replace(/"/g, '\\"');
    const cpp = `\t// ${this.name}\n\tit.print(${this.x}, ${this.y}, id(${this.esphomeId}), "${text}");\n`;
    return cpp;
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
