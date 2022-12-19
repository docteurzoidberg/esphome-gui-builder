import { EspHomeAnimationJSON } from "interfaces/EspHomeAnimationJSON";

export class EspHomeAnimation {
  data?: EspHomeAnimationJSON;
  constructor(animationjson: EspHomeAnimationJSON) {
    this.data = animationjson;
  }
}
