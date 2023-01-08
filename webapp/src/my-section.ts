import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-section")
export class MySection extends LitElement {
  @property()
  open: boolean = true;

  headerClick() {
    this.open = !this.open;
    this.requestUpdate();
  }

  renderExpandCollapse() {
    if (this.open) return html`<span @click="${this.headerClick}">-</span>`;
    else return html`<span @click="${this.headerClick}">+</span>`;
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.updated(_changedProperties);
    if (_changedProperties.has("open")) {
      this.requestUpdate();
    }
  }

  render() {
    return html`
      <h3>
        <slot name="title" @click="${this.headerClick}"></slot>
        ${this.renderExpandCollapse()}
      </h3>
      <section id="container" is-visible="${this.open}">
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
      cursor: pointer;
      font-family: "Wendy";
      margin-top: 5px;
      margin-bottom: 5px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-section": MySection;
  }
}
