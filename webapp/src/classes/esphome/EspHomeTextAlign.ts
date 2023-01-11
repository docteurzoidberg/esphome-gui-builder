export enum EspHomeTextAlign {
  TOP = 0x00,
  CENTER_VERTICAL = 0x01,
  BASELINE = 0x02,
  BOTTOM = 0x04,
  LEFT = 0x00,
  CENTER_HORIZONTAL = 0x08,
  RIGHT = 0x10,
  TOP_LEFT = TOP | LEFT,
  TOP_CENTER = TOP | CENTER_HORIZONTAL,
  TOP_RIGHT = TOP | RIGHT,
  CENTER_LEFT = CENTER_VERTICAL | LEFT,
  CENTER = CENTER_VERTICAL | CENTER_HORIZONTAL,
  CENTER_RIGHT = CENTER_VERTICAL | RIGHT,
  BASELINE_LEFT = BASELINE | LEFT,
  BASELINE_CENTER = BASELINE | CENTER_HORIZONTAL,
  BASELINE_RIGHT = BASELINE | RIGHT,
  BOTTOM_LEFT = BOTTOM | LEFT,
  BOTTOM_CENTER = BOTTOM | CENTER_HORIZONTAL,
  BOTTOM_RIGHT = BOTTOM | RIGHT,
}
