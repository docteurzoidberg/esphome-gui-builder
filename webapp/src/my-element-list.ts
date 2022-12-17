import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { GuiElement } from "interfaces/GuiElement";

@customElement("my-element-list")
export class MyElementList extends LitElement {
  @property()
  selectedElement?: GuiElement;

  @property()
  guiElements: Array<GuiElement> = [];

  connectedCallback(): void {
    super.connectedCallback();
  }

  selectElement(element: GuiElement) {
    this.selectedElement = element;
    this.dispatchEvent(
      new CustomEvent("element-selected", { detail: element })
    );
  }

  renderElements() {
    return this.guiElements.map((element: GuiElement) => {
      return html`
        <div
          class="element"
          is-selected="${element.id === this.selectedElement?.id}"
          @click="${() => this.selectElement(element)}"
        >
          <h4>${element.name}</h4>
        </div>
      `;
    });
  }

  render() {
    return html`
      <h1>Elements</h1>
      <div class="elements">${this.renderElements()}</div>
    `;
  }

  static styles = css`
    :host {
      background-color: purple;
    }
    [is-selected="true"] {
      border: 5px solid red;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element-list": MyElementList;
  }
}
