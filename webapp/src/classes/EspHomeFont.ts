import {
  EspHomeFontJSON,
  Glyph,
  RenderResult,
  TextBound,
} from "interfaces/EspHomeFontJSON";

export class EspHomeFont {
  data?: EspHomeFontJSON;
  tempCanvas: HTMLCanvasElement;
  getGlyphBitmap(start: number, width: number, height: number) {
    if (!this.data) return;
    if (width == 0 || height == 0) return;
    this.tempCanvas.width = width;
    this.tempCanvas.height = height;
    const ctx = this.tempCanvas.getContext("2d");
    if (!ctx) return;
    const image = ctx.createImageData(width, height);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const fontIndex = start + (x * width + y);
        const dataIndex = (x * width + y) * 4;
        if (this.data.data[fontIndex]) {
          image.data[dataIndex + 0] = 255;
          image.data[dataIndex + 1] = 255;
          image.data[dataIndex + 2] = 255;
          image.data[dataIndex + 3] = 255;
        } else {
          image.data[dataIndex + 0] = 0;
          image.data[dataIndex + 1] = 0;
          image.data[dataIndex + 2] = 0;
          image.data[dataIndex + 3] = 255;
        }
      }
    }
    return image;
  }

  _getTextBound(text: string): TextBound {
    if (!this.data) return { width: 0, height: 0 };
    let w = 0;
    let h = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);

      //lookup char into glyph table
      const glyph = this.data.glyphs.find((glyph: Glyph) => {
        return glyph.glyph === char;
      });
      if (!glyph) continue;

      //expand canvas for the new char
      w += glyph.width;
      if (h < glyph.height) {
        h = glyph.height;
      }
    }
    return { width: w, height: h };
  }

  render(text: string): RenderResult | null {
    if (!this.data) return null;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    let currentPosX = 0;

    let textBound = this._getTextBound(text);
    canvas.width = textBound.width;
    canvas.height = textBound.height;

    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);

      //lookup char into glyph table
      const glyph = this.data.glyphs.find((glyph: Glyph) => {
        return glyph.glyph === char;
      });
      if (!glyph) continue;

      //draw char
      const img = this.getGlyphBitmap(glyph.start, glyph.width, glyph.height);
      if (img) {
        //x=?
        //y=?
        ctx.putImageData(img, currentPosX + glyph.offset_x, glyph.offset_y);
      }
      //save next glyph x pos
      currentPosX += glyph.width;
    }

    return {
      dataUrl: canvas.toDataURL(),
      width: canvas.width,
      height: canvas.height,
    };
  }

  constructor(fontjson: EspHomeFontJSON) {
    this.data = fontjson;
    this.tempCanvas = document.createElement("canvas");
  }
}
