import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-section")
export class MySection extends LitElement {
  @property({ type: String })
  title: string = "My section";

  @property({ type: Boolean })
  flex: boolean = false;

  @property({ type: Boolean })
  expand: boolean = true;

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
    return html`<div class="title">
      <div class="title__icon">
        <slot name="icon"></slot>
      </div>
      <div class="title__text">${this.title}</div>
    </div>`;
  }

  render() {
    if (!this.show) return nothing;
    return html`
      <div class="section-container" flex="${this.flex}">
        <div class="header" @click="${this.toggleExpand}">
          ${this.renderExpandButton()} ${this.renderTitle()}
          ${this.renderCloseButton()}
          <slot name="header"></slot>
        </div>
        <div class="content" flex="${this.flex}">${this.renderContent()}</div>
      </div>
    `;
  }
  static styles = css`
    :host {
      background-color: var(--app-color-background-150);
    }
    /*
    :host([expand]) .title__icon {
      color: var(--sl-color-primary-800);
    }
    :host([expand]) .title__text {
      color: var(--sl-color-primary-800);
    }
    */
    .section-container {
      display: flex;
      flex-direction: column;
    }
    .header {
      flex: 0;
      background-color: var(--app-color-background-50);
      //padding: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .content {
      background-color: var(--app-color-background-100);
      //color: black;
    }

    .title {
      font-size: 1rem;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .title__icon {
      flex: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .title__text {
      flex: 1;
      font-size: 1rem;
      padding: 0.5rem 4px;
      font-family: "Roboto";
    }
    .content[flex="false"] {
      flex: 0;
    }
    .content[flex="true"] {
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
