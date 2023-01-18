import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { MyFullScreenDrawer } from "my-fullscreen-drawer";
import { drawerCSS } from "my-fullscreen-drawer.styles";

@customElement("drawer-settings")
export class DrawerSettings extends MyFullScreenDrawer {
  @property()
  label: string = "Settings";

  renderContent() {
    return html` <div class="container">settings content</div> `;
  }
  static styles = [
    drawerCSS,
    css`
      .container {
        background-color: cyan;
        font-size: 80px;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "drawer-settings": DrawerSettings;
  }
}
