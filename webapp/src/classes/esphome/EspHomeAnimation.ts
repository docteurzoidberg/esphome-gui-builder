import { EspHomeAnimationJSON } from "interfaces/esphome/EspHomeAnimationJSON";

export class EspHomeAnimation implements EspHomeAnimationJSON {
  originalData: EspHomeAnimationJSON;
  fps: number = 16; //Math.ceil(1000 / 16); //default esphome refresh rate

  id: string; //esphome id
  name: string;
  frames: number;
  data: number[];
  dataurl: string;

  width: number = 0;
  height: number = 0;
  frameCount: number = 0;
  previewDataUrl: string = "";

  private _lastUpdate: number = 0;
  private _internalCanvas: HTMLCanvasElement | null = null;
  private _internalContext: CanvasRenderingContext2D | null = null;
  private _currentFrameData: ImageData | null = null;
  private _currentFrameIndex: number = 0;

  update() {
    if (Date.now() - this._lastUpdate < Math.ceil(1000 / this.fps)) return;
    this.nextFrame();
    this._lastUpdate = Date.now();
  }

  nextFrame() {
    //todo: fill currentFrameData
    if (!this._internalContext) {
      console.error("no internal context");
      return;
    }
    if (!this.data) {
      console.error("no internal data");
      return;
    }
    this._currentFrameData = this._internalContext.getImageData(
      0,
      0,
      this.width,
      this.height
    );

    //fill image data with current frame data
    const animdata = this.data;
    const frameIndex = this._currentFrameIndex * this.width * this.height * 3; //3=>rgb24 in esphome
    //console.log("drawing next frame");
    for (let x = 0; x <= this.width; x++) {
      for (let y = 0; y <= this.height; y++) {
        const pixelDestIndex = (x * this.width + y) * 4; //rgba
        const pixelSrcIndex = frameIndex + (x * this.width + y) * 3; //rgb24
        this._currentFrameData.data[pixelDestIndex + 0] =
          animdata[pixelSrcIndex + 0]; //r
        this._currentFrameData.data[pixelDestIndex + 1] =
          animdata[pixelSrcIndex + 1]; //g
        this._currentFrameData.data[pixelDestIndex + 2] =
          animdata[pixelSrcIndex + 2]; //b
        this._currentFrameData.data[pixelDestIndex + 3] = 255; //alpha
      }
    }

    this._internalContext.putImageData(this._currentFrameData, 0, 0);

    //go next frame
    this._currentFrameIndex++;
    if (this._currentFrameIndex >= this.frameCount) {
      //loop to first frame
      this._currentFrameIndex = 0;
    }
  }

  getImageData() {
    return this._currentFrameData;
  }

  constructor(animationjson: EspHomeAnimationJSON) {
    this.originalData = animationjson;
    this.id = animationjson.id;
    this.name = animationjson.name;
    this.frames = animationjson.frames;
    this.dataurl = animationjson.dataurl;
    this.data = animationjson.data;
    this.width = animationjson.width;
    this.height = animationjson.height;
    this.frameCount = animationjson.frames;
    this.previewDataUrl = animationjson.dataurl;
    //this.fps = animationjson.fps;

    this._internalCanvas = document.createElement("canvas");
    this._internalCanvas.width = this.width;
    this._internalCanvas.height = this.height;
    this._internalContext = this._internalCanvas.getContext("2d");

    this.update();
  }
}
