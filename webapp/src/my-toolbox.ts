import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./my-image-list";
import "./my-animation-list";
import "./my-font-list";
import "./my-section";

@customElement("my-toolbox")
export class MyToolbox extends LitElement {
  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <div class="tools">
        <h2>Toolbox</h2>
        <div>
          <my-section>
            <span slot="title">Fonts</span>
            <my-font-list></my-font-list>
          </my-section>
          <my-section>
            <span slot="title">Images</span>
            <my-image-list></my-image-list>
          </my-section>
          <my-section>
            <span slot="title">Animations</span>
            <my-animation-list></my-animation-list>
          </my-section>
        </div>
      </div>
    `;
  }

  static styles = css`
    .tools {
      border: 2px solid;
      padding: 10px;
    }

    h2,
    h3 {
      text-decoration: underline;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-toolbox": MyToolbox;
  }
}
