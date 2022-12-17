import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { GuiElement } from "interfaces/GuiElement";

@customElement("my-element-settings")
export class MyElementSettings extends LitElement {
  @property()
  selectedElement?: GuiElement;

  connectedCallback(): void {
    super.connectedCallback();
  }

  updateElementX(e: Event) {
    if (!this.selectedElement) return;
    const elementInput = e.target as HTMLInputElement;
    this.selectedElement.x = parseInt(elementInput.value, 10);
    this.requestUpdate();
    this.dispatchElementMoved(this.selectedElement);
  }

  updateElementY(e: Event) {
    if (!this.selectedElement) return;
    const elementInput = e.target as HTMLInputElement;
    this.selectedElement.y = parseInt(elementInput.value, 10);
    this.requestUpdate();
    this.dispatchElementMoved(this.selectedElement);
  }

  dispatchElementMoved(element: GuiElement) {
    this.dispatchEvent(new CustomEvent("element-moved", { detail: element }));
  }

  render() {
    if (!this.selectedElement) return html``;
    return html`
      <h1>Element settings</h1>
      <div class="elem-settings">
        <div>id: ${this.selectedElement.id}</div>
        <div>type: ${this.selectedElement.type}</div>
        <div>name: ${this.selectedElement.name}</div>
        <div>x: ${this.selectedElement.x}</div>
        <div>
          <input
            type="number"
            value="${this.selectedElement.x}"
            step="1"
            @change="${this.updateElementX}"
          />
        </div>
        <div>y: ${this.selectedElement.y}</div>
        <div>
          <input
            type="number"
            value="${this.selectedElement.y}"
            step="1"
            @change="${this.updateElementY}"
          />
        </div>
        <div>zorder: ${this.selectedElement.zorder}</div>
      </div>
      <h1>Element params</h1>
      <div class="elem-params">
        <div>//todo: params depends on element's type</div>
        <div>params: ${this.selectedElement.params}</div>
      </div>
    `;
  }

  static styles = css`
    :host {
      background-color: yellow;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element-settings": MyElementSettings;
  }
}
