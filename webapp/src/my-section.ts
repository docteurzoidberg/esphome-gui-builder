import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-section")
export class MySection extends LitElement {
  @property({ type: String })
  title: string = "My section";

  @property({ type: Boolean })
  flex: boolean = false;

  @property({ type: Boolean })
  expand: boolean = false;

  @property({ type: Boolean })
  closable: boolean = false;

  @property({ type: Boolean })
  show: boolean = true;

  toggleExpand() {
    this.expand = !this.expand;
  }

  close(ev: Event) {
    ev.stopPropagation();
    this.show = false;
  }

  renderCloseButton() {
    if (this.closable) {
      return html`
        <sl-icon-button
          style="color: lightgray;"
          library="boxicons"
          name="bx-x"
          @click="${(ev: Event) => this.close(ev)}"
        ></sl-icon-button>
      `;
    }
    return nothing;
  }

  renderExpandButton() {
    if (this.expand) {
      return html`<sl-icon-button
        style="color: lightgray;"
        library="boxicons"
        name="bxs-chevron-down"
      ></sl-icon-button>`;
    }
    return html`<sl-icon-button
      style="color: lightgray;"
      library="boxicons"
      name="bxs-chevron-up"
    ></sl-icon-button>`;
  }

  renderContent() {
    if (!this.expand) return nothing;
    return html` <slot></slot> `;
  }

  renderTitle() {
    return html`<div class="title">${this.title}</div>`;
  }

  render() {
    if (!this.show) return nothing;
    return html`
      <div class="section-container" flex="${this.flex}">
        <div class="header" @click="${this.toggleExpand}">
          ${this.renderExpandButton()} ${this.renderTitle()}
          ${this.renderCloseButton()}
        </div>
        <div class="content" flex="${this.flex}">${this.renderContent()}</div>
      </div>
    `;
  }
  static styles = css`
    :host {
      background-color: #333;
    }

    .section-container {
      display: flex;
      flex-direction: column;
    }
    .header {
      flex: 0;
      background-color: var(--dracula-color-background-950);
      color: var(--dracula-color-foreground-50);
      font-family: "Teko";
      //padding: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .content {
      background-color: var(--dracula-color-background-900);
      //color: black;
    }
    .title {
      font-size: 1rem;
      flex: 1;
    }
    .content[flex="false"] {
      flex: 0;
    }
    .content[flex="true"] {
      //background-color: orange;
      color: black;
      flex: 1;
      height: 100%;
      overflow-y: scroll;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-section": MySection;
  }
}
