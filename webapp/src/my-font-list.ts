import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./my-image-list";
import "./my-animation-list";

@customElement("my-font-list")
export class MyFontList extends LitElement {
  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html` <div class="fonts"></div> `;
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-font-list": MyFontList;
  }
}
