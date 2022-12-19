import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./my-image-list";
import "./my-animation-list";

import { EspHomeFont } from "interfaces/EspHomeFont";
import { Font } from "./classes/Font";

@customElement("my-font-list")
export class MyFontList extends LitElement {
  @property({ type: Array })
  fonts: Array<Font> = [];

  @property({ type: Object })
  selectedFont?: Font;

  connectedCallback() {
    super.connectedCallback();
    fetch("./fonts.json")
      .then((response) => response.json())
      .then((json: Array<EspHomeFont>) => {
        this.fonts = json.map((font: EspHomeFont) => new Font(font));
        console.dir(json);
      });
  }

  renderFontSample(font: Font) {
    if (!font.data) return html`no data`;
    const result = font.render(font.data.glyphstr);
    if (!result) return html`no result`;
    return html`<img
      src="${result.dataUrl}"
      width="${result.width}"
      height="${result.height}"
    />`;
    //return html`<span>${font.glyphstr}</span>`;
  }

  renderFonts() {
    return this.fonts.map((font: Font) => {
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-font-list": MyFontList;
  }
}
