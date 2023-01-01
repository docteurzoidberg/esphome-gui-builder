import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { RGB } from "types/RGB";
import { Coord } from "types/Coord";

import { EspHomeFont } from "esphome/font/EspHomeFont";
import { GuiElement } from "gui/GuiElement";
import { ImageGuiElement } from "gui/image/ImageGuiElement";
import { ImageGuiElementJSON } from "gui/image/ImageGuiElementJSON";
import { AnimationGuiElement } from "gui/animation/AnimationGuiElement";
import { AnimationGuiElementJSON } from "gui/animation/AnimationGuiElementJSON";
import { FontGuiElement } from "gui/font/FontGuiElement";
import { FontGuiElementJSON } from "gui/font/FontGuiElementJSON";
import { DropElementJSON } from "gui/DropElementJSON";

const imageScale = 5;

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

  @property({ type: Boolean })
  showGrid: boolean = true;

  mouse_pixel_coord: Coord = { x: 0, y: 0 };
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
  lastAnimationRequest = 0;

  isMovingElement: boolean = false;
  elementStartMoveCoord: Coord = { x: 0, y: 0 };
  dragOverEvent: DragEvent | null = null;
  dragOverElement: GuiElement | null = null;

  _clearBuffer(rgb: RGB = { r: 0, g: 0, b: 0 }) {
    for (let i = 0; i < this.typedArray.length; i += 4) {
      this.typedArray[i + 0] = rgb.r;
      this.typedArray[i + 1] = rgb.g;
      this.typedArray[i + 2] = rgb.b;
      this.typedArray[i + 3] = 0;
    }
  }

  _draw(ts: number) {
    //todo: limit fps?
    //if(ts-this.lastFrameTs < (1000/30))
    //  return;
    this.lastFrameTs = ts;
    if (this.ctx) {
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this._drawCanvas();
      this.ctx.restore();
    }
    this.lastAnimationRequest = requestAnimationFrame((ts: number) => {
      this._draw(ts);
    });
  }

  _initCanvas(width: number, height: number) {
    if (this.lastAnimationRequest) {
      window.cancelAnimationFrame(this.lastAnimationRequest);
    }

    this.width = width;
    this.height = height;
    this.arrayBuffer = new ArrayBuffer(width * height * 4);
    this.typedArray = new Uint8Array(this.arrayBuffer);
    this.canvasWidth =
      width * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * (width + 1) : 0);
    this.canvasHeight =
      height * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * (height + 1) : 0);
    this.canvasCalcScaleX = this.canvasWidth / width;
    this.canvasCalcScaleY = this.canvasHeight / height;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this._clearBuffer({ r: 0, g: 255, b: 0 });
    this._draw(this.lastFrameTs);

    //dispatch init-canvas event
    this.dispatchEvent(
      new CustomEvent("init-canvas", {
        detail: {
          width: width,
          height: height,
        },
      })
    );

    //dispatch drawing-update event
    this.dispatchEvent(
      new CustomEvent("drawing-update", {
        detail: this.typedArray,
      })
    );
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
    //TODO: check if cnvas size changed?
    this.canvasWidth =
      this.displayWidth * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * (this.displayWidth + 1) : 0);
    this.canvasHeight =
      this.displayHeight * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * (this.displayHeight + 1) : 0);
    this.canvasCalcScaleX = this.canvasWidth / this.displayWidth;
    this.canvasCalcScaleY = this.canvasHeight / this.displayHeight;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    //-

    const ctx = this.ctx;
    if (!ctx) return;

    //fill with white backgound (for transparency)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    //draw grid
    if (this.showGrid) {
      this._drawCanvasGrid(ctx);
    }

    //create a temporary canvas, unscaled, to draw on
    const newcanvas = document.createElement("canvas");
    const newctx = newcanvas.getContext("2d");
    if (!newctx) return;
    newcanvas.width = this.displayWidth;
    newcanvas.height = this.displayHeight;
    this.elements.sort((a, b) => a.zorder - b.zorder);

    //draw each guielement
    this.elements.forEach((element) => {
      element.drawToCanvas(newctx);
    });

    //draw drag over element if any
    if (this.dragOverElement) {
      this._drawDragOverElementToCanvas(newctx);
    }

    //get back the temp canvas image data
    const elemsImageData = newctx.getImageData(
      0,
      0,
      this.displayWidth,
      this.displayHeight
    );

    //drawing pixels to scaled canvas
    for (let x = 0; x < this.displayWidth; x++) {
      for (let y = 0; y < this.displayHeight; y++) {
        // get color from buffer
        const pixelIndex = (y * this.displayWidth + x) * 4;
        const r = elemsImageData.data[pixelIndex];
        const g = elemsImageData.data[pixelIndex + 1];
        const b = elemsImageData.data[pixelIndex + 2];
        //put pixel color but at 0.9 alpha on canvas
        ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ", 0.9)";
        const canvasX =
          x * this.canvasScale +
          (this.showGrid ? this.canvasGridWidth * (x + 1) : 0);
        const canvasY =
          y * this.canvasScale +
          (this.showGrid ? this.canvasGridWidth * (y + 1) : 0);
        //draw scaled pixel rect
        ctx.fillRect(canvasX, canvasY, this.canvasScale, this.canvasScale);
      }
    }

    //draw drag over element border if any
    if (this.dragOverElement) {
      this._drawDragOverElementRectBorder(ctx);
    }

    //draw rect over selected element if any
    if (this.selectedElement) {
      this._drawSelectedElementRectBorder(ctx);
    }
  }

  _drawSelectedElementRectBorder(ctx: CanvasRenderingContext2D) {
    if (!this.selectedElement) return;

    const elemWidth = this.selectedElement.getWidth();
    const elemHeight = this.selectedElement.getHeight();

    const elemCanvasX =
      this.selectedElement.x * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * (this.selectedElement.x + 1) : 0);
    const elemCanvasY =
      this.selectedElement.y * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * (this.selectedElement.y + 1) : 0);

    const elemScaledWidth =
      (elemWidth + 1) * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * elemWidth : 0);
    const elemScaledHeight =
      (elemHeight + 1) * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * elemHeight : 0);

    const selectedLineWidth = 8;
    ctx.strokeStyle = "rgba(" + 255 + "," + 0 + "," + 0 + ", 1)";
    ctx.lineWidth = selectedLineWidth;
    ctx.strokeRect(
      elemCanvasX - selectedLineWidth / 2,
      elemCanvasY - selectedLineWidth / 2,
      elemScaledWidth,
      elemScaledHeight
    );
  }

  _drawDragOverElementRectBorder(ctx: CanvasRenderingContext2D) {
    if (!this.dragOverElement) return;

    //TODO: mouseXY?
    let mouseX = this.dragOverEvent!.clientX - this.canvas.offsetLeft;
    let mouseY = this.dragOverEvent!.clientY - this.canvas.offsetTop;
    let pixelX = Math.ceil(mouseX / this.canvasCalcScaleX) - 1;
    let pixelY = Math.ceil(mouseY / this.canvasCalcScaleY) - 1;

    let elemX = pixelX;
    let elemY = pixelY;
    let elemWidth = this.dragOverElement.getWidth();
    let elemHeight = this.dragOverElement.getHeight();

    const elemCanvasX =
      elemX * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * (elemX + 1) : 0);
    const elemCanvasY =
      elemY * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * (elemY + 1) : 0);

    const elemScaledWidth =
      (elemWidth + 1) * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * elemWidth : 0);
    const elemScaledHeight =
      (elemHeight + 1) * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * elemHeight : 0);

    const selectedLineWidth = 8;
    ctx.strokeStyle = "rgba(" + 0 + "," + 0 + "," + 255 + ", 1)";
    ctx.lineWidth = selectedLineWidth;
    ctx.strokeRect(
      elemCanvasX - selectedLineWidth / 2,
      elemCanvasY - selectedLineWidth / 2,
      elemScaledWidth,
      elemScaledHeight
    );
  }

  _drawDragOverElementToCanvas(ctx: CanvasRenderingContext2D) {
    if (!this.dragOverElement) return;

    //TODO: mouseXY?
    let mouseX = this.dragOverEvent!.clientX - this.canvas.offsetLeft;
    let mouseY = this.dragOverEvent!.clientY - this.canvas.offsetTop;
    let pixelX = Math.ceil(mouseX / this.canvasCalcScaleX) - 1;
    let pixelY = Math.ceil(mouseY / this.canvasCalcScaleY) - 1;
    if (this.dragOverElement instanceof ImageGuiElement) {
      let img = new Image();
      img.src = this.dragOverElement.image.dataurl;
      ctx.drawImage(img, pixelX, pixelY);
    }
  }

  _setMouseXY(e: MouseEvent) {
    this.mouse_pixel_coord.x = Math.ceil(e.offsetX / this.canvasCalcScaleX);
    this.mouse_pixel_coord.y = Math.ceil(e.offsetY / this.canvasCalcScaleY);
    if (this.mouse_pixel_coord.x < 1) this.mouse_pixel_coord.x = 1;
    if (this.mouse_pixel_coord.y < 1) this.mouse_pixel_coord.y = 1;
    if (this.mouse_pixel_coord.x > this.displayWidth)
      this.mouse_pixel_coord.x = this.displayWidth;
    if (this.mouse_pixel_coord.y > this.displayHeight)
      this.mouse_pixel_coord.y = this.displayHeight;
  }

  _startMoving() {
    this.isMovingElement = true;

    //console.log(
    //  "start moving",
    //  this.mouse_pixel_coord.x,
    //  this.mouse_pixel_coord.y
    //);

    this.elementStartMoveCoord.x = this.mouse_pixel_coord.x;
    this.elementStartMoveCoord.y = this.mouse_pixel_coord.y;
  }

  _stopMoving() {
    //console.log("stop moving");
    this.isMovingElement = false;
    this._elementMoved();
  }

  _elementMoved() {
    window.dispatchEvent(
      new CustomEvent("element-moved", { detail: this.selectedElement })
    );
  }

  handleMouseDown(e: MouseEvent) {
    //get elements at mouse coordinates
    const atcoords = this.elements.filter((element) =>
      element.isAt(this.mouse_pixel_coord)
    );

    //sort elements by z order desc
    atcoords.sort((a, b) =>
      a.zorder > b.zorder ? -1 : a.zorder == b.zorder ? 0 : 1
    );

    //take first element available (topmost one)
    const selected = atcoords.length > 0 ? atcoords[0] : undefined;
    if (selected?.id != this.selectedElement?.id) {
      this.dispatchEvent(
        new CustomEvent("element-selected", {
          detail: selected,
        })
      );
    }
    if (selected && e.button === 0 && !this.isMovingElement) {
      this._startMoving();
    }
  }

  handleMouseUp() {
    if (this.isMovingElement) this._stopMoving();
  }

  handleMouseLeave() {
    if (this.isMovingElement) this._stopMoving();
  }

  handleMouseMove(e: MouseEvent) {
    this._setMouseXY(e);
    if (this.isMovingElement && this.selectedElement) {
      const movex = this.mouse_pixel_coord.x - this.elementStartMoveCoord.x;
      const movey = this.mouse_pixel_coord.y - this.elementStartMoveCoord.y;
      //console.log("moving element", movex, movey);
      this.selectedElement.x += movex;
      this.selectedElement.y += movey;
      this.elementStartMoveCoord.x = this.mouse_pixel_coord.x;
      this.elementStartMoveCoord.y = this.mouse_pixel_coord.y;
    }
  }

  handleDrop(ev: DragEvent) {
    this.dragOverEvent = null;
    this.dragOverElement = null;

    const data = ev.dataTransfer!.getData("application/gui-element-json");
    const dropElementJSON: DropElementJSON = JSON.parse(
      data
    ) as DropElementJSON;

    let element: GuiElement | null = null;

    if (dropElementJSON.type == "image") {
      const imageJson: ImageGuiElementJSON = {
        id: dropElementJSON.id,
        name: dropElementJSON.name,
        x: 0, //TODO: coordinates
        y: 0, //TODO: coordinates
        zorder: 0,
        image: dropElementJSON.originalData,
      };
      element = new ImageGuiElement(imageJson);
    } else if (dropElementJSON.type == "animation") {
      const animationJson: AnimationGuiElementJSON = {
        id: dropElementJSON.id,
        name: dropElementJSON.name,
        x: 0, //TODO: coordinates
        y: 0, //TODO: coordinates
        zorder: 0,
        animation: dropElementJSON.originalData,
      };
      element = new AnimationGuiElement(animationJson);
    } else if (dropElementJSON.type == "text") {
      const font = new EspHomeFont(dropElementJSON.originalData);
      const fontJson: FontGuiElementJSON = {
        id: dropElementJSON.id,
        name: dropElementJSON.name,
        x: 0, //TODO: coordinates
        y: 0, //TODO: coordinates
        zorder: 0,
        font: dropElementJSON.originalData,
        text: "TOTO",
        bounds: font.getBoundingBox("TOTO"),
      };
      element = new FontGuiElement(fontJson);
    } else {
      console.error("unknow type", dropElementJSON.type);
    }

    if (!element) return;
    const event = new CustomEvent("element-dropped", { detail: element });
    this.dispatchEvent(event);
  }

  createDragOverElement() {
    const data = this.dragOverEvent!.dataTransfer!.getData(
      "application/gui-element-json"
    );

    //temporary create json
    const dragOverElementJSON: DropElementJSON = JSON.parse(
      data
    ) as DropElementJSON;

    if (!dragOverElementJSON) return;

    if (dragOverElementJSON.type == "image") {
      const imageJson: ImageGuiElementJSON = {
        id: dragOverElementJSON.id,
        name: dragOverElementJSON.name,
        x: 0, //TODO: coordinates
        y: 0, //TODO: coordinates
        zorder: 0,
        image: dragOverElementJSON.originalData,
      };
      this.dragOverElement = new ImageGuiElement(imageJson);
    } else if (dragOverElementJSON.type == "animation") {
      const animationJson: AnimationGuiElementJSON = {
        id: dragOverElementJSON.id,
        name: dragOverElementJSON.name,
        x: 0, //TODO: coordinates
        y: 0, //TODO: coordinates
        zorder: 0,
        animation: dragOverElementJSON.originalData,
      };
      this.dragOverElement = new AnimationGuiElement(animationJson);
    } else if (dragOverElementJSON.type == "text") {
      const font = new EspHomeFont(dragOverElementJSON.originalData);
      const fontJson: FontGuiElementJSON = {
        id: dragOverElementJSON.id,
        name: dragOverElementJSON.name,
        x: 0, //TODO: coordinates
        y: 0, //TODO: coordinates
        zorder: 0,
        font: dragOverElementJSON.originalData,
        text: "TOTO",
        bounds: font.getBoundingBox("TOTO"),
      };
      this.dragOverElement = new FontGuiElement(fontJson);
    } else {
      console.error("unknown type:", dragOverElementJSON.type);
    }
  }

  handleDragOver(ev: DragEvent) {
    ev.preventDefault();
    ev.dataTransfer!.dropEffect = "move";
    this.dragOverEvent = ev;
    if (!this.dragOverElement) {
      this.createDragOverElement();
    }
    //TODO: check mouse coord?
  }

  handleDragLeave() {
    this.dragOverEvent = null;
    this.dragOverElement = null;
  }

  connectedCallback() {
    super.connectedCallback();
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
        <canvas
          id="display"
          @mousemove="${this.handleMouseMove}"
          @mousedown="${this.handleMouseDown}"
          @mouseup="${this.handleMouseUp}"
          @mouseleave="${this.handleMouseLeave}"
          @drop="${this.handleDrop}"
          @dragover="${this.handleDragOver}"
          @dragleave="${this.handleDragLeave}"
        ></canvas>
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
