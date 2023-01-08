import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { MySetting } from "my-setting";

@customElement("my-text-setting")
export class MyTextSetting extends MySetting {
  @property({ type: String })
  value?: string;

  handleValueChanged(e: any) {
    this.value = e.target.value.toString();
    const event = new CustomEvent("change", {
      detail: this.value,
    });
    this.dispatchEvent(event);
  }

  renderEditableValue() {
    return html`
      <div class="value">
        <sl-input
          type="text"
          size="small"
          @sl-change="${this.handleValueChanged}"
          value="${this.value || ""}"
        >
        </sl-input>
      </div>
    `;
  }

  renderNotEditableValue() {
    return html`
      <div class="value">
        <span class="textspan">${this.value || ""}</span>
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
    sl-input {
      width: 150px;
      display: inline-block;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-text-setting": MyTextSetting;
  }
}
