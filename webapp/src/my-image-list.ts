import { EspHomeImage } from "esphome/image/EspHomeImage";
import { EspHomeImageJSON } from "esphome/image/EspHomeImageJSON";
import { GuiElementJSON } from "gui/GuiElementJSON";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-image-list")
export class MyImageList extends LitElement {
  @property({ type: Array })
  images: Array<EspHomeImage> = [];

  @property({ type: Object })
  selectedImage?: EspHomeImage;

  @property({ type: Boolean })
  imagesLoaded = false;

  @property({ type: Number })
  displayScale = 1;

  dragImg = new Image();

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

  selectImage(image: EspHomeImage) {
    this.selectedImage = image;
    this.dispatchEvent(new CustomEvent("image-selected", { detail: image }));
  }

  handleDragStart(ev: DragEvent, image: EspHomeImage) {
    const elem: GuiElementJSON = {
      id: "id_" + image.name, //TODO: generate uniques ids !
      name: image.name,
      x: 0, //overwriten when dropped
      y: 0, //overwriten when dropped
      zorder: 0,
      type: "image",
      jsonData: image.originalData,
    };

    //TODDDO!
    ev.dataTransfer!.setData(
      "application/gui-element-json",
      JSON.stringify(elem)
    );

    //ev.dataTransfer!.setData("application/esphome-image-json", image.getJSON());
    ev.dataTransfer!.setDragImage(this.dragImg, 0, 0);
    ev.dataTransfer!.effectAllowed = "move";
  }

  connectedCallback() {
    super.connectedCallback();
    this.dragImg.src = "drag_png.png";
    fetch("./images.json")
      .then((response) => response.json())
      .then((json: Array<EspHomeImageJSON>) => {
        this.images = json.map((image) => {
          return new EspHomeImage(image);
        });
        this.raiseImagesLoaded();
        //console.dir(json);
      });
  }

  renderImages() {
    if (!this.images) return;
    return this.images.map((image: EspHomeImage) => {
      return html`
        <img
          class="image"
          draggable="true"
          is-selected="${this.selectedImage?.name === image.name}"
          src="${image.dataurl}"
          width=${image.width * this.displayScale}
          height=${image.height * this.displayScale}
          @dragstart="${(ev: DragEvent) => this.handleDragStart(ev, image)}"
          @click="${() => this.selectImage(image)}"
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
    .images {
      width: 100ch;
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
