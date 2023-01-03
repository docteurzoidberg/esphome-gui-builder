import { LitElement, html, property, customElement } from "lit-element";

import "./my-tooltip";

@customElement("my-icon-button")
class MyIconButton extends LitElement {
  // Declare the properties
  @property({ type: String }) text = "";
  @property({ type: String }) icon = "";
  @property({ type: String }) background = "#555";
  @property({ type: String }) color = "white";
  @property({ type: String }) fontSize = "16px";
  @property({ type: String }) padding = "0px";

  handleClick(e: Event) {
    this.dispatchEvent(new CustomEvent("click", {}));
    e.stopPropagation();
  }

  render() {
    return html`
      <style>
        button {
          border: none;
          color: ${this.color};
          background-color: ${this.background};
          font-size: ${this.fontSize};
          padding: ${this.padding};
          cursor: pointer;
          height: 22px;
          width: 22px;
        }
      </style>
      <my-tooltip .text="${this.text}">
        <button @click="${(e: Event) => this.handleClick(e)}">
          ${this.icon}
        </button>
      </my-tooltip>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "my-icon-button": MyIconButton;
  }
}
