import { GuiElement } from "classes/gui/GuiElement";
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ElementRemovedEvent, ElementSelectedEvent } from "types/Events";

@customElement("my-scene-elements")
export class MySceneElements extends LitElement {
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
      return html`<sl-icon
        class="element__type_icon"
        library="boxicons"
        name="bx-image"
      ></sl-icon>`;
    if (element.type == "animation")
      return html`<sl-icon
        class="element__type_icon"
        library="boxicons"
        name="bx-movie-play"
      ></sl-icon>`;
    if (element.type == "text")
      return html`<sl-icon
        class="element__type_icon"
        library="boxicons"
        name="bx-text"
      ></sl-icon>`;
    return html`<span class="type type-unknown">[?]</span>`;
  }

  renderControls(element: GuiElement, index: number) {
    if (element.internalId !== this.selectedElement?.internalId) return html``;
    return html`
      <div class="element__controls">
        <sl-tooltip content="✖ Remove from scene" class="delete-btn">
          <sl-icon-button
            size="small"
            library="boxicons"
            style="font-size: 1rem;"
            name="bxs-trash"
            outline
            @click="${(e: Event) => {
              this.removeElement(element, index);
              e.stopPropagation();
            }}"
          >
          </sl-icon-button>
        </sl-tooltip>
        <sl-tooltip content="⇩ Move up" class="move-btn">
          <sl-icon-button
            size="small"
            library="boxicons"
            style="font-size: 1rem;"
            name="bxs-up-arrow"
            outline
            @click="${(e: Event) => {
              this.moveUp(index);
              e.stopPropagation();
            }}"
          >
          </sl-icon-button>
        </sl-tooltip>

        <sl-tooltip content="⇩ Move down" class="move-btn">
          <sl-icon-button
            size="small"
            library="boxicons"
            style="font-size: 1rem;"
            name="bxs-down-arrow"
            @click="${(e: Event) => {
              this.moveDown(index);
              e.stopPropagation();
            }}"
          >
          </sl-icon-button>
        </sl-tooltip>
      </div>
    `;
  }

  renderElements() {
    return this.guiElements.map((element: GuiElement, index: number) => {
      return html`
        <div
          class="element"
          is-selected="${element.internalId ===
          this.selectedElement?.internalId}"
        >
          <div class="element__type">${this.renderTypeIcon(element)}</div>
          <div
            class="element__name"
            @click="${(e: Event) => {
              this.selectElement(element, index);
              e.stopPropagation();
            }}"
          >
            ${element.name}
          </div>
          ${this.renderControls(element, index)}
        </div>
      `;
    });
  }

  render() {
    return html`
      <div class="elements" @click="${this.handleClick}">
        ${this.renderElements()}
      </div>
    `;
  }
  static styles = css`
    [is-selected="true"] .element__type,
    [is-selected="true"] .element__name {
      color: var(--app-color-primary-600);
    }
    [is-selected="true"] .element__type_icon {
      color: var(--app-color-primary-100);
    }
    .element__name[is-selected] {
      text-decoration: none;
    }
    .element {
      cursor: pointer;
      font-family: var(--sl-font-sans);
      color: var(--app-color-foreground-100);
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
    .element__type {
      flex: 0;
      font-size: 1.4rem;
      color: var(--app-color-foreground-50);
      display: flex;
    }
    .element__type_icon {
      flex: 1;
      color: var(--app-color-foreground-500);
    }
    .element__name {
      flex: 1;
      text-decoration: underline;
      font-size: 1rem;
    }
    .element__controls {
      flex: 0;
      width: 100px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
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
      min-width: 350px;
    }

    .delete-btn sl-icon-button::part(base) {
      color: --app-color-red-500;
    }
    .delete-btn sl-icon-button::part(base):hover,
    .delete-btn sl-icon-button::part(base):focus {
      color: --app-color-red-500;
    .delete-btn sl-icon-button::part(base):active {
      color:--app-color-red-500;
    }

    .move-btn sl-icon-button::part(base) {
      color: --app-color-yellow-500;
    }
    .move-btn sl-icon-button::part(base):hover,
    .move-btn sl-icon-button::part(base):focus {
      color: --app-color-yellow-600;
    }
    .move sl-icon-button::part(base):active {
      color: --app-color-yellow-700;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-scene-elements": MySceneElements;
  }
}
