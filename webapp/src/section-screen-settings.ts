import { DialogLoadPreset } from "dialog-load-preset";
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import "my-section";
import { ScreenPreset } from "types/ScreenPreset";
import { ScreenSettings } from "types/ScreenSettings";

@customElement("section-screen-settings")
export class SectionScreenSettings extends LitElement {
  @property({ type: Object })
  dialogLoadPreset?: DialogLoadPreset;
  @property({ type: Object })
  currentScreenPreset?: ScreenPreset;
  @property({ type: Number })
  screenWidth = 0;
  @property({ type: Number })
  screenHeight = 0;
  @property({ type: Boolean })
  showGrid = false;
  @property({ type: Number })
  canvasGridWidth = 0;
  @property({ type: Number })
  canvasScale = 0;

  @property({ type: Number })
  guiScale = 90;

  raiseSettingChangedEvent() {
    const event = new CustomEvent("screen-settings-changed", {
      detail: {
        currentPresetIndex: -1,
        screenWidth: this.screenWidth,
        screenHeight: this.screenHeight,
        showGrid: this.showGrid,
        gridSize: this.canvasGridWidth,
        screenScale: this.canvasScale,
        guiScale: this.guiScale,
      } as ScreenSettings,
    });
    this.dispatchEvent(event);
  }

  handleScreenWidthChanged(e: Event) {
    this.screenWidth = parseInt((e.target as HTMLInputElement).value, 10);
    this.raiseSettingChangedEvent();
  }

  handleScreenHeightChanged(e: Event) {
    this.screenHeight = parseInt((e.target as HTMLInputElement).value, 10);
    this.raiseSettingChangedEvent();
  }

  handleShowGridChanged(e: CustomEvent) {
    this.showGrid = e.detail;
    this.raiseSettingChangedEvent();
  }

  handleCanvasGridWidthChanged(e: Event) {
    this.canvasGridWidth = parseInt((e.target as HTMLInputElement).value, 10);
    this.raiseSettingChangedEvent();
  }

  handleCanvasScaleChanged(e: Event) {
    this.canvasScale = parseInt((e.target as HTMLInputElement).value, 10);
    this.raiseSettingChangedEvent();
  }

  handleGuiScaleChanged(e: Event) {
    this.guiScale = parseInt((e.target as HTMLInputElement).value, 10);
    this.raiseSettingChangedEvent();
  }

  firstUpdated() {
    this.dialogLoadPreset = document.querySelector(
      "dialog-load-preset"
    ) as DialogLoadPreset;
  }

  render() {
    return html`
      <my-section title="Screen settings" show closable expand>
        <span slot="title">Screen settings</span>
        <div class="sl-theme-dark">
          <sl-button
            class="action"
            size="small"
            variant="primary"
            outline
            @click="${() => {
              console.log(this.dialogLoadPreset);
              this.dialogLoadPreset?.open();
            }}"
          >
            <sl-icon
              library="boxicons"
              slot="prefix"
              name="bx-folder-open"
            ></sl-icon>
            LOAD PRESET
          </sl-button>
          <sl-button
            class="action"
            size="small"
            variant="default"
            outline
            disabled
            @sl-click="${() => {
              console.log(this.dialogLoadPreset);
              this.dialogLoadPreset?.open();
            }}"
          >
            <sl-icon library="boxicons" slot="prefix" name="bx-save"></sl-icon>
            SAVE PRESET
          </sl-button>
        </div>
        <my-text-setting
          label="preset"
          value="currentPresetName"
        ></my-text-setting>
        <my-number-setting
          label="width"
          value="${this.screenWidth}"
          editable
          min="1"
          @change="${this.handleScreenWidthChanged}"
        ></my-number-setting>
        <my-number-setting
          label="height"
          value="${this.screenHeight}"
          editable
          min="1"
          @change="${this.handleScreenHeightChanged}"
        ></my-number-setting>
        <my-boolean-setting
          label="show grid"
          .value="${this.showGrid}"
          editable
          @change="${this.handleShowGridChanged}"
        ></my-boolean-setting>
        <my-number-setting
          label="grid size"
          value="${this.canvasGridWidth}"
          editable
          min="1"
          @change="${this.handleCanvasGridWidthChanged}"
        ></my-number-setting>
        <my-number-setting
          label="scale"
          value="${this.canvasScale}"
          min="1"
          editable
          @change="${this.handleCanvasScaleChanged}"
        ></my-number-setting>
        <my-number-setting
          label="gui scale"
          value="${this.guiScale}"
          min="1"
          max="5"
          editable
          @change="${this.handleGuiScaleChanged}"
        ></my-number-setting>
      </my-section>
    `;
  }
  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "section-screen-settings": SectionScreenSettings;
  }
}
