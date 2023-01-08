import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-wip-logo")
export class MyWipLogo extends LitElement {
  render() {
    return html`<div class="wip-logo">
      <img src="work-in-progress.png" height="32" />
    </div>`;
  }
  static styles = css`
    img {
      image-rendering: pixelated;
    }
    .wip-logo {
      margin-top: auto;
      align-items: center;
      float: right;
    }
    .wip-logo img {
      vertical-align: middle;
      margin-right: 16px;
      image-rendering: pixelated;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-wip-logo": MyWipLogo;
  }
}
