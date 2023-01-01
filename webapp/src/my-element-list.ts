import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { GuiElement } from "gui/GuiElement";

@customElement("my-element-list")
export class MyElementList extends LitElement {
  @property({ type: Object, reflect: true })
  selectedElement?: GuiElement;

  @property()
  guiElements: Array<GuiElement> = [];

  connectedCallback(): void {
    super.connectedCallback();
  }

  selectElement(element: GuiElement | undefined) {
    this.selectedElement = element;
    this.dispatchEvent(
      new CustomEvent("element-selected", { detail: element })
    );
  }

  removeElement(elementToRemove: GuiElement) {
    this.selectElement(undefined);
    this.dispatchEvent(
      new CustomEvent("element-removed", { detail: elementToRemove })
    );
  }

  handleClick() {
    this.selectedElement = undefined;
    this.dispatchEvent(
      new CustomEvent("element-selected", { detail: undefined })
    );
  }

  renderTypeIcon(element: GuiElement) {
    if (element.type == "image")
      return html`<img src="tag_png.png" class="type type-png" alt="png" />`;
    if (element.type == "animation")
      return html`<img src="tag_gif.png" class="type type-gif" alt="gif" />`;
    if (element.type == "text")
      return html`<img src="tag_text.png" class="type type-text" alt="text" />`;
    return html`<span class="type type-unknown">[?]</span>`;
  }

  renderControls(element: GuiElement) {
    if (element.id !== this.selectedElement?.id) return html``;
    return html`
      <button
        class="delete"
        type="button"
        @click="${(e: Event) => {
          this.removeElement(element);
          e.stopPropagation();
        }}"
      >
        ✖
      </button>
    `;
  }

  renderElements() {
    return this.guiElements.map((element: GuiElement) => {
      return html`
        <div
          class="element"
          is-selected="${element.id === this.selectedElement?.id}"
        >
          ${this.renderTypeIcon(element)}
          <span
            class="elementname"
            @click="${(e: Event) => {
              this.selectElement(element);
              e.stopPropagation();
            }}"
            >${element.name}</span
          >
          ${this.renderControls(element)}
        </div>
      `;
    });
  }

  render() {
    return html`
      <h3>Elements</h3>
      <div class="elements" @click="${this.handleClick}">
        ${this.renderElements()}
      </div>
    `;
  }

  static styles = css`
    [is-selected="true"] {
      border: 5px solid red;
      margin: 5px;
      padding: 5px;
    }
    h3 {
      text-decoration: underline;
    }
    button {
      font-family: Wendy;
    }
    .element {
      cursor: pointer;
    }
    .elementname {
      text-decoration: underline;
    }
    [is-selected="true"] .elementname {
      text-decoration: none;
    }
    .delete {
      color: red;
    }
    .elements {
      height: 100vh;
      min-width: 350px;
    }
    .type {
      width: 38px;
      image-rendering: pixelated;
      display: inline-block;
      vertical-align: middle;
      opacity: 0.8;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element-list": MyElementList;
  }
}
