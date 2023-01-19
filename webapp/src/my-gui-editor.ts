import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { EspHomeFont } from "classes/esphome/EspHomeFont";
import { AnimationGuiElement } from "classes/gui/AnimationGuiElement";
import { FontGuiElement } from "classes/gui/FontGuiElement";
import { GuiElement } from "classes/gui/GuiElement";
import { ImageGuiElement } from "classes/gui/ImageGuiElement";

import { MyStorageManager } from "classes/MyStorageManager";
import { YAMLGenerator } from "classes/YAMLGenerator";
import { CPPLGenerator } from "classes/CPPGenerator";

import { DropElementJSON } from "interfaces/gui/DropElementJSON";
import { FontGuiElementJSON } from "interfaces/gui/FontGuiElementJSON";
import { GuiElementJSON } from "interfaces/gui/GuiElementJSON";

import { ElementRemovedEvent, ElementSelectedEvent } from "types/Events";
import { ScreenPreset } from "types/ScreenPreset";
import { ScreenSettings } from "types/ScreenSettings";
import { DialogAddText } from "dialog-add-text";
import { DialogLoadPreset } from "dialog-load-preset";

import "dialog-add-text";
import "dialog-load-preset";
import "my-canvas-display";
import "my-toolbox";
import "my-toolbox-tree";
import "my-section";
import "my-section-panel";
import "my-prism-code";

import "section-elem-settings";
import "section-screen-settings";
import "section-screen-preview";
import "section-scene-elements";

import "setting-text";
import "setting-number";
import "setting-boolean";

@customElement("my-gui-editor")
export class MyGuiEditor extends LitElement {
  @query("#addTextDialog")
  dialogAddText?: DialogAddText;

  @query("#loadPresetDialog")
  dialogLoadPreset?: DialogLoadPreset;

  @property({ type: Number })
  screenWidth: number = 128;

  @property({ type: Number })
  screenHeight: number = 64;

  @property({ type: Boolean })
  showGrid: boolean = true;

  @property({ type: Number })
  canvasGridWidth: number = 2;

  @property({ type: Number })
  canvasScale: number = 5;

  @property({ type: Number })
  toolboxScale: number = 3;

  @property({ type: Object })
  currentScreenPreset?: ScreenPreset;

  @property()
  screenPresets: ScreenPreset[] = [];

  @property()
  guiElements: GuiElement[] = [];

  @property({ type: Object })
  selectedElement?: GuiElement;

  @property()
  currentScreenPresetIndex?: number;

  @property({ type: String })
  yamlContent: string = "";

  @property({ type: String })
  cppContent: string = "";

  async _loadScreenPresets() {
    //console.log("load screen presets");
    return MyStorageManager.loadScreenPresets()
      .then((presets) => {
        this.screenPresets = presets;
      })
      .catch((err) => {
        //fallbck if json not ok
        console.error(err);
        this.screenPresets = [{ ...MyStorageManager.getDefaultScreenPreset() }];
      });
  }

  _getYamlContent(): string {
    return YAMLGenerator.generateYaml(this.guiElements);
  }

  _getCppContent(): string {
    return CPPLGenerator.generateCPP(this.guiElements);
  }

  _getNewElementName(type: string) {
    const elements = this.guiElements.filter((element) => {
      return element.type === type;
    });
    return type + (elements.length + 1);
  }

  _loadScene() {
    console.log("load scene");
    MyStorageManager.loadScene()
      .then((elements: GuiElement[]) => {
        this.guiElements = elements;
        this.yamlContent = this._getYamlContent();
        this.cppContent = this._getCppContent();
      })
      .catch((err: any) => {
        //fallback if json not ok
        console.error(err);
        this.guiElements = [];
      });
  }

  _loadSettings() {
    console.log("load settings");
    const settings = MyStorageManager.loadSettings();
    this.toolboxScale = settings.guiScale;
    this.screenWidth = settings.screenWidth;
    this.screenHeight = settings.screenHeight;
    this.canvasScale = settings.screenScale;
    this.showGrid = settings.showGrid;
    this.canvasGridWidth = settings.gridSize;
    this.currentScreenPresetIndex = settings.currentPresetIndex || 0;
  }

  _saveSettings() {
    console.log("saving settings");
    const settings = {
      screenWidth: this.screenWidth,
      screenHeight: this.screenHeight,
      screenScale: this.canvasScale,
      showGrid: this.showGrid,
      gridSize: this.canvasGridWidth,
      guiScale: this.toolboxScale,
      currentPresetIndex: this.currentScreenPresetIndex,
    } as ScreenSettings;
    MyStorageManager.saveSettings(settings);
  }

  handleInitCanvas() {
    console.log("init-canvas");
  }

  handleAddTextDialogClosed(e: CustomEvent) {
    console.log("add-text-dialog-closed", e.detail);
    const json = e.detail as FontGuiElementJSON;
    if (!json) return;
    const element = new FontGuiElement(json);
    this.guiElements = [...this.guiElements, element];
  }

  handleScreenPresetsChanged(e: CustomEvent) {
    console.log("screen-preset-changed");
    const select = e.target as HTMLSelectElement;
    const index = Number(select.value);
    this.currentScreenPresetIndex = index;
    this.currentScreenPreset = this.screenPresets.find(
      (_option, _index) => index === _index
    );
    if (this.currentScreenPreset) {
      this.screenWidth = this.currentScreenPreset.width;
      this.screenHeight = this.currentScreenPreset.height;
      this.showGrid = this.currentScreenPreset.showgrid;
      this.canvasGridWidth = this.currentScreenPreset.gridsize;
      this.canvasScale = this.currentScreenPreset.scale;
    }
    this._saveSettings();
  }

  handleLoadPresetDialogClosed(e: CustomEvent) {
    console.log("load-preset-dialog-closed", e.detail);
    const preset = e.detail as ScreenPreset | undefined;
    if (preset) {
      this.currentScreenPreset = preset;
      for (let i = 0; i < this.screenPresets.length; i++) {
        if (this.screenPresets[i].name === preset.name) {
          this.currentScreenPresetIndex = i;
        }
      }
      this.screenWidth = preset.width;
      this.screenHeight = preset.height;
      this.showGrid = preset.showgrid;
      this.canvasGridWidth = preset.gridsize;
      this.canvasScale = preset.scale;
      this.requestUpdate();
      this._saveSettings();
    }
  }

  handleDrawingUpdate() {
    console.log("drawing-update");
  }

  handleElementSelected(e: CustomEvent) {
    console.log("element-selected", e.detail);
    const selectedEvent = e.detail as ElementSelectedEvent;
    //if (selectedEvent.element) {
    this.selectedElement = selectedEvent.element;
    //}
  }

  handleElementMoved(e: CustomEvent) {
    console.log("element-moved", e.detail);
    //const element = e.detail;
    //this.selectedElement = element;
    //this.requestUpdate();
    this.yamlContent = this._getYamlContent();
    this.cppContent = this._getCppContent();
    MyStorageManager.saveScene(this.guiElements);
  }

  handleElementRemoved(e: CustomEvent) {
    console.log("element-removed", e.detail);
    const details = e.detail as ElementRemovedEvent;
    this.guiElements = [
      ...this.guiElements.slice(0, details.index),
      ...this.guiElements.slice(details.index + 1),
    ];
    this.yamlContent = this._getYamlContent();
    this.cppContent = this._getCppContent();
    MyStorageManager.saveScene(this.guiElements);
  }

  handleElementDropped(e: CustomEvent) {
    console.log("element-dropped", e.detail);

    const elementToAdd = e.detail as {
      elementJson: GuiElementJSON;
      dropElementJSON: DropElementJSON;
    };
    const dropElementJSON = elementToAdd.dropElementJSON;
    const elementJson = elementToAdd.elementJson;

    let newGuiElement: GuiElement | null = null;

    //TODO: generate name elsewhere?
    const name = this._getNewElementName(dropElementJSON.type);
    elementJson.name = name;

    if (dropElementJSON.type == "image") {
      newGuiElement = new ImageGuiElement({
        ...elementJson,
        image: dropElementJSON.originalData,
      });
    } else if (dropElementJSON.type == "animation") {
      newGuiElement = new AnimationGuiElement({
        ...elementJson,
        animation: dropElementJSON.originalData,
      });
    } else if (dropElementJSON.type == "text") {
      const font = new EspHomeFont(dropElementJSON.originalData);

      /*
      this.dialogAddText?.open({
        ...elementJson,
        font: dropElementJSON.originalData,
        text: "TOTO",
        bounds: font.getBoundingBox("TOTO"),
      });*/
      //TODO: dialog or not dialog?
      newGuiElement = new FontGuiElement({
        ...elementJson,
        font: dropElementJSON.originalData,
        text: "HELLO",
        bounds: font.getBoundingBox("HELLO"),
      });
    } else {
      console.error("unknow type", dropElementJSON.type);
    }

    if (!newGuiElement) return;
    this.guiElements = [...this.guiElements, newGuiElement];
    this.yamlContent = this._getYamlContent();
    this.cppContent = this._getCppContent();
    MyStorageManager.saveScene(this.guiElements);
  }

  handleToolboxLoaded(e: CustomEvent) {
    console.log("toolbox-loaded", e.detail);
    this._loadScene();
  }

  handleScreenSettingsChanged(e: CustomEvent) {
    const screensettings = e.detail as ScreenSettings;
    console.log("screen-settings-changed", screensettings);

    this.screenWidth = screensettings.screenWidth;
    this.screenHeight = screensettings.screenHeight;
    this.showGrid = screensettings.showGrid;
    this.canvasGridWidth = screensettings.gridSize;
    this.canvasScale = screensettings.screenScale;
    this.toolboxScale = screensettings.guiScale;

    if (this.currentScreenPresetIndex !== -1) {
      this.currentScreenPresetIndex = -1;
      this.currentScreenPreset = undefined;
      //this.requestUpdate();
    }
    this._saveSettings();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._loadScreenPresets().then(() => {
      this._loadSettings();
    });
  }

  render() {
    return html`
      <dialog-add-text
        id="addTextDialog"
        @close="${this.handleAddTextDialogClosed}"
      ></dialog-add-text>
      <dialog-load-preset
        @close="${this.handleLoadPresetDialogClosed}"
        id="loadPresetDialog"
      ></dialog-load-preset>
      <div class="gui-editor-container">
        <div class="first-col">
          <sl-split-panel
            primary="start"
            vertical
            style="height: 100vh; --divider-width: 4px; --min: 350px; --max: calc(100% - 150px);"
          >
            <sl-icon
              class="divider-icon"
              slot="divider"
              name="grip-horizontal"
            ></sl-icon>
            <div
              slot="start"
              style="height: 100%; background: #555; display: flex;"
            >
              <div class="screen-container">
                <my-canvas-display
                  .displayWidth="${this.screenWidth}"
                  .displayHeight="${this.screenHeight}"
                  .canvasGridWidth="${this.canvasGridWidth}"
                  .canvasScale="${this.canvasScale}"
                  .showGrid="${this.showGrid}"
                  .elements="${this.guiElements}"
                  .selectedElement="${this.selectedElement}"
                  @init-canvas="${this.handleInitCanvas}"
                  @drawing-update="${this.handleDrawingUpdate}"
                  @element-selected="${this.handleElementSelected}"
                  @element-moved="${this.handleElementMoved}"
                  @element-dropped="${this.handleElementDropped}"
                ></my-canvas-display>
              </div>
            </div>
            <div
              slot="end"
              style="height: 100%; background: var(--sl-color-neutral-50); display: flex;"
            >
              <sl-tab-group>
                <sl-tab slot="nav" panel="toolbox" active>
                  <sl-icon name="tools"></sl-icon>
                  <span class="label">Toolbox</span>
                </sl-tab>
                <sl-tab slot="nav" panel="yaml">
                  <sl-icon name="tools"></sl-icon>
                  <span class="label">YAML</span>
                </sl-tab>

                <sl-tab slot="nav" panel="cpp">
                  <sl-icon name="tools"></sl-icon>
                  <span class="label">Code</span>
                </sl-tab>

                <sl-tab-panel name="toolbox" style="display: flex;">
                  <my-toolbox
                    .displayScale="${this.toolboxScale}"
                    @toolbox-loaded="${this.handleToolboxLoaded}"
                  ></my-toolbox>
                </sl-tab-panel>
                <!-- YAML CODE OUTPUT -->
                <sl-tab-panel name="yaml">
                  <my-prism-code
                    lang="yaml"
                    code="${this.yamlContent}"
                  ></my-prism-code>
                </sl-tab-panel>
                <!-- CPP CODE OUTPUT -->
                <sl-tab-panel name="cpp">
                  <my-prism-code
                    lang="cpp"
                    code="${this.cppContent}"
                  ></my-prism-code>
                </sl-tab-panel>
              </sl-tab-group>
            </div>
          </sl-split-panel>
        </div>
        <div class="second-col">
          <my-section-panel>
            <section-screen-preview></section-screen-preview>
            <section-screen-settings
              .screenWidth="${this.screenWidth}"
              .screenHeight="${this.screenHeight}"
              .screenPresets="${this.screenPresets}"
              .currentScreenPresetIndex="${this.currentScreenPresetIndex}"
              .currentScreenPreset="${this.currentScreenPreset}"
              .canvasGridWidth="${this.canvasGridWidth}"
              .canvasScale="${this.canvasScale}"
              .showGrid="${this.showGrid}"
              @screen-settings-changed="${this.handleScreenSettingsChanged}"
            >
            </section-screen-settings>
            <section-elem-settings
              .selectedElement="${this.selectedElement}"
            ></section-elem-settings>
            <section-scene-elements
              .guiElements="${this.guiElements}"
              .selectedElement="${this.selectedElement}"
              @element-selected="${this.handleElementSelected}"
              @element-removed="${this.handleElementRemoved}"
            ></section-scene-elements>
          </my-section-panel>
        </div>
      </div>
    `;
  }

  static styles = css`
    .gui-editor-container {
      display: flex;
      flex-direction: row;
    }
    .first-col {
      flex: 1;
    }
    .second-col {
      flex: 0;
    }
    .label {
      margin-left: 5px;
    }
    sl-tab-group {
      width: 100%;
    }
    .gui-editor-container sl-split-panel::part(divider) {
      background-color: var(--sl-color-primary-600);
    }
    .gui-editor-container sl-icon.divider-icon {
      position: absolute;
      border-radius: var(--sl-border-radius-small);
      background: var(--sl-color-primary-600);
      color: var(--sl-color-neutral-0);
      padding: 0.125rem 0.5rem;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-gui-editor": MyGuiEditor;
  }
}
