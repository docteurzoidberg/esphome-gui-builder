import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { MyFullScreenDrawer } from "./my-fullscreen-drawer";
import { drawerCSS } from "my-fullscreen-drawer.styles";

@customElement("drawer-infos")
export class DrawerInfos extends MyFullScreenDrawer {
  @property()
  label: string = "Infos";

  renderContent() {
    return html` <div class="container">infos content</div> `;
  }
  static styles = [drawerCSS];
}

declare global {
  interface HTMLElementTagNameMap {
    "drawer-infos": DrawerInfos;
  }
}
