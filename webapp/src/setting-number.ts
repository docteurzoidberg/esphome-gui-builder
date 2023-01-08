import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { MySetting } from "my-setting";

@customElement("my-number-setting")
export class MyNumberSetting extends MySetting {
  @property({ type: Number })
  value?: number;

  @property({ type: Number })
  min?: number;

  @property({ type: Number })
  max?: number;

  @property({ type: Number })
  step?: number;

  handleValueChanged(e: any) {
    this.value = Number(e.target.value);
    const event = new CustomEvent("change", {
      detail: this.value,
    });
    this.dispatchEvent(event);
  }

  renderEditableValue() {
    return html`
      <div class="value">
        <sl-input
          type="number"
          size="small"
          min="${ifDefined(this.min)}"
          max="${ifDefined(this.max)}"
          step="${ifDefined(this.step)}"
          @sl-change="${this.handleValueChanged}"
          value="${this.value || 0}"
        >
        </sl-input>
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
    sl-input {
      width: 150px;
      display: inline-block;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-number-setting": MyNumberSetting;
  }
}
