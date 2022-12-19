import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { EspHomeImageJSON } from "interfaces/EspHomeImageJSON";
const imageScale = 5;

@customElement("my-image-list")
export class MyImageList extends LitElement {
  @property({ type: Array })
  images = [];

  @property({ type: Object })
  selectedImage?: EspHomeImageJSON;

  connectedCallback() {
    super.connectedCallback();
    fetch("./images.json")
      .then((response) => response.json())
      .then((json) => {
        this.images = json;
        console.dir(json);
      });
  }

  selectImage(image: EspHomeImageJSON) {
    this.selectedImage = image;
    this.dispatchEvent(new CustomEvent("image-selected", { detail: image }));
  }

  renderImages() {
    if (!this.images) return;
    return this.images.map((image: EspHomeImageJSON) => {
      return html`
        <img
          class="image"
          is-selected="${this.selectedImage?.name === image.name}"
          width=${image.width * imageScale}
          height=${image.height * imageScale}
          @click="${() => this.selectImage(image)}"
          src="${image.dataurl}"
        />
      `;
    });
  }

  renderSelectedImageInfos() {
    return this.selectedImage
      ? html` <div class="infos">
          <h4>Image infos:</h4>
          <div>file: ${this.selectedImage?.name}</div>
          <div>Width: ${this.selectedImage?.width}</div>
          <div>Height: ${this.selectedImage?.height}</div>
          <div>data: ${this.selectedImage?.dataurl}</div>
        </div>`
      : nothing;
  }

  render() {
    return html`
      ${this.renderSelectedImageInfos()}
      <div class="images">${this.renderImages()}</div>
    `;
  }

  static styles = css`
    :host {
      background-color: pink;
    }
    [is-selected="true"] {
      border: 10px solid red;
    }
    .infos h4 {
      margin: 5px;
    }
    .infos {
      padding-left: 10px;
      padding-bottom: 10px;
      border: 1px solid;
    }
    img {
      image-rendering: pixelated;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-image-list": MyImageList;
  }
}
