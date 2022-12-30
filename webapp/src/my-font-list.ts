import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./my-image-list";
import "./my-animation-list";

import { EspHomeFont } from "esphome/font/EspHomeFont";
import { EspHomeFontJSON } from "esphome/font/EspHomeFontJSON";

const imageScale = 1;

@customElement("my-font-list")
export class MyFontList extends LitElement {
  @property({ type: Array })
  fonts: Array<EspHomeFont> = [];

  @property({ type: Object })
  selectedFont?: EspHomeFont;

  @property({ type: Boolean })
  fontsLoaded = false;

  haveLocalData(): boolean {
    const localFontsStr = localStorage.getItem("fonts.json");
    if (!localFontsStr || localFontsStr == "") return false;
    return true;
  }

  raiseFontsLoaded() {
    const event = new CustomEvent("fonts-loaded", {
      detail: this.fonts,
    });
    this.dispatchEvent(event);
  }

  loadLocalData() {
    const localFontsStr = localStorage.getItem("fonts.json");
    if (!localFontsStr) return; //ts possibly null
    let base64 = localFontsStr;
    let base64Parts = base64.split(",");
    let fileFormat = base64Parts[0].split(";")[1];
    let fileContent = base64Parts[1];
    let file = new File([fileContent], "fonts.json", { type: fileFormat });
    //TODO: read file and parse JSON
    this.fontsLoaded = true;
    this.raiseFontsLoaded();
    return file;
  }

  loadXhrData() {
    fetch("./fonts.json")
      .then((response) => response.json())
      .then((json: Array<EspHomeFontJSON>) => {
        this.fonts = json.map((font: EspHomeFontJSON) => new EspHomeFont(font));
        this.fontsLoaded = true;
        this.raiseFontsLoaded();
        //console.dir(json);
      });
  }

  handleDragStart(ev: DragEvent, font: EspHomeFont) {
    //console.log("drag-start", ev);
    //TODO: generate uniques ids !
    /*
    const newGuiElement: GuiElement = {
      id: font.data!.name,
      type: "text",
      name: font.data!.name,
      x: 0,
      y: 0,
      zorder: 1,
      data: font.data,
    };
    ev.dataTransfer!.setData(
      "application/my-app",
      JSON.stringify(newGuiElement)
    );
    */
    const img = new Image();
    img.src = "drag_text.png";
    ev.dataTransfer!.setDragImage(img, 0, 0);
    ev.dataTransfer!.effectAllowed = "move";
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.fontsLoaded) return;
    if (this.haveLocalData()) {
      this.loadLocalData();
    } else {
      this.loadXhrData();
    }
  }

  renderFontSample(font: EspHomeFont) {
    if (!font.data) return html`no data`;
    const result = font.render(font.data.glyphstr);
    //const result = font.render("1122");
    if (!result) return html`no result`;
    return html`<img
      @dragstart="${(ev: DragEvent) => this.handleDragStart(ev, font)}"
      src="${result.dataUrl}"
      width="${result.width * imageScale}"
      height="${result.height * imageScale}"
    />`;
    //return html`<span>${font.glyphstr}</span>`;
  }

  renderFonts() {
    return this.fonts.map((font: EspHomeFont) => {
      return html`<div
        class="font"
        @click="${() => (this.selectedFont = font)}"
        is-selected="${this.selectedFont?.data?.name == font.data?.name}"
      >
        <span class="font-name">${font.data?.name}</span> &gt;
        <span class="font-sample">${this.renderFontSample(font)}</span>
      </div>`;
    });
  }

  render() {
    return html` <div class="fonts">${this.renderFonts()}</div> `;
  }

  static styles = css`
    [is-selected="true"] {
      border: 2px solid red;
    }
    img {
      image-rendering: pixelated;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-font-list": MyFontList;
  }
}
