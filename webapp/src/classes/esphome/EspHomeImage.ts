import { EspHomeImageJSON } from "interfaces/esphome/EspHomeImageJSON";

export class EspHomeImage implements EspHomeImageJSON {
  originalData: EspHomeImageJSON;
  width: number;
  height: number;
  name: string;
  dataurl: string;
  constructor(imagejson: EspHomeImageJSON) {
    this.originalData = imagejson;
    this.width = imagejson.width;
    this.height = imagejson.height;
    this.name = imagejson.name;
    this.dataurl = imagejson.dataurl;
  }
}
