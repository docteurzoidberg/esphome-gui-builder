import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "my-image-list";
import "my-animation-list";
import "my-font-list";
import "my-section";

@customElement("my-toolbox")
export class MyToolbox extends LitElement {
  @property()
  dataLoaded = false;

  @property()
  displayScale = 3;

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
      const event = new CustomEvent("toolbox-loaded", { detail: null });
      this.dispatchEvent(event);
    }
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <div class="tools">
        <my-section title="Fonts" expand>
          <sl-icon library="boxicons" name="bx-text" slot="icon"></sl-icon>
          <my-font-list
            .displayScale="${this.displayScale}"
            @fonts-loaded="${this.handleFontsLoaded}"
          ></my-font-list>
        </my-section>
        <my-section title="Images">
          <sl-icon library="boxicons" name="bx-image" slot="icon"></sl-icon>
          <my-image-list
            .displayScale="${this.displayScale}"
            @images-loaded="${this.handleImagesLoaded}"
          ></my-image-list>
        </my-section>
        <my-section title="Animations">
          <sl-icon library="boxicons" name="bx-movie" slot="icon"></sl-icon>
          <my-animation-list
            .displayScale="${this.displayScale}"
            @animations-loaded="${this.handleAnimationsLoaded}"
          ></my-animation-list>
        </my-section>
      </div>
    `;
  }

  static styles = css`
    :host {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: stretch;
    }
    .tools {
      //border: 2px solid;
      max-height: 100%;
      flex: 1;
      overflow-y: scroll;
      background-color: pink;
    }
    h2 {
      margin-top: 0;
    }
    h2,
    h3 {
      text-decoration: underline;
    }
    [expand] .title__icon {
      color: var(--app-color-primary-800);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-toolbox": MyToolbox;
  }
}
