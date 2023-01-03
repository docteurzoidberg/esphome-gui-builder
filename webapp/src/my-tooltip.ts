import { LitElement, html, property, customElement } from "lit-element";

@customElement("my-tooltip")
class MyTooltip extends LitElement {
  // Declare the properties
  @property({ type: String }) text = "";
  @property({ type: Boolean, reflect: true }) visible = false;

  render() {
    return html`
      <style>
        .tooltip {
          position: relative;
          display: inline-block;
        }
        .tooltip .tooltiptext {
          visibility: hidden;
          width: 250px;
          background-color: black;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px 0;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          margin-left: -60px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .tooltip:hover .tooltiptext {
          visibility: visible;
          opacity: 1;
        }
      </style>
      <div class="tooltip">
        <slot></slot>
        <span class="tooltiptext">${this.text}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-tooltip": MyTooltip;
  }
}
