import { LitElement, css, html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/components/divider/divider";
import "@shoelace-style/shoelace/dist/components/tab/tab";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group";
import "@shoelace-style/shoelace/dist/components/icon/icon";
import "@shoelace-style/shoelace/dist/themes/dark.css";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import SlTabGroup from "@shoelace-style/shoelace/dist/components/tab-group/tab-group";
setBasePath("/assets/shoelace"); // Set the base path to the folder you copied Shoelace's assets to

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
    return html`<span class="title">
      <sl-icon
        src="svg/esphome.svg"
        style="font-size: 3rem; margin-top: 5px;"
      ></sl-icon>
      <div
        style="margin-left: 10px; padding-top: 12px; font-family: Teko; font-size: 2rem;"
      >
        ${text}
      </div>
    </span>`;
  }
  render() {
    return html`
      <div class="navbar">
        <div class="nav-header">
          <slot name="top"></slot>
          <sl-tab>
            <sl-icon name="list" @click="${this.handleClick}"></sl-icon>
            ${this.expand ? this.renderTitle("GUI Helper") : nothing}
          </sl-tab>
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
    .nav-footer {
      flex: 0;
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
      font-size: 1.2rem;
      display: flex;
    }
    #nav-tab-group {
      display: flex;
    }
    sl-tab::part(base) {
      flex: 1;
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
