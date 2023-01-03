import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { GuiElement } from "classes/gui/GuiElement";
import { ElementRemovedEvent, ElementSelectedEvent } from "types/Events";

import "my-icon-button";

@customElement("my-element-list")
export class MyElementList extends LitElement {
  @property({ type: Object, reflect: true })
  selectedElement?: GuiElement;

  @property()
  guiElements: GuiElement[] = [];

  connectedCallback(): void {
    super.connectedCallback();
  }

  selectElement(
    element: GuiElement | undefined = undefined,
    index: number | undefined = undefined
  ) {
    this.selectedElement = element;
    this.dispatchEvent(
      new CustomEvent("element-selected", {
        detail: { element: element, index: index } as ElementSelectedEvent,
      })
    );
  }

  removeElement(elementToRemove: GuiElement, index: number) {
    this.selectElement();
    this.dispatchEvent(
      new CustomEvent("element-removed", {
        detail: {
          element: elementToRemove,
          index: index,
        } as ElementRemovedEvent,
      })
    );
  }

  moveUp(index: number) {
    if (index > 0) {
      // Use the spread operator (...) to create a new array
      // with the items in the correct order

      //this.guiElements[index].order(index - 1);

      this.guiElements = [
        ...this.guiElements.slice(0, index - 1),
        this.guiElements[index],
        this.guiElements[index - 1],
        ...this.guiElements.slice(index + 1),
      ];
    }
  }

  moveDown(index: number) {
    if (index < this.guiElements.length - 1) {
      // Use the spread operator (...) to create a new array
      // with the items in the correct order
      //this.guiElements[index].order(index + 1);

      this.guiElements = [
        ...this.guiElements.slice(0, index),
        this.guiElements[index + 1],
        this.guiElements[index],
        ...this.guiElements.slice(index + 2),
      ];
    }
  }

  handleClick() {
    this.selectElement();
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

  renderControls(element: GuiElement, index: number) {
    if (element.id !== this.selectedElement?.id) return html``;
    return html`
      <my-icon-button
        class="delete"
        text="✖ Remove item"
        color="red"
        icon="✖"
        @click="${(e: Event) => {
          this.removeElement(element, index);
          e.stopPropagation();
        }}"
      >
      </my-icon-button>
      <my-icon-button
        text="⇧ Move item up (front)"
        icon="⇧"
        color="yellow"
        @click="${(e: Event) => {
          this.moveUp(index);
          e.stopPropagation();
        }}"
      ></my-icon-button>
      <my-icon-button
        text="⇩ Move item down (back)"
        icon="⇩"
        color="yellow"
        @click="${(e: Event) => {
          this.moveDown(index);
          e.stopPropagation();
        }}"
      ></my-icon-button>
    `;
  }

  renderElements() {
    return this.guiElements.map((element: GuiElement, index: number) => {
      return html`
        <div
          class="element"
          is-selected="${element.id === this.selectedElement?.id}"
        >
          ${this.renderTypeIcon(element)}
          <span
            class="elementname"
            @click="${(e: Event) => {
              this.selectElement(element, index);
              e.stopPropagation();
            }}"
            >${element.name}</span
          >
          ${this.renderControls(element, index)}
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
    .moveup,
    .movedown {
      color: yellow;
      font-weight: bold;
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
