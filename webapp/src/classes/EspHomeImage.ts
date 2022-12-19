import { EspHomeImageJSON } from "interfaces/EspHomeImageJSON";

export class EspHomeImage {
  data?: EspHomeImageJSON;

  constructor(imagejson: EspHomeImageJSON) {
    this.data = imagejson;
  }
}
