import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-tabs")
class MyTabs extends LitElement {
  @property()
  _tabs: Array<Element> = [];

  @property()
  _panels: Array<Element> = [];

  static styles = css`
    nav {
      display: flex;
    }
    nav > ::slotted([slot="tab"]) {
      padding: 1rem 2rem;
      margin-bottom: 0px;
      flex: 1 1 auto;
      color: lightgrey;
      border-bottom: 2px solid lightgrey;
      text-align: center;
    }
    nav > ::slotted([slot="tab"][selected]) {
      border-color: black;
    }
    ::slotted([slot="panel"]) {
      display: none;
    }
    ::slotted([slot="panel"][selected]) {
      display: block;
    }
  `;
  selectTab(tabIndex: number) {
    this._tabs.forEach((tab) => tab.removeAttribute("selected"));
    this._tabs[tabIndex].setAttribute("selected", "");
    this._panels.forEach((panel) => panel.removeAttribute("selected"));
    this._panels[tabIndex].setAttribute("selected", "");
  }

  handleSelect(e: Event) {
    const index = this._tabs.indexOf(e.target as Element);
    this.selectTab(index);
  }

  constructor() {
    super();
    this._tabs = Array.from(this.querySelectorAll("[slot=tab]"));
    this._panels = Array.from(this.querySelectorAll("[slot=panel]"));
    this.selectTab(0);
  }

  render() {
    return html`
      <nav>
        <slot name="tab" @click=${(e: Event) => this.handleSelect(e)}></slot>
      </nav>
      <slot name="panel"></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-tabs": MyTabs;
  }
}
