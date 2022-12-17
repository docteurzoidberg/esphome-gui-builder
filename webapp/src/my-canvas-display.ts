import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement, state, property, query } from "lit/decorators.js";
import { pixelcoord } from "interfaces/PixelCoord";
import { rgb } from "interfaces/rgb";
import { GuiElement } from "interfaces/GuiElement";
import { EspHomeImage } from "interfaces/EspHomeImage";

const imageScale = 10;

const hexToRgb = (hex: string): rgb => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        short:
          "" +
          parseInt(result[1], 16) +
          "," +
          parseInt(result[2], 16) +
          "," +
          parseInt(result[3], 16),
      }
    : {
        r: 0,
        g: 0,
        b: 0,
        short: "00,00,00",
      };
};

@customElement("my-canvas-display")
export class MyCanvasDisplay extends LitElement {
  @query("#display")
  canvas!: HTMLCanvasElement;

  @property()
  elements: Array<GuiElement> = [];

  @property()
  selectedElement?: GuiElement;

  @property({ type: Number })
  displayWidth: number = 0;

  @property({ type: Number })
  displayHeight: number = 0;

  @property({ type: Number })
  canvasScale: number = imageScale;

  @property({ type: Number })
  canvasGridWidth: number = 2;

  mouse_pixel_coord: pixelcoord = { x: 0, y: 0 };
  mouse_x: number = 0;
  mouse_y: number = 0;
  width: number = 0;
  height: number = 0;
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  canvasCalcScaleX: number = 0;
  canvasCalcScaleY: number = 0;
  ctx: CanvasRenderingContext2D | null = null;
  arrayBuffer!: ArrayBuffer;
  typedArray!: Uint8Array;
  lastFrameTs: number = 0;

  connectedCallback() {
    super.connectedCallback();
  }

  _clearBuffer(rgb: rgb = hexToRgb("#000000")) {
    for (let i = 0; i < this.typedArray.length; i += 4) {
      this.typedArray[i + 0] = rgb.r;
      this.typedArray[i + 1] = rgb.g;
      this.typedArray[i + 2] = rgb.b;
      this.typedArray[i + 3] = 0;
    }
  }

  _draw(ts: number) {
    //if(ts-this.lastFrameTs < (1000/30))
    //  return;
    this.lastFrameTs = ts;
    if (this.ctx) {
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this._drawCanvas();
      this.ctx.restore();
    }
    requestAnimationFrame((ts: number) => {
      this._draw(ts);
    });
  }

  _initCanvas(width: number, height: number) {
    this.width = width;
    this.height = height;
    const event = new CustomEvent("init-canvas", {
      detail: {
        width: width,
        height: height,
      },
    });
    this.arrayBuffer = new ArrayBuffer(width * height * 4);
    this.typedArray = new Uint8Array(this.arrayBuffer);
    this.canvasWidth =
      width * this.canvasScale + this.canvasGridWidth * (width + 1);
    this.canvasHeight =
      height * this.canvasScale + this.canvasGridWidth * (height + 1);
    this.canvasCalcScaleX = this.canvasWidth / width;
    this.canvasCalcScaleY = this.canvasHeight / height;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    //init green
    this._clearBuffer(hexToRgb("#00FF00"));
    this._draw(this.lastFrameTs);

    this.dispatchEvent(event);
    this.dispatchEvent(
      new CustomEvent("drawing-update", {
        detail: this.typedArray,
      })
    );
  }

  _drawImageElementToCanvas(
    element: GuiElement,
    ctx: CanvasRenderingContext2D
  ) {
    const imageElement = element.data as EspHomeImage;
    let img = new Image();
    img.src = imageElement.dataurl;
    ctx.drawImage(img, element.x, element.y);
  }

  _drawCanvasGrid(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.canvasGridWidth;
    for (
      let x = this.canvasGridWidth / 2;
      x < this.canvasWidth;
      x += this.canvasScale + this.canvasGridWidth
    ) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvasHeight);
      ctx.stroke();
    }
    for (
      let y = this.canvasGridWidth / 2;
      y < this.canvasHeight;
      y += this.canvasScale + this.canvasGridWidth
    ) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvasWidth, y);
      ctx.stroke();
    }
  }

  _drawCanvas() {
    const ctx = this.ctx;
    if (!ctx) return;
    //fill with white backgound (for transparency)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    //Draw grid
    this._drawCanvasGrid(ctx);

    //Draw everything on a temporary canvas, unscaled
    const newcanvas = document.createElement("canvas");
    const newctx = newcanvas.getContext("2d");
    if (!newctx) return;
    newcanvas.width = this.width;
    newcanvas.height = this.height;
    this.elements.forEach((element) => {
      if (element.type == "image") {
        this._drawImageElementToCanvas(element, newctx);
      }
    });

    //get back the temp canvas image data
    const elemsImageData = newctx.getImageData(0, 0, this.width, this.height);

    //drawing to scaled canvas
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        // get color from buffer
        const pixelIndex = (y * this.width + x) * 4;
        const r = elemsImageData.data[pixelIndex];
        const g = elemsImageData.data[pixelIndex + 1];
        const b = elemsImageData.data[pixelIndex + 2];
        //put pixel color but at 0.9 alpha on canvas
        ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ", 0.9)";
        const canvasX = x * this.canvasScale + this.canvasGridWidth * (x + 1);
        const canvasY = y * this.canvasScale + this.canvasGridWidth * (y + 1);
        //draw scaled pixel rect
        ctx.fillRect(canvasX, canvasY, this.canvasScale, this.canvasScale);
      }
    }

    //draw rect over selected element
    if (!this.selectedElement) return;

    let elemWidth = 0;
    let elemHeight = 0;

    const elemCanvasX =
      this.selectedElement.x * this.canvasScale +
      this.canvasGridWidth * (this.selectedElement.x + 1);
    const elemCanvasY =
      this.selectedElement.y * this.canvasScale +
      this.canvasGridWidth * (this.selectedElement.y + 1);

    if (this.selectedElement.type == "image") {
      const imageElement = this.selectedElement.data as EspHomeImage;
      elemWidth =
        imageElement.width * this.canvasScale +
        this.canvasGridWidth * imageElement.width;
      elemHeight =
        imageElement.height * this.canvasScale +
        this.canvasGridWidth * imageElement.height;
    }

    const selectedLineWidth = 8;
    ctx.strokeStyle = "rgba(" + 255 + "," + 0 + "," + 0 + ", 1)";
    ctx.lineWidth = selectedLineWidth;
    ctx.strokeRect(
      elemCanvasX - selectedLineWidth / 2,
      elemCanvasY - selectedLineWidth / 2,
      elemWidth,
      elemHeight
    );
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.ctx = this.canvas.getContext("2d");
    this._initCanvas(this.displayWidth, this.displayHeight);
  }

  render() {
    return html`
      <div class="">
        <h1>Canvas</h1>
        <canvas id="display"></canvas>
      </div>
    `;
  }

  static styles = css`
    :host {
      background-color: pink;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-canvas-display": MyCanvasDisplay;
  }
}
