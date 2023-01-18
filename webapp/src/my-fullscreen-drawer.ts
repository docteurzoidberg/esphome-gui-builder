import { LitElement, html, TemplateResult } from "lit";

import { customElement, property, query } from "lit/decorators.js";

import SlDrawer from "@shoelace-style/shoelace/dist/components/drawer/drawer";
import { setAnimation } from "@shoelace-style/shoelace/dist/utilities/animation-registry";

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
