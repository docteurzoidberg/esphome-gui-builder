import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-section-panel")
export class MySectionPanel extends LitElement {
  render() {
    return html`
      <div class="section-panel-container">
        <div class="border">
          <div class="header">My sections panel</div>
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
  static styles = css`
    :host {
      display: flex;
      height: 100%;
      width: 100%;
    }
    .section-panel-container {
      display: flex;
      flex: 1;
      background-color: var(--sl-color-neutral-50);
      flex-direction: column;
      min-width: 300px;
      overflow-y: scroll;
    }

    /*test*/
    .border {
      border-left: 4px solid var(--sl-color-neutral-200);
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .header {
      flex: 0;
      background-color: var(--dracula-color-green-400);
      text-transform: uppercase;
      font-family: Teko;
      font-weight: bold;
      font-size: 26px;
      text-align: left;
      padding: 15px;
      padding-bottom: 12px;
      text-decoration: underline;
    }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-section-panel": MySectionPanel;
  }
}
