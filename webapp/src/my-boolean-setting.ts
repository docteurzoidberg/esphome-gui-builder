import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/components/switch/switch";

import { MySetting } from "my-setting";

@customElement("my-boolean-setting")
export class MyBooleanSetting extends MySetting {
  @property({ type: Boolean, reflect: true })
  value?: boolean;

  handleValueChanged(e: any) {
    this.dispatchEvent(new CustomEvent("change", { detail: e.target.checked }));
  }

  renderEditableValue() {
    return html`
      <div class="value">
        <sl-switch
          size="small"
          ?checked="${this.value}"
          @sl-change="${this.handleValueChanged}"
        >
        </sl-switch>
      </div>
    `;
  }

  renderNotEditableValue() {
    return html`
      <div class="value">
        <span class="textspan">${this.value?.toString()}</span>
      </div>
    `;
  }

  static styles = css`
    .label {
      display: inline-block;
      width: 75px;
    }
    .value {
      display: inline-block;
    }
    .textspan {
      display: inline-block;
      width: 135px;
      color: lightgray;
      font-family: Wendy;
    }
    sl-switch {
      display: inline-block;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-boolean-setting": MyBooleanSetting;
  }
}
