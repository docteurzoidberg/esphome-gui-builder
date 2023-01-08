import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { GuiElement } from "classes/gui/GuiElement";

import "my-section";
import "my-text-setting";
import "my-number-setting";

import { FontGuiElement } from "classes/gui/FontGuiElement";

@customElement("my-element-settings")
export class MyElementSettings extends LitElement {
  @property({ type: Object })
  selectedElement?: GuiElement;

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("element-moved", (_event) => {
      //  this.selectedElement = (e as CustomEvent).detail;
      //console.log("element-moved from settings", this.selectedElement);
      this.requestUpdate();
    });
    window.addEventListener("element-moving", (_event) => {
      //  this.selectedElement = (e as CustomEvent).detail;
      //console.log("element-moving", this.selectedElement);
      this.requestUpdate();
    });
  }

  updateElementX(e: Event) {
    if (!this.selectedElement) return;
    const elementInput = e.target as HTMLInputElement;
    this.selectedElement.x = parseInt(elementInput.value, 10);
    this.requestUpdate();
  }

  updateElementY(e: Event) {
    if (!this.selectedElement) return;
    const elementInput = e.target as HTMLInputElement;
    this.selectedElement.y = parseInt(elementInput.value, 10);
    this.requestUpdate();
  }

  updateElementZ(e: Event) {
    if (!this.selectedElement) return;
    const elementInput = e.target as HTMLInputElement;
    this.selectedElement.zorder = parseInt(elementInput.value, 10);
    this.requestUpdate();
  }

  render() {
    if (!this.selectedElement) return html``;
    return html`
      <my-section>
        <span slot="title">Element settings</span>
        <div class="elem-settings">
          <!-- ELEMENT TYPE -->
          <my-text-setting
            label="type"
            value="${this.selectedElement.type}"
          ></my-text-setting>
          <!-- ELEMENT NAME -->
          <my-text-setting
            label="name"
            value="${this.selectedElement.name}"
          ></my-text-setting>
          <!-- ELEMENT ESPHOMEID -->
          <my-text-setting
            label="id"
            value="${this.selectedElement.esphomeId}"
          ></my-text-setting>
          <!-- ELEMENT X -->
          <my-number-setting
            label="X"
            value="${this.selectedElement.x}"
            editable
            @change="${this.updateElementX}"
          ></my-number-setting>
          <!-- ELEMENT Y -->
          <my-number-setting
            label="Y"
            value="${this.selectedElement.y}"
            editable
            @change="${this.updateElementY}"
          ></my-number-setting>
          <!-- ELEMENT Z -->
          <my-number-setting
            label="zorder"
            value="${this.selectedElement.zorder}"
            editable
            min="0"
            @change="${this.updateElementZ}"
          ></my-number-setting>
          ${this.selectedElement instanceof FontGuiElement
            ? html`
                <!-- FONTGUIELEMENT TEXT -->
                <my-text-setting
                  label="text"
                  value="${(this.selectedElement as FontGuiElement).text}"
                  editable
                ></my-text-setting>
                <!-- FONTGUIELEMENT COLOR -->
                <div>
                  <label>color:</label>
                  <sl-color-picker size="small"></sl-color-picker>
                </div>
              `
            : nothing}
        </div>
      </my-section>
    `;
  }

  static styles = css`
    :host {
      background-color: yellow;
    }
    h2 {
      text-decoration: underline;
    }
    label {
      width: 75px;
      display: inline-block;
    }
    .textspan {
      display: inline-block;
      width: 135px;
      color: lightgray;
      font-family: Wendy;
    }
    .numberspan {
      display: inline-block;
      width: 75px;
    }
    input[type="number"] {
      width: 60px;
      display: inline-block;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element-settings": MyElementSettings;
  }
}
