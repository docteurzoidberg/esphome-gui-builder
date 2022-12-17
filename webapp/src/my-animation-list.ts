import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { EspHomeAnimation } from "interfaces/EspHomeAnimation";
const imageScale = 5;

@customElement("my-animation-list")
export class MyAnimationList extends LitElement {
  @property({ type: Array })
  animations = [];

  connectedCallback() {
    super.connectedCallback();
    fetch("./animations.json")
      .then((response) => response.json())
      .then((json) => {
        this.animations = json;
        console.dir(json);
      });
  }

  renderImages() {
    if (!this.animations) return;
    return this.animations.map((image: EspHomeAnimation) => {
      return html`
        <img
          class="image"
          width=${image.width * imageScale}
          height=${image.height * imageScale}
          src="${image.dataurl}"
        />
      `;
    });
  }

  render() {
    return html`<div class="animations">${this.renderImages()}</div> `;
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
