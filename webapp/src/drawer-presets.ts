import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { MyFullScreenDrawer } from "my-fullscreen-drawer";
import { drawerCSS } from "my-fullscreen-drawer.styles";

@customElement("drawer-presets")
export class DrawerPresets extends MyFullScreenDrawer {
  @property()
  label: string = "Presets";

  renderContent() {
    return html` <div class="container">presets content</div> `;
  }
  static styles = [drawerCSS];
}

declare global {
  interface HTMLElementTagNameMap {
    "drawer-presets": DrawerPresets;
  }
}
