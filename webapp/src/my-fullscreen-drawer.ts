import { LitElement, html, TemplateResult } from "lit";

import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/components/drawer/drawer";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { registerIconLibrary } from "@shoelace-style/shoelace/dist/utilities/icon-library.js";

import "@shoelace-style/shoelace/dist/themes/dark.css"; //shoelace css
import SlDrawer from "@shoelace-style/shoelace/dist/components/drawer/drawer";
import { setAnimation } from "@shoelace-style/shoelace/dist/utilities/animation-registry";

registerIconLibrary("boxicons", {
  resolver: (name) => {
    let folder = "regular";
    if (name.substring(0, 4) === "bxs-") folder = "solid";
    if (name.substring(0, 4) === "bxl-") folder = "logos";
    return `https://cdn.jsdelivr.net/npm/boxicons@2.1.4/svg/${folder}/${name}.svg`;
  },
  mutator: (svg) => svg.setAttribute("fill", "currentColor"),
});

setBasePath("/assets/shoelace"); // Set the base path to the folder you copied Shoelace's assets to

@customElement("my-fullscreen-drawer")
export abstract class MyFullScreenDrawer extends LitElement {
  @property()
  abstract label: string;

  @query(".fullscreen-drawer")
  private drawer?: SlDrawer;

  abstract renderContent(): TemplateResult;

  show() {
    this.drawer?.show();
  }

  hide() {
    this.drawer?.hide();
  }

  handleCloseRequest(ev: CustomEvent) {
    this.dispatchEvent(new CustomEvent("request-close", { detail: ev.detail }));
  }

  firstUpdated() {
    if (!this.drawer) return;
    setAnimation(this.drawer, "drawer.showEnd", {
      keyframes: [],
      options: { duration: 0 },
    });
    setAnimation(this.drawer, "drawer.showStart", {
      keyframes: [],
      options: { duration: 0 },
    });
  }

  render() {
    return html`
      <sl-drawer
        class="fullscreen-drawer"
        label="${this.label}"
        @sl-request-close="${this.handleCloseRequest}"
        contained
      >
        <slot name="content"></slot>
        ${this.renderContent()}
      </sl-drawer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-fullscreen-drawer": MyFullScreenDrawer;
  }
}
