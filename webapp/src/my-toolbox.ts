import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./my-image-list";
import "./my-animation-list";
import "./my-font-list";

@customElement("my-toolbox")
export class MyToolbox extends LitElement {
  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <div class="tools">
        <h1>Toolbox</h1>
        <div>
          <h3 slot="tab">Fonts</h3>
          <section slot="panel">
            <my-font-list></my-font-list>
          </section>
          <h3 slot="tab">Images</h3>
          <section slot="panel">
            <my-image-list></my-image-list>
          </section>
          <h3 slot="tab">Animations</h3>
          <section slot="panel">
            <my-animation-list></my-animation-list>
          </section>
        </div>
      </div>
    `;
  }

  static styles = css`
    .tools {
      border: 2px solid;
      padding: 10px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-toolbox": MyToolbox;
  }
}
