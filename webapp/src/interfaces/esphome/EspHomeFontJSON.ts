export interface EspHomeFontJSON {
  name: string;
  height: number;
  glyphstr: string;
  glyphs: EspHomeFontGlyph[];
  data: number[];
}

export interface EspHomeFontGlyph {
  glyph: string;
  offset_x: number;
  offset_y: number;
  width: number;
  height: number;
  start: number;
}

export interface EspHomeFontRenderResult {
  dataUrl: string;
  width: number;
  height: number;
  image: any;
}

export interface EspHomeFontTextBound {
  width: number;
  height: number;
}
