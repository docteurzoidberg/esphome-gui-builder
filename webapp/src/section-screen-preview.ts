import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import "./my-section";

@customElement("section-screen-preview")
export class SectionScreenPreview extends LitElement {
  render() {
    return html`
      <my-section title="Preview" show closable expand
        >Screen preview</my-section
      >
    `;
  }
  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "section-screen-preview": SectionScreenPreview;
  }
}
