import { LitElement, css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import SlTabGroup from "@shoelace-style/shoelace/dist/components/tab-group/tab-group";

@customElement("my-navbar")
export class MyNavbar extends LitElement {
  @query("#nav-tab-group")
  navTabGroup?: SlTabGroup;

  @property()
  expand: boolean = true;

  public select(name: string) {
    this.navTabGroup?.show(name);
  }

  raiseTabSelect(ev: CustomEvent) {
    this.dispatchEvent(new CustomEvent("select", { detail: ev.detail }));
  }
  raiseTabHide(ev: CustomEvent) {
    this.dispatchEvent(new CustomEvent("hide", { detail: ev.detail }));
  }

  handleClick() {
    this.expand = !this.expand;
  }

  renderLabel(text: string) {
    return html`<span class="label">${text}</span>`;
  }
  renderTitle(text: string) {
    return html` <div class="title">
      <div class="title__apptitle">${text}</div>
      <div class="title__for">for</div>
      <div class="title__esphome">
        <sl-icon
          src="svg/esphome.svg"
          style="font-size: 6rem; padding-right: 20px;"
        ></sl-icon>
      </div>
    </div>`;
  }
  render() {
    return html`
      <div class="navbar">
        <div class="nav-header">
          <slot name="top"></slot>

          <sl-icon-button
            size="small"
            name="list"
            @click="${this.handleClick}"
          ></sl-icon-button>
          ${this.expand ? this.renderTitle("GUI Helper") : nothing}
        </div>
        <sl-divider style="--spacing: 0;"></sl-divider>
        <div class="nav-content">
          <sl-tab-group
            id="nav-tab-group"
            placement="start"
            @sl-tab-show="${(e: CustomEvent) => this.raiseTabSelect(e)}"
            @sl-tab-hide="${(e: CustomEvent) => this.raiseTabHide(e)}"
          >
            <sl-tab slot="nav" panel="editor">
              <sl-icon name="bounding-box"></sl-icon>
              ${this.expand ? this.renderLabel(`Editor`) : nothing}
            </sl-tab>
            <sl-tab slot="nav" panel="presets">
              <sl-icon name="bookmarks"></sl-icon>
              ${this.expand ? this.renderLabel(`Presets manager`) : nothing}
            </sl-tab>
            <sl-tab slot="nav" panel="libraries">
              <sl-icon name="journal-album"></sl-icon>
              ${this.expand ? this.renderLabel(`Library manager`) : nothing}
            </sl-tab>
            <sl-tab slot="nav" panel="infos">
              <sl-icon name="info-circle"></sl-icon>
              ${this.expand ? this.renderLabel(`Infos`) : nothing}
            </sl-tab>
            <sl-tab slot="nav" panel="settings">
              <sl-icon name="gear"></sl-icon>
              ${this.expand ? this.renderLabel(`Settings`) : nothing}
            </sl-tab>
          </sl-tab-group>
        </div>
        <div class="nav-footer">
          <sl-tab slot="nav" panel="settings">
            <sl-icon name="github"></sl-icon>
            ${this.expand ? this.renderLabel(`Github`) : nothing}
          </sl-tab>
          <slot name="bottom"></slot>
        </div>
      </div>
    `;
  }

  static styles = css`
    .navbar {
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .nav-header {
      flex: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 1rem 0.8rem;
    }
    .nav-content {
      flex: 1;
    }
    .nav-footer {
      flex: 0;
    }
    .label,
    .title {
      margin-left: 10px;
      padding: 0;
    }
    .label {
      font-size: 0.8rem;
      min-width: 150px;
    }
    .title {
      flex: 1;
      font-size: 1.2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .title__apptitle {
      font-weight: bold;
      color: var(--app-color-foreground-300);
      font-size: 2rem;
    }
    .title__for {
      color: var(--app-color-foreground-400);
      font-size: 0.9rem;
      line-height: 0.9rem;
    }
    .title__esphome {
      color: var(--app-color-primary-400);
    }
    #nav-tab-group {
      display: flex;
    }
    sl-tab::part(base) {
      //flex: 1;
      width: 100%;
      font-size: 1.4rem;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-navbar": MyNavbar;
  }
}
