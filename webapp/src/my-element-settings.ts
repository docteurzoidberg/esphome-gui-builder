import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { GuiElement } from "gui/GuiElement";

import "./my-section";

@customElement("my-element-settings")
export class MyElementSettings extends LitElement {
  @property()
  selectedElement?: GuiElement;

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("element-moved", () => {
      this.requestUpdate();
    });
  }

  updateElementX(e: Event) {
    if (!this.selectedElement) return;
    const elementInput = e.target as HTMLInputElement;
    this.selectedElement.x = parseInt(elementInput.value, 10);
    this.requestUpdate();
  }

  updateElementY(e: Event) {
    if (!this.selectedElement) return;
    const elementInput = e.target as HTMLInputElement;
    this.selectedElement.y = parseInt(elementInput.value, 10);
    this.requestUpdate();
  }

  updateElementZ(e: Event) {
    if (!this.selectedElement) return;
    const elementInput = e.target as HTMLInputElement;
    this.selectedElement.zorder = parseInt(elementInput.value, 10);
    this.requestUpdate();
  }

  render() {
    if (!this.selectedElement) return html``;
    return html`
      <my-section>
        <span slot="title">Element settings</span>
        <div class="elem-settings">
          <div>id: ${this.selectedElement.id}</div>
          <div>type: ${this.selectedElement.type}</div>
          <div>name: ${this.selectedElement.name}</div>
          <div>
            <label for="selectedElementX">x: ${this.selectedElement.x}</label>
            <input
              type="number"
              id="selectedElementX"
              .value="${this.selectedElement.x.toString()}"
              step="1"
              @change="${this.updateElementX}"
            />
          </div>
          <div>
            <label for="selectedElementY">y: ${this.selectedElement.y}</label>
            <input
              type="number"
              id="selectedElementY"
              .value="${this.selectedElement.y.toString()}"
              step="1"
              @change="${this.updateElementY}"
            />
          </div>
          <div>
            <label for="zorder">zorder: ${this.selectedElement.zorder}</label>
            <input
              type="number"
              id="zorder"
              .value="${this.selectedElement.zorder.toString()}"
              step="1"
              @change="${this.updateElementZ}"
            />
          </div>
        </div>
      </my-section>
      <my-section>
        <span slot="title">Element parameters</span>
        <div class="elem-params">
          <div>//todo: params depends on element's type</div>
          <div>params: ${this.selectedElement.params}</div>
        </div>
      </my-section>
    `;
  }

  static styles = css`
    :host {
      background-color: yellow;
    }
    h2 {
      text-decoration: underline;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element-settings": MyElementSettings;
  }
}
