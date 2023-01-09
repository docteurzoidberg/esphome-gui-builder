import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { EspHomeFont } from "classes/esphome/EspHomeFont";
import { GuiElement } from "classes/gui/GuiElement";
import { ImageGuiElement } from "classes/gui/ImageGuiElement";
import { AnimationGuiElement } from "classes/gui/AnimationGuiElement";
import { FontGuiElement } from "classes/gui/FontGuiElement";

import { DropElementJSON } from "interfaces/gui/DropElementJSON";
import { GuiElementJSON } from "interfaces/gui/GuiElementJSON";

import { Size } from "types/Size";
import { Rect } from "types/Rect";
import { Coord } from "types/Coord";
import { ElementSelectedEvent } from "types/Events";
import { RGB24 } from "types/RGB";

const imageScale = 4;
const selectedLineWidth = 2;
const handleSize = 8;

const selectedLineColor: RGB24 = {
  r: 39,
  g: 186,
  b: 253,
};

const handleStrokeColor: RGB24 = {
  r: 39,
  g: 186,
  b: 253,
};
const handleFillColor: RGB24 = {
  r: 255,
  g: 255,
  b: 255,
};

@customElement("my-canvas-display")
export class MyCanvasDisplay extends LitElement {
  @query("#display")
  canvasElement!: HTMLCanvasElement;

  @property()
  elements: GuiElement[] = [];

  @property({ type: Object })
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

  displaySize: Size = {
    width: 0,
    height: 0,
  };

  canvasSize: Size = {
    width: 0,
    height: 0,
  };

  canvasCalcScaleX: number = 0;
  canvasCalcScaleY: number = 0;

  //rendering
  ctx?: CanvasRenderingContext2D | null;
  lastFrameTs: number = 0;
  lastAnimationRequest = 0;

  //when there is a dragover event
  dragOverEvent?: DragEvent;
  dragOverElement?: GuiElement;

  _draw(ts: number) {
    //todo: limit fps?
    //if(ts-this.lastFrameTs < (1000/30))
    //  return;
    this.lastFrameTs = ts;
    if (this.ctx) {
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
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

    this.displaySize.width = width;
    this.displaySize.height = height;

    this._calcCanvasSize(width, height);

    //dispatch init-canvas event
    this.dispatchEvent(
      new CustomEvent("init-canvas", {
        detail: this.displaySize,
      })
    );

    this._draw(this.lastFrameTs);

    //dispatch drawing-update event
    //this.dispatchEvent(
    //  new CustomEvent("drawing-update", {
    //    detail: this.typedArray,
    //  })
    //);
  }

  _drawCanvasGrid(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.canvasGridWidth;
    for (
      let x = this.canvasGridWidth / 2;
      x < this.canvasSize.width;
      x += this.canvasScale + this.canvasGridWidth
    ) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvasSize.height);
      ctx.stroke();
    }
    for (
      let y = this.canvasGridWidth / 2;
      y < this.canvasSize.height;
      y += this.canvasScale + this.canvasGridWidth
    ) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvasSize.width, y);
      ctx.stroke();
    }
  }

  _calcCanvasSize(width: number, height: number) {
    this.canvasSize = {
      width:
        width * this.canvasScale +
        (this.showGrid ? this.canvasGridWidth * (width + 1) : 0),
      height:
        height * this.canvasScale +
        (this.showGrid ? this.canvasGridWidth * (height + 1) : 0),
    };

    this.canvasCalcScaleX = this.canvasSize.width / width;
    this.canvasCalcScaleY = this.canvasSize.height / height;
    this.canvasElement.width = this.canvasSize.width;
    this.canvasElement.height = this.canvasSize.height;
  }

  _drawCanvas() {
    //TODO: check if cnvas size changed?
    this._calcCanvasSize(this.displayWidth, this.displayHeight);

    const ctx = this.ctx;
    if (!ctx) return;

    //fill with white backgound (for transparency)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);

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

    const sortedElements = [...this.elements].reverse();

    //draw each guielement
    sortedElements.forEach((element) => {
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

  _getElementScaledRect(
    guielement: GuiElement,
    x: number,
    y: number,
    canvasscale: number,
    gridwidth: number = 0
  ): Rect {
    const elemWidth = guielement.getWidth();
    const elemHeight = guielement.getHeight();
    const elemScaledWidth =
      elemWidth * canvasscale + gridwidth * (elemWidth - 1);
    const elemScaledHeight =
      elemHeight * canvasscale + gridwidth * (elemHeight - 1);
    return {
      x: x * canvasscale + gridwidth * (x + 1),
      y: y * canvasscale + gridwidth * (y + 1),
      w: elemScaledWidth,
      h: elemScaledHeight,
    };
  }

  _drawHandle(ctx: CanvasRenderingContext2D, rect: Rect) {
    //handle stroke color
    ctx.fillStyle =
      "rgba(" +
      handleStrokeColor.r +
      "," +
      handleStrokeColor.g +
      "," +
      handleStrokeColor.b +
      ", 1)";

    //blue rectangle behind
    ctx.fillRect(rect.x, rect.y, handleSize, handleSize);

    //smaller white rectangle in front of larger one
    ctx.fillStyle =
      "rgba(" +
      handleFillColor.r +
      "," +
      handleFillColor.g +
      "," +
      handleFillColor.b +
      ", 1)";

    ctx.fillRect(rect.x + 1, rect.y + 1, handleSize - 2, handleSize - 2);
  }

  _drawSelectedElementRectBorder(ctx: CanvasRenderingContext2D) {
    if (!this.selectedElement) return;
    const rect = this._getElementScaledRect(
      this.selectedElement,
      this.selectedElement.x,
      this.selectedElement.y,
      this.canvasScale,
      this.showGrid ? this.canvasGridWidth : 0
    );

    ctx.strokeStyle =
      "rgba(" +
      selectedLineColor.r +
      "," +
      selectedLineColor.g +
      "," +
      selectedLineColor.b +
      ", 1)";

    ctx.lineWidth = selectedLineWidth;

    const borderRect = this._getBorderRect(rect);
    ctx.strokeRect(borderRect.x, borderRect.y, borderRect.w, borderRect.h);

    if (!this.selectedElement.resizable) return;

    //draw handle at 4 corners
    const handles = this._getHandlesRect(rect);
    this._drawHandle(ctx, handles.topLeft);
    this._drawHandle(ctx, handles.topRight);
    this._drawHandle(ctx, handles.bottomLeft);
    this._drawHandle(ctx, handles.bottomRight);
  }

  _drawDragOverElementRectBorder(ctx: CanvasRenderingContext2D) {
    if (!this.dragOverElement) return;
    //TODO: mouseXY?
    const mouseX = this.dragOverEvent!.clientX - this.canvasElement.offsetLeft;
    const mouseY = this.dragOverEvent!.clientY - this.canvasElement.offsetTop;
    const pixelX = Math.ceil(mouseX / this.canvasCalcScaleX) - 1;
    const pixelY = Math.ceil(mouseY / this.canvasCalcScaleY) - 1;
    const rect = this._getElementScaledRect(
      this.dragOverElement,
      pixelX,
      pixelY,
      this.canvasScale,
      this.showGrid ? this.canvasGridWidth : 0
    );
    const selectedLineWidth = 8;
    ctx.strokeStyle = "rgba(" + 0 + "," + 0 + "," + 255 + ", 1)";
    ctx.lineWidth = selectedLineWidth;
    ctx.strokeRect(
      rect.x - selectedLineWidth / 2,
      rect.y - selectedLineWidth / 2,
      rect.w,
      rect.h
    );
  }

  _drawDragOverElementToCanvas(ctx: CanvasRenderingContext2D) {
    if (!this.dragOverElement) return;

    //TODO: mouseXY?
    let mouseX = this.dragOverEvent!.clientX - this.canvasElement.offsetLeft;
    let mouseY = this.dragOverEvent!.clientY - this.canvasElement.offsetTop;
    let pixelX = Math.ceil(mouseX / this.canvasCalcScaleX) - 1;
    let pixelY = Math.ceil(mouseY / this.canvasCalcScaleY) - 1;
    this.dragOverElement.drawGhostToCanvas(ctx, { x: pixelX, y: pixelY });
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

  _elementMoved() {
    window.dispatchEvent(
      new CustomEvent("element-moved", { detail: this.selectedElement })
    );
    this.dispatchEvent(
      new CustomEvent("element-moved", { detail: this.selectedElement })
    );
  }

  _elementMoving() {
    window.dispatchEvent(
      new CustomEvent("element-moving", { detail: this.selectedElement })
    );
    this.dispatchEvent(
      new CustomEvent("element-moving", { detail: this.selectedElement })
    );
  }

  _createDragOverElement() {
    const data = this.dragOverEvent!.dataTransfer!.getData(
      "application/gui-element-json"
    );

    //temporary create json
    const dragOverElementJSON: DropElementJSON = JSON.parse(
      data
    ) as DropElementJSON;

    if (!dragOverElementJSON) return;

    //base object
    const newGuiElementJSON: GuiElementJSON = {
      x: 0, //TODO: coordinates
      y: 0, //TODO: coordinates
      zorder: 0,
    };

    if (dragOverElementJSON.type == "image") {
      this.dragOverElement = new ImageGuiElement({
        ...newGuiElementJSON,
        image: dragOverElementJSON.originalData,
      });
    } else if (dragOverElementJSON.type == "animation") {
      this.dragOverElement = new AnimationGuiElement({
        ...newGuiElementJSON,
        animation: dragOverElementJSON.originalData,
      });
    } else if (dragOverElementJSON.type == "text") {
      const text = "//TODO";
      const font = new EspHomeFont(dragOverElementJSON.originalData);
      this.dragOverElement = new FontGuiElement({
        ...newGuiElementJSON,
        font: dragOverElementJSON.originalData,
        text: text,
        bounds: font.getBoundingBox(text),
      });
    } else {
      console.error("unknown type:", dragOverElementJSON.type);
      this.dragOverElement = undefined;
    }
  }

  _isAt(rect: Rect, coord: Coord) {
    if (coord.x > rect.x && coord.x <= rect.x + rect.w)
      if (coord.y > rect.y && coord.y <= rect.y + rect.h) return true;
    return false;
  }

  _getHandlesRect(scaledRect: Rect) {
    const rect = this._getBorderRect(scaledRect);
    return {
      topLeft: {
        x: rect.x - handleSize / 2,
        y: rect.y - handleSize / 2,
        w: handleSize,
        h: handleSize,
      } as Rect,
      topRight: {
        x: rect.x + rect.w - handleSize / 2,
        y: rect.y - handleSize / 2,
        w: handleSize,
        h: handleSize,
      } as Rect,
      bottomLeft: {
        x: rect.x - handleSize / 2,
        y: rect.y + rect.h - handleSize / 2,
        w: handleSize,
        h: handleSize,
      } as Rect,
      bottomRight: {
        x: rect.x + rect.w - handleSize / 2,
        y: rect.y + rect.h - handleSize / 2,
        w: handleSize,
        h: handleSize,
      } as Rect,
    };
  }

  _isHandleAt(element: GuiElement, coord: Coord) {
    if (!element) return false;
    const rect = this._getElementScaledRect(
      element,
      element.x,
      element.y,
      this.canvasScale,
      this.showGrid ? this.canvasGridWidth : 0
    );
    //check coordinates againt all four handles in corners
    const handles = this._getHandlesRect(rect);
    return (
      this._isAt(handles.topLeft, coord) ||
      this._isAt(handles.topRight, coord) ||
      this._isAt(handles.bottomLeft, coord) ||
      this._isAt(handles.bottomRight, coord)
    );
  }

  _getBorderRect(elemScaledRect: Rect) {
    return {
      x: elemScaledRect.x - selectedLineWidth / 2,
      y: elemScaledRect.y - selectedLineWidth / 2,
      w: elemScaledRect.w + selectedLineWidth,
      h: elemScaledRect.h + selectedLineWidth,
    } as Rect;
  }

  _isBorderAt(element: GuiElement, coord: Coord) {
    if (!element) return false;
    const elemScaledRect = this._getElementScaledRect(
      element,
      element.x,
      element.y,
      this.canvasScale,
      this.showGrid ? this.canvasGridWidth : 0
    );
    const elemScaledBorderRect = this._getBorderRect(elemScaledRect);
    //check if coord is inside border rect but outside elem's rect
    return (
      !this._isAt(elemScaledRect, coord) &&
      this._isAt(elemScaledBorderRect, coord)
    );
  }

  handleMouseDown(e: MouseEvent) {
    //differencier les click sur un element deja selectionné pour voir si click sur poignees ou bordure, ou sur un nouvel element pour selection

    //get elements at mouse coordinates
    const atcoords = this.elements.filter((element) => {
      return this._isAt(
        {
          x: element.x,
          y: element.y,
          w: element.getWidth(),
          h: element.getHeight(),
        } as Rect,
        this.mouse_pixel_coord
      );
    });
    //take first element available (topmost one)
    const selected = atcoords.length > 0 ? atcoords[0] : undefined;

    let newSelection: GuiElement | undefined = undefined;
    let selectionChanged = false;

    //trigger selection change if any
    if (selected?.internalId != this.selectedElement?.internalId) {
      newSelection = selected;
      selectionChanged = true;
    }

    if (
      !newSelection &&
      this.selectedElement &&
      this.selectedElement.resizable
    ) {
      const elemHandles = this.elements.filter((element) => {
        return (
          this._isHandleAt(element, { x: e.offsetX, y: e.offsetY }) &&
          element.internalId == this.selectedElement?.internalId
        );
      });
      if (elemHandles.length > 0) {
        console.log("click on handle of the current selected element");
        //todo: manage handle click
        if (e.button === 0 && !this.selectedElement.isResizing) {
          this.selectedElement.beginResize(this.mouse_pixel_coord);
        }
        return;
      }
    }

    //sort elements by z order desc
    // atcoords.sort((a, b) =>
    //   a.zorder > b.zorder ? -1 : a.zorder == b.zorder ? 0 : 1
    // );

    if (selectionChanged) {
      this.dispatchEvent(
        new CustomEvent("element-selected", {
          detail: { element: newSelection } as ElementSelectedEvent,
        })
      );
      this.selectedElement = newSelection;
    }

    //begin move element if any
    if (
      this.selectedElement &&
      e.button === 0 &&
      !this.selectedElement.isMoving
    ) {
      this.selectedElement.beginMove(this.mouse_pixel_coord);
    }
  }

  handleMouseUp() {
    if (this.selectedElement?.isMoving) {
      this.selectedElement.endMove();
      //if (this.selectedElement.hasMoved())
      this._elementMoved();
    } else if (this.selectedElement?.isResizing) {
      this.selectedElement.endResize();
      //TODO: event resizing/moving?
      //this._elementResized();
    }
  }

  handleMouseLeave() {
    if (this.selectedElement?.isMoving) {
      this.selectedElement.endMove();
      this._elementMoved();
    } else if (this.selectedElement?.isResizing) {
      this.selectedElement.endResize();
      //TODO: event resizing/moving?
      //this._elementResized();
    }
  }

  handleMouseMove(e: MouseEvent) {
    this._setMouseXY(e);
    if (this.selectedElement?.isMoving) {
      this.selectedElement.move({
        x: this.mouse_pixel_coord.x,
        y: this.mouse_pixel_coord.y,
      });
      this._elementMoving();
    } else if (this.selectedElement?.isResizing) {
      this.selectedElement.resize();
      console.log("resizing");
      //TODO: event resizing/moving?
    }
  }

  handleDrop(ev: DragEvent) {
    this.dragOverEvent = undefined;
    this.dragOverElement = undefined;

    const data = ev.dataTransfer!.getData("application/gui-element-json");
    const dropElementJSON: DropElementJSON = JSON.parse(
      data
    ) as DropElementJSON;

    let elementJson: any = {
      x: 0, //TODO: coordinates
      y: 0, //TODO: coordinates
      zorder: 0,
    };

    this.dispatchEvent(
      new CustomEvent("element-dropped", {
        detail: { elementJson: elementJson, dropElementJSON: dropElementJSON },
      })
    );
  }

  handleDragOver(ev: DragEvent) {
    ev.preventDefault();
    ev.dataTransfer!.dropEffect = "move";
    this.dragOverEvent = ev;
    if (!this.dragOverElement) {
      this._createDragOverElement();
    }
    //TODO: check mouse coord?
  }

  handleDragLeave() {
    this.dragOverEvent = undefined;
    this.dragOverElement = undefined;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.ctx = this.canvasElement.getContext("2d");
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
