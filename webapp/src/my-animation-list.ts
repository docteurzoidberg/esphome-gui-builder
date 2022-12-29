import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { EspHomeAnimationJSON } from "./interfaces/EspHomeAnimationJSON";
import { EspHomeAnimation } from "./classes/EspHomeAnimation";
const imageScale = 5;

@customElement("my-animation-list")
export class MyAnimationList extends LitElement {
  @property({ type: Array })
  animations: Array<EspHomeAnimation> = [];

  @property({ type: Boolean })
  animationsLoaded = false;

  haveLocalData(): boolean {
    const localAnimationsStr = localStorage.getItem("animations.json");
    if (!localAnimationsStr || localAnimationsStr == "") return false;
    return true;
  }

  raiseAnimationsLoaded() {
    const event = new CustomEvent("animations-loaded", {
      detail: this.animations,
    });
    this.dispatchEvent(event);
  }
  connectedCallback() {
    super.connectedCallback();
    fetch("./animations.json")
      .then((response) => response.json())
      .then((json: Array<EspHomeAnimationJSON>) => {
        this.animations = json.map((animation) => {
          return new EspHomeAnimation(animation);
        });
        this.raiseAnimationsLoaded();
        console.dir(json);
      });
  }

  renderAnimations() {
    if (!this.animations) return;
    return this.animations.map((animation: EspHomeAnimation) => {
      return html`
        <img
          class="image"
          width=${animation.width * imageScale}
          height=${animation.height * imageScale}
          src="${animation.previewDataUrl}"
        />
      `;
    });
  }

  render() {
    return html`<div class="animations">${this.renderAnimations()}</div> `;
  }

  static styles = css`
    :host {
      background-color: pink;
    }
    .image {
      border: 5px solid blue;
    }
    img {
      image-rendering: pixelated;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-animation-list": MyAnimationList;
  }
}
