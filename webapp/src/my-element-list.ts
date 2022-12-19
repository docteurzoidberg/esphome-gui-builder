import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { GuiElement } from "interfaces/GuiElement";

@customElement("my-element-list")
export class MyElementList extends LitElement {
  @property({ type: Object, reflect: true })
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
          <span>${element.name}</span>
        </div>
      `;
    });
  }

  render() {
    return html`
      <h3>Elements</h3>
      <div class="elements">${this.renderElements()}</div>
    `;
  }

  static styles = css`
    [is-selected="true"] {
      border: 5px solid red;
    }
    h3 {
      text-decoration: underline;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element-list": MyElementList;
  }
}
