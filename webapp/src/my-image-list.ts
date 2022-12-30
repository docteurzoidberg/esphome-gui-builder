import { EspHomeImage } from "esphome/image/EspHomeImage";
import { EspHomeImageJSON } from "esphome/image/EspHomeImageJSON";
import { GuiElementJSON } from "gui/GuiElementJSON";
import { ImageGuiElement } from "gui/image/ImageGuiElement";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

const imageScale = 5;

@customElement("my-image-list")
export class MyImageList extends LitElement {
  @property({ type: Array })
  images: Array<EspHomeImage> = [];

  @property({ type: Object })
  selectedImage?: EspHomeImage;

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

  selectImage(image: EspHomeImage) {
    this.selectedImage = image;
    this.dispatchEvent(new CustomEvent("image-selected", { detail: image }));
  }

  handleDragStart(ev: DragEvent, image: EspHomeImage) {
    //console.log("drag-start", ev);

    /*
    const imageElement = new ImageGuiElement({
      id: "id_" + image.name, //TODO: generate uniques ids !
      name: image.name,
      x: 0, //overwriten when dropped
      y: 0, //overwriten when dropped
      zorder: 0,
      image: image.originalData,
    });
*/
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
    const img = new Image();
    img.src = "drag_png.png";
    ev.dataTransfer!.setDragImage(img, 0, 0);
    ev.dataTransfer!.effectAllowed = "move";
  }

  connectedCallback() {
    super.connectedCallback();
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
