import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-section")
export class MySection extends LitElement {
  @property()
  isOpen: boolean = true;

  headerClick() {
    this.isOpen = !this.isOpen;
    this.requestUpdate();
  }

  renderExpandCollapse() {
    if (this.isOpen) return html`<span @click="${this.headerClick}">-</span>`;
    else return html`<span @click="${this.headerClick}">+</span>`;
  }

  render() {
    return html`
      <h3>
        <slot name="title" @click="${this.headerClick}"></slot>
        ${this.renderExpandCollapse()}
      </h3>
      <section id="container" is-visible="${this.isOpen}">
        <slot></slot>
      </section>
    `;
  }

  static styles = css`
    [is-visible="false"] {
      display: none;
    }
    h3 {
      text-decoration: underline;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-section": MySection;
  }
}
