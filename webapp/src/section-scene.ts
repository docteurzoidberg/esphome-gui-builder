import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import "./my-section";

@customElement("section-scene")
export class SectionScene extends LitElement {
  render() {
    return html`
      <my-section title="Scene" show expand>
        <div slot="header" style="padding: 4px;">
          <sl-button sizee="small" outline variant="primary">Load</sl-button>
          <sl-button sizee="small" outline variant="primary">Save</sl-button>
        </div>
      </my-section>
    `;
  }
  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "section-scene": SectionScene;
  }
}
