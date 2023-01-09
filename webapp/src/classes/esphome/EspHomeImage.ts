import { EspHomeImageJSON } from "interfaces/esphome/EspHomeImageJSON";

export class EspHomeImage implements EspHomeImageJSON {
  id: string; //esphome id
  originalData: EspHomeImageJSON;
  width: number;
  height: number;
  name: string;
  path: string;
  dataurl: string;
  type?: string;
  constructor(imagejson: EspHomeImageJSON) {
    this.id = imagejson.id;
    this.originalData = imagejson;
    this.width = imagejson.width;
    this.height = imagejson.height;
    this.name = imagejson.name;
    this.path = imagejson.path;
    this.dataurl = imagejson.dataurl;
    this.type = imagejson.type || "RGB24";
  }
}
