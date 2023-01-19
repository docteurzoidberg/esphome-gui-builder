import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { GuiElement } from "classes/gui/GuiElement";

import "my-section";
import "setting-text";
import "setting-number";
import { FontGuiElement } from "classes/gui/FontGuiElement";

@customElement("section-elem-settings")
export class SectionElemSettings extends LitElement {
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

  renderSettings() {
    if (this.selectedElement === undefined) return nothing;

    return html`
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
    `;
  }

  render() {
    return html`
      <my-section
        title="Elem Settings"
        closable
        .expand="${this.selectedElement instanceof GuiElement}"
      >
        <span slot="title">Element settings</span>
        ${this.renderSettings()}
      </my-section>
    `;
  }
  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "section-elem-settings": SectionElemSettings;
  }
}