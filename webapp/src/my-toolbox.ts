import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./my-image-list";
import "./my-animation-list";
import "./my-font-list";
import "./my-section";

@customElement("my-toolbox")
export class MyToolbox extends LitElement {
  @property()
  dataLoaded = false;

  fontsLoaded = false;
  animationsLoaded = false;
  imagesLoaded = false;

  handleFontsLoaded() {
    this.fontsLoaded = true;
    this.checkRaiseLoaded();
  }
  handleAnimationsLoaded() {
    this.animationsLoaded = true;
    this.checkRaiseLoaded();
  }
  handleImagesLoaded() {
    this.imagesLoaded = true;
    this.checkRaiseLoaded();
  }

  checkRaiseLoaded() {
    if (this.dataLoaded) return;
    if (this.fontsLoaded && this.imagesLoaded && this.animationsLoaded) {
      this.dataLoaded = true;
      const event = new CustomEvent("toolbox-loaded", { detail: {} });
      this.dispatchEvent(event);
    }
  }

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
            <my-font-list
              @fonts-loaded="${this.handleFontsLoaded}"
            ></my-font-list>
          </my-section>
          <my-section>
            <span slot="title">Images</span>
            <my-image-list
              @images-loaded="${this.handleImagesLoaded}"
            ></my-image-list>
          </my-section>
          <my-section>
            <span slot="title">Animations</span>
            <my-animation-list
              @animations-loaded="${this.handleAnimationsLoaded}"
            ></my-animation-list>
          </my-section>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      overflow: scroll;
    }
    .tools {
      //border: 2px solid;
      background-color: #333;
      padding: 10px;
    }
    h2 {
      margin-top: 0;
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
