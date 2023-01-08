import {
  EspHomeFontGlyph,
  EspHomeFontJSON,
  EspHomeFontRenderResult,
  EspHomeFontTextBound,
} from "interfaces/esphome/EspHomeFontJSON";

export class EspHomeFont implements EspHomeFontJSON {
  id: string; //esphome id
  originalData: EspHomeFontJSON;
  name: string;
  path: string;
  height: number;
  glyphstr: string;
  glyphs: EspHomeFontGlyph[];
  data: number[];

  private _tempCanvas: HTMLCanvasElement;

  getGlyphBitmap(start: number, width: number, height: number) {
    if (!this.originalData) return;
    if (width == 0 || height == 0) return;
    this._tempCanvas.width = width;
    this._tempCanvas.height = height;
    const ctx = this._tempCanvas.getContext("2d");
    if (!ctx) return;
    const image = ctx.createImageData(width, height);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const fontIndex = start + (y * width + x);
        const dataIndex = (y * width + x) * 4;
        if (this.data[fontIndex] === 1) {
          image.data[dataIndex + 0] = 255;
          image.data[dataIndex + 1] = 255;
          image.data[dataIndex + 2] = 255;
          image.data[dataIndex + 3] = 255;
        } else if (this.data[fontIndex] === 0) {
          image.data[dataIndex + 0] = 0;
          image.data[dataIndex + 1] = 0;
          image.data[dataIndex + 2] = 0;
          image.data[dataIndex + 3] = 255;
        } else {
          console.error("no data");
        }
      }
    }
    return image; // ctx.getImageData(0, 0, width, height);
  }

  getBoundingBox(text: string): EspHomeFontTextBound {
    if (!this.originalData) return { width: 0, height: 0 };
    let w = 0;
    let h = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);

      //lookup char into glyph table
      const glyph = this.originalData.glyphs.find((glyph: EspHomeFontGlyph) => {
        return glyph.glyph === char;
      });
      if (!glyph) continue;

      //expand canvas for the new char
      w += glyph.width;
      if (h < glyph.height + glyph.offset_y) {
        h = glyph.height + glyph.offset_y;
      }
    }
    return { width: w, height: h };
  }

  render(text: string): EspHomeFontRenderResult | null {
    if (!this.originalData) return null;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    let currentPosX = 0;

    let textBound = this.getBoundingBox(text);
    canvas.width = textBound.width;
    canvas.height = textBound.height;

    //ctx.fillStyle = "rgb(0,0,0);";
    //ctx.fillRect(0, 0, textBound.width, textBound.height);

    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);

      //lookup char into glyph table
      const glyph = this.originalData.glyphs.find((glyph: EspHomeFontGlyph) => {
        return glyph.glyph === char;
      });
      if (!glyph) continue;

      //draw char
      const img = this.getGlyphBitmap(glyph.start, glyph.width, glyph.height);
      if (img) {
        //x=?
        //y=?
        //console.log(glyph);
        ctx.putImageData(img, currentPosX + glyph.offset_x, glyph.offset_y);
      }
      //save next glyph x pos
      currentPosX += glyph.width;
    }

    return {
      dataUrl: canvas.toDataURL(),
      width: canvas.width,
      height: canvas.height,
      image: ctx.getImageData(0, 0, canvas.width, canvas.height),
    };
  }

  constructor(fontjson: EspHomeFontJSON) {
    this.id = fontjson.id;
    this.originalData = fontjson;
    this.name = fontjson.name;
    this.path = fontjson.path;
    this.height = fontjson.height;
    this.glyphstr = fontjson.glyphstr;
    this.glyphs = fontjson.glyphs;
    this.data = fontjson.data;
    this._tempCanvas = document.createElement("canvas");
  }
}
