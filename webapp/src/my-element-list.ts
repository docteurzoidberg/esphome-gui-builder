import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { GuiElement } from "classes/gui/GuiElement";
import { ElementRemovedEvent, ElementSelectedEvent } from "types/Events";

@customElement("my-element-list")
export class MyElementList extends LitElement {
  render() {
    return html` <h3>Elements</h3> `;
  }

  static styles = css`
    [is-selected="true"] {
      border: 5px solid red;
      margin: 5px;
      padding: 5px;
    }
    [is-selected="true"] .elementname {
      text-decoration: none;
    }
    .element {
      cursor: pointer;
    }
    .elementname {
      text-decoration: underline;
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
      //height: 100vh;
      min-width: 350px;
    }
    .type {
      width: 38px;
      image-rendering: pixelated;
      display: inline-block;
      vertical-align: middle;
      opacity: 0.8;
    }

    .delete-btn sl-icon-button::part(base) {
      color: #b00052;
    }
    .delete-btn sl-icon-button::part(base):hover,
    .delete-btn sl-icon-button::part(base):focus {
      color: #c91368;
    }
    .delete-btn sl-icon-button::part(base):active {
      color: #960032;
    }
    .move-btn sl-icon-button::part(base) {
      color: #e6ca4f;
    }
    .move-btn sl-icon-button::part(base):hover,
    .move-btn sl-icon-button::part(base):focus {
      color: #f3e73f;
    }
    .move sl-icon-button::part(base):active {
      color: #cee21c;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element-list": MyElementList;
  }
}
