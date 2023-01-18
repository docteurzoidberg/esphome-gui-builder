import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-setting")
export abstract class MySetting extends LitElement {
  @property({ type: String })
  label = "";

  @property({ type: String })
  name = "";

  value?: any;

  @property({ type: Boolean })
  editable = false;

  @property({ type: Boolean })
  disabled = false;

  abstract renderEditableValue(): any;
  abstract renderNotEditableValue(): any;

  renderLabel() {
    return html`<label class="label">${this.label}:</label>`;
  }

  render() {
    return html`
      <div class="setting">
        ${this.renderLabel()}
        ${this.editable
          ? this.renderEditableValue()
          : this.renderNotEditableValue()}
      </div>
    `;
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-setting": MySetting;
  }
}
