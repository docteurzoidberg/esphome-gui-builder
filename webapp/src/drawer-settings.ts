import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { MyFullScreenDrawer } from "my-fullscreen-drawer";
import { drawerCSS } from "styles/my-fullscreen-drawer.styles";

const themeOptions = [
  { value: "sl-dark", label: "Default" },
  { value: "gruvbox", label: "Gruvbox" },
  { value: "dracula", label: "Dracula" },
];

@customElement("drawer-settings")
export class DrawerSettings extends MyFullScreenDrawer {
  @property()
  label: string = "Settings";

  @property({ type: String })
  theme: string = "sl-dark";

  handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.theme = target.value;
    this.dispatchEvent(
      new CustomEvent("theme-change", {
        detail: this.theme,
      })
    );
  }

  renderThemeOptions() {
    return themeOptions.map(
      (option) =>
        html`<sl-option value="${option.value}">${option.label}</sl-option>`
    );
  }

  renderContent() {
    return html`
      <div class="container">
        <div class="row">
          Theme:
          <sl-select value="${this.theme}" @sl-change="${this.handleChange}"
            >${this.renderThemeOptions()}</sl-select
          >
        </div>
      </div>
    `;
  }
  static styles = [drawerCSS, css``];
}

declare global {
  interface HTMLElementTagNameMap {
    "drawer-settings": DrawerSettings;
  }
}
