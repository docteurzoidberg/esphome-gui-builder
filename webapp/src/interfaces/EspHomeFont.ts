export interface Glyph {
  glyph: string;
  offset_x: number;
  offset_y: number;
  width: number;
  height: number;
  start: number;
}

export interface EspHomeFont {
  name: string;
  height: number;
  glyphstr: string;
  glyphs: [Glyph];
  data: [];
}

export interface RenderResult {
  dataUrl: string;
  width: number;
  height: number;
}

export interface TextBound {
  width: number;
  height: number;
}
