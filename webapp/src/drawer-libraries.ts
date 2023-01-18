import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { MyFullScreenDrawer } from "my-fullscreen-drawer";
import { drawerCSS } from "styles/my-fullscreen-drawer.styles";

@customElement("drawer-libraries")
export class DrawerLibraries extends MyFullScreenDrawer {
  @property()
  label: string = "Library Manager";

  renderContent() {
    return html` <div class="container">libraries content</div> `;
  }
  static styles = [drawerCSS];
}

declare global {
  interface HTMLElementTagNameMap {
    "drawer-libraries": DrawerLibraries;
  }
}
