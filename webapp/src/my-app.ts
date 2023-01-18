import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement, property, query } from "lit/decorators.js";

//import { COMMIT_ID, BRANCH } from "vite:my-plugin";

//Shoelace
import "@shoelace-style/shoelace/dist/components/button/button";
import "@shoelace-style/shoelace/dist/components/checkbox/checkbox";
import "@shoelace-style/shoelace/dist/components/color-picker/color-picker";
import "@shoelace-style/shoelace/dist/components/divider/divider";
import "@shoelace-style/shoelace/dist/components/drawer/drawer";
import "@shoelace-style/shoelace/dist/components/icon/icon";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button";
import "@shoelace-style/shoelace/dist/components/input/input";
import "@shoelace-style/shoelace/dist/components/split-panel/split-panel";
import "@shoelace-style/shoelace/dist/components/tab/tab";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { registerIconLibrary } from "@shoelace-style/shoelace/dist/utilities/icon-library.js";
import "@shoelace-style/shoelace/dist/themes/dark.css"; //shoelace css
import "styles/my-theme.css"; //shoelace variables overides?

registerIconLibrary("boxicons", {
  resolver: (name) => {
    let folder = "regular";
    if (name.substring(0, 4) === "bxs-") folder = "solid";
    if (name.substring(0, 4) === "bxl-") folder = "logos";
    return `https://cdn.jsdelivr.net/npm/boxicons@2.1.4/svg/${folder}/${name}.svg`;
  },
  mutator: (svg) => svg.setAttribute("fill", "currentColor"),
});
setBasePath("/shoelace"); // Set the base path for Shoelace's assets (icons)
//-

import "my-loading-screen";
import "my-element-list";
import "my-element-settings";
import "my-canvas-display";
import "my-toolbox";
import "my-toolbox-tree";
import "my-section";
import "my-prism-code";
import "my-navbar";
import "drawer-settings";
import "drawer-infos";
import "drawer-presets";
import "drawer-libraries";
import "setting-text";
import "setting-number";
import "setting-boolean";
import "dialog-load-preset";
import "dialog-add-text";

import { DialogLoadPreset } from "./dialog-load-preset";
import { DialogAddText } from "dialog-add-text";

import { ScreenPreset } from "types/ScreenPreset";
import { ElementRemovedEvent, ElementSelectedEvent } from "types/Events";

import { StorageManager } from "classes/StorageManager";
import { YAMLGenerator } from "classes/YAMLGenerator";
import { CPPLGenerator } from "classes/CPPGenerator";

import { EspHomeFont } from "classes/esphome/EspHomeFont";

import { GuiElement } from "classes/gui/GuiElement";
import { ImageGuiElement } from "classes/gui/ImageGuiElement";
import { AnimationGuiElement } from "classes/gui/AnimationGuiElement";
import { FontGuiElement } from "classes/gui/FontGuiElement";

import { GuiElementJSON } from "interfaces/gui/GuiElementJSON";
import { DropElementJSON } from "interfaces/gui/DropElementJSON";
import { FontGuiElementJSON } from "interfaces/gui/FontGuiElementJSON";
import { MyNavbar } from "my-navbar";
import { MyFullScreenDrawer } from "my-fullscreen-drawer";

@customElement("my-app")
export class MyApp extends LitElement {
  //app title
  title = "GUI Helper for ESPHome";

  @property()
  showLoadingScreen: boolean = true;

  @query("#screenpreset")
  selectScreenPreset?: HTMLSelectElement;

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

  @query("#my-navbar")
  navBar?: MyNavbar;

  @query("drawer-presets")
  drawerPresets?: MyFullScreenDrawer;

  @query("drawer-libraries")
  drawerLibraries?: MyFullScreenDrawer;

  @query("drawer-infos")
  drawerInfos?: MyFullScreenDrawer;

  @query("drawer-settings")
  drawerSettings?: MyFullScreenDrawer;

  openDrawer: string = "";

  async _loadScreenPresets() {
    //console.log("load screen presets");
    return StorageManager.loadScreenPresets()
      .then((presets) => {
        this.screenPresets = presets;
      })
      .catch((err) => {
        //fallbck if json not ok
        console.error(err);
        this.screenPresets = [{ ...StorageManager.getDefaultScreenPreset() }];
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
    StorageManager.loadScene()
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
    const settings = StorageManager.loadSettings();
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
    };
    StorageManager.saveSettings(settings);
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
    StorageManager.saveScene(this.guiElements);
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
    StorageManager.saveScene(this.guiElements);
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
    StorageManager.saveScene(this.guiElements);
  }

  handleToolboxLoaded(e: CustomEvent) {
    console.log("toolbox-loaded", e.detail);
    this._loadScene();
  }

  handleScreenWidthChanged(e: Event) {
    console.log("screen-width-changed", e.target);
    this.screenWidth = parseInt((e.target as HTMLInputElement).value, 10);
    if (this.currentScreenPresetIndex !== -1) {
      this.currentScreenPresetIndex = -1;
      this.currentScreenPreset = undefined;
      //if (this.selectScreenPreset) this.selectScreenPreset.value = "-1";
      this.requestUpdate();
    }
    this._saveSettings();
  }

  handleScreenHeightChanged(e: Event) {
    console.log("screen-height-changed", e.target);
    this.screenHeight = parseInt((e.target as HTMLInputElement).value, 10);
    if (this.currentScreenPresetIndex !== -1) {
      this.currentScreenPresetIndex = -1;
      this.currentScreenPreset = undefined;
      //if (this.selectScreenPreset) this.selectScreenPreset.value = "-1";
      this.requestUpdate();
    }
    this._saveSettings();
  }

  handleDrawerRequestClose(ev: CustomEvent) {
    const drawer = ev.target as MyFullScreenDrawer;
    console.log("drawer requested close", drawer);
    if (ev.detail.source) {
    }
    this.navBar?.select("editor");
  }

  handleNav(ev: CustomEvent) {
    console.log("selected", ev.detail);
    if (ev.detail.name == "settings") {
      this.drawerSettings?.show();
    } else if (ev.detail.name == "infos") {
      this.drawerInfos?.show();
    } else if (ev.detail.name == "presets") {
      this.drawerPresets?.show();
    } else if (ev.detail.name == "libraries") {
      this.drawerLibraries?.show();
    }
    this.openDrawer = ev.detail.name;
  }
  handleHide(ev: CustomEvent) {
    console.log("hided", ev.detail);
    if (ev.detail.name == "settings") {
      this.drawerSettings?.hide();
    } else if (ev.detail.name == "infos") {
      this.drawerInfos?.hide();
    } else if (ev.detail.name == "presets") {
      this.drawerPresets?.hide();
    } else if (ev.detail.name == "libraries") {
      this.drawerLibraries?.hide();
    }
  }

  onKonamiCode(cb: Function) {
    var input = "";
    var key = "38384040373937396665";
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      input += "" + e.keyCode;
      if (input === key) {
        return cb();
      }
      if (!key.indexOf(input)) return;
      input = "" + e.keyCode;
    });
  }

  consoleImage(url: string, scale: number) {
    scale = scale || 1;
    const img = new Image();

    const getBox = (width: number, height: number) => {
      return {
        string: "+",
        style:
          "font-size: 10px; padding: " +
          Math.floor(height / 2) +
          "px " +
          Math.floor(width / 2) +
          "px; line-height: " +
          height +
          "px;",
      };
    };

    img.onload = () => {
      const dim = getBox(img.width * scale, img.height * scale);
      console.log(
        "%c" + dim.string,
        dim.style +
          "background: url(" +
          url +
          "); color: transparent; image-rendering: pixelated; background-size: cover; background-position:50% 50%;"
      );
    };
    img.src = url;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._loadScreenPresets().then(() => {
      this._loadSettings();
    });
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    document.documentElement.style.setProperty("color-scheme", "dark");
    this.onKonamiCode(() => {
      this.consoleImage(
        "data:image/gif;base64,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",
        1
      );
      alert("Cheatcodes activated");
    });
    setTimeout(() => {
      this.showLoadingScreen = false;
    }, 9000);
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.updated(_changedProperties);
  }

  render() {
    return html`
      <my-loading-screen
        id="loadingScreen"
        .open=${this.showLoadingScreen}
      ></my-loading-screen>

      <dialog-add-text
        id="addTextDialog"
        @close="${this.handleAddTextDialogClosed}"
      ></dialog-add-text>

      <dialog-load-preset
        @close="${this.handleLoadPresetDialogClosed}"
        id="loadPresetDialog"
      ></dialog-load-preset>

      <div class="main-container">
        <!-- left column  -->
        <div class="first-col">
          <my-navbar
            id="my-navbar"
            @select="${this.handleNav}"
            @hide="${this.handleHide}"
          >
          </my-navbar>
        </div>

        <!-- second column take the rest -->
        <div class="second-col" style="position: relative;">
          <drawer-presets
            @request-close="${this.handleDrawerRequestClose}"
          ></drawer-presets>
          <drawer-libraries
            @request-close="${this.handleDrawerRequestClose}"
          ></drawer-libraries>
          <drawer-infos
            @request-close="${this.handleDrawerRequestClose}"
          ></drawer-infos>
          <drawer-settings
            @request-close="${this.handleDrawerRequestClose}"
          ></drawer-settings>

          <!-- CANVAS -->

          <div class="gui-editor-container">
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
        </div>

        <!-- third column -->
        <div class="third-col">
          <div class="screen-settings-container">
            <!-- SCREEN SETTINGS -->
            <my-section class="settings">
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
                  <sl-icon
                    library="boxicons"
                    slot="prefix"
                    name="bx-save"
                  ></sl-icon>
                  SAVE PRESET
                </sl-button>
              </div>
              <my-text-setting
                label="preset"
                value="${this.currentScreenPresetIndex! >= 0
                  ? this.screenPresets[this.currentScreenPresetIndex!].name
                  : "Custom"}"
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
                @change="${(e: CustomEvent) =>
                  (this.showGrid = e.detail as boolean)}"
              ></my-boolean-setting>
              <my-number-setting
                label="grid size"
                value="${this.canvasGridWidth}"
                editable
                min="1"
                @change="${(e: Event) => {
                  this.canvasGridWidth = parseInt(
                    (e.target as HTMLInputElement).value,
                    10
                  );
                }}"
              ></my-number-setting>
              <my-number-setting
                label="scale"
                value="${this.canvasScale}"
                min="1"
                editable
                @change="${(e: Event) => {
                  this.canvasScale = parseInt(
                    (e.target as HTMLInputElement).value,
                    10
                  );
                }}"
              ></my-number-setting>
              <my-number-setting
                label="gui scale"
                value="${this.toolboxScale}"
                min="1"
                min="5"
                editable
                @change="${(e: Event) => {
                  this.toolboxScale = parseInt(
                    (e.target as HTMLInputElement).value,
                    10
                  );
                }}"
              ></my-number-setting>
            </my-section>
          </div>
          <!-- ELEMENT SETTINGS -->
          <div class="element-settings-container">
            <my-element-settings
              .selectedElement="${this.selectedElement}"
            ></my-element-settings>
          </div>
          <!-- ELEMENT LIST -->
          <div class="element-list-container">
            <my-element-list
              .guiElements="${this.guiElements}"
              .selectedElement="${this.selectedElement}"
              @element-selected="${this.handleElementSelected}"
              @element-removed="${this.handleElementRemoved}"
            ></my-element-list>
          </div>
        </div>
      </div>
    `;
  }
  static styles = [
    css`
      :host {
        display: block;
        //height: 100vh;
        margin: 0;
        padding: 0;
        font-family: "Teko";
        font-size: 1.5em;
      }
      .main-container {
        display: flex;
      }
      .second-col {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .first-row {
        flex: 1;
      }
      .second-row {
        flex: 0;
        min-height: 300px;
        max-height: 400px;
      }
      .screen-container {
        overflow: auto;
      }
      .toolbox-container {
        //overflow: auto;
        height: 100%;
      }
      .screen-settings-container label {
        width: 150px;
        display: inline-block;
      }
      .screen-settings-container input[type="number"] {
        width: 60px;
        display: inline-block;
      }
      @media (prefers-color-scheme: dark) {
        .header {
          background-color: #555555;
        }
      }
      #screenpreset {
        display: none;
      }
      .presetname {
        color: lightgray;
        font-size: 0.8em;
      }
      #screenwidth,
      #screenheight,
      #gridwidth,
      #guiscale,
      #displayscale {
        width: 60px;
        display: inline-block;
        color: lightgray;
      }
      sl-button.action::part(base) {
        font-family: "Teko";
        font-size: 0.8em;
        font-weight: normal;
      }
      sl-tab::part(base) {
        font-size: 22px;
        font-family: "Teko";
      }
      sl-tab-group {
        flex: 1;
        width: 100%;
      }
      sl-tab-panel {
        flex: 1;
      }

      .gui-editor-container sl-split-panel::part(divider) {
        background-color: var(--sl-color-yellow-600);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "my-app": MyApp;
  }
}
