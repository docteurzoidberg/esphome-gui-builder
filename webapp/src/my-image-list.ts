import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { EspHomeImageJSON } from "interfaces/EspHomeImageJSON";
import { GuiElement } from "interfaces/GuiElement";
const imageScale = 5;

@customElement("my-image-list")
export class MyImageList extends LitElement {
  @property({ type: Array })
  images = [];

  @property({ type: Object })
  selectedImage?: EspHomeImageJSON;

  @property({ type: Boolean })
  imagesLoaded = false;

  haveLocalData(): boolean {
    const localImagesStr = localStorage.getItem("images.json");
    if (!localImagesStr || localImagesStr == "") return false;
    return true;
  }

  raiseImagesLoaded() {
    const event = new CustomEvent("images-loaded", {
      detail: this.images,
    });
    this.dispatchEvent(event);
  }

  selectImage(image: EspHomeImageJSON) {
    this.selectedImage = image;
    this.dispatchEvent(new CustomEvent("image-selected", { detail: image }));
  }

  handleDragStart(ev: DragEvent, image: EspHomeImageJSON) {
    //console.log("drag-start", ev);

    //TODO: generate uniques ids !
    const newGuiElement: GuiElement = {
      id: image.name,
      type: "image",
      name: image.name,
      x: 0,
      y: 0,
      zorder: 1,
      data: image,
    };
    ev.dataTransfer!.setData(
      "application/my-app",
      JSON.stringify(newGuiElement)
    );
    ev.dataTransfer!.effectAllowed = "move";
  }

  connectedCallback() {
    super.connectedCallback();
    fetch("./images.json")
      .then((response) => response.json())
      .then((json) => {
        this.images = json;
        this.raiseImagesLoaded();
        //console.dir(json);
      });
  }

  renderImages() {
    if (!this.images) return;
    return this.images.map((image: EspHomeImageJSON) => {
      return html`
        <img
          class="image"
          draggable="true"
          @dragstart="${(ev: DragEvent) => this.handleDragStart(ev, image)}"
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
    return html`<div class="images">${this.renderImages()}</div> `;
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
