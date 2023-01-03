import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./my-element-list";
import "./my-element-settings";
import "./my-canvas-display";
import "./my-toolbox";
import "./my-section";
import "./my-tabs";

import { AssetManager } from "classes/gui/AssetManager";
import { GuiElement } from "classes/gui/GuiElement";
import { ElementRemovedEvent, ElementSelectedEvent } from "types/Events";

@customElement("my-app")
export class MyApp extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        height: 100vh;
        margin: 0;
        padding: 0;
        font-family: "Wendy";
        font-size: 1.5em;
      }

      .screen-container {
        margin: 20px;
        text-align: center;
      }

      .container {
        display: flex;
        /* flex-flow: column; */
        flex-direction: column;
        height: 100%;
      }

      .second-row {
        /* flex:1 1 auto; */
        flex-grow: 1;
      }

      .second-row-container {
        display: flex;
        height: 100%;
      }
      .col1 {
        /* flex:0 1 auto; */
        flex-grow: 0;
        align-self: auto;
        min-width: 250px;
      }

      .col2 {
        /* flex:1 1 auto; */
        flex-grow: 1;
        align-self: auto;
      }

      .second-col-container {
        display: flex;

        /* flex-flow: column; */
        flex-direction: column;
        height: 100%;
      }

      .second-col-container .row1 {
        /* flex:1 1 auto; */
        flex-grow: auto;
        align-self: auto;
      }

      .second-col-container .row2 {
        /* flex:0 1 auto; */
        flex-grow: 0;
        align-self: stretch;
        height: 30vh;
      }
      .header {
        text-align: left;
        font-size: 2em;
        margin: 0;
        padding: 0px;
        line-height: 80px;
        vertical-align: middle;
      }
      .github {
        float: right;
        margin-right: 15px;
      }
      .githublogo {
        vertical-align: middle;
        image-rendering: pixelated;
      }
      .github,
      .logo,
      .title {
        display: inline-block;
      }
      .logo {
        margin-top: auto;
        align-items: center;
        float: right;
      }
      .logo img {
        vertical-align: middle;
        margin-right: 16px;
        image-rendering: pixelated;
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
          /* dark mode variables go here */
          background-color: #555555;
        }
        .col1,
        .col3 {
          background-color: #222222;
        }
      }
      //h2 {
      //  text-decoration: underline;
      //}
    `,
  ];

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

  @property()
  guiElements: GuiElement[] = [];

  @property()
  selectedElement?: GuiElement;

  connectedCallback(): void {
    super.connectedCallback();
  }

  handleInitCanvas() {
    console.log("init-canvas");
  }

  handleDrawingUpdate() {
    console.log("drawing-update");
  }

  handleElementSelected(e: CustomEvent) {
    console.log("element-selected", e.detail);
    const selectedEvent = e.detail as ElementSelectedEvent;
    this.selectedElement = selectedEvent.element;
  }

  handleElementMoved(e: CustomEvent) {
    console.log("element moved");
    const element = e.detail;
    this.selectedElement = element;
  }

  handleElementRemoved(e: CustomEvent) {
    console.log("element-removed", e.detail);
    const details = e.detail as ElementRemovedEvent;
    this.guiElements = [
      ...this.guiElements.slice(0, details.index),
      ...this.guiElements.slice(details.index + 1),
    ];
  }

  handleElementDropped(e: CustomEvent) {
    console.log("element-dropped", e.detail);
    const elementToAdd = e.detail as GuiElement;
    this.guiElements = [...this.guiElements, elementToAdd];
  }

  handleToolboxLoaded(e: CustomEvent) {
    console.log("toolbox-loaded", e.detail);
    //TODO! load scene from storage if any
    this.guiElements = AssetManager.loadHardcodedScene();
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

  getBox(width: number, height: number) {
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
  }

  consoleImage(url: string, scale: number) {
    scale = scale || 1;
    const img = new Image();
    const self = this;
    img.onload = () => {
      const dim = self.getBox(img.width * scale, img.height * scale);
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
  }

  render() {
    return html`
      <div class="container two-rows-row">
        <div class="first-row header">
          <div class="title">GUI Helper for ESPHome</div>

          <div class="github">
            <a
              target="new"
              title="Goto github's repo"
              href="https://github.com/docteurzoidberg/esphome-gui-builder"
              ><img
                class="githublogo"
                src="githubw.png"
                alt="github"
                height="48"
            /></a>
          </div>
          <div class="logo">
            <img src="work-in-progress.png" height="48" />
          </div>
        </div>
        <div class="second-row">
          <div class="second-row-container three-cols-row">
            <div class="col1">
              <div class="screen-settings-container">
                <my-section class="settings">
                  <span slot="title">Screen settings</span>
                  <div>
                    <label for="screenwidth">Display Width</label>
                    <input
                      id="screenwidth"
                      type="number"
                      min="1"
                      value="${this.screenWidth}"
                      @change="${(e: Event) => {
                        this.screenWidth = parseInt(
                          (e.target as HTMLInputElement).value,
                          10
                        );
                      }}"
                    />
                  </div>
                  <div>
                    <label for="screenwidth">Display Height</label>
                    <input
                      id="screenheight"
                      type="number"
                      min="1"
                      value="${this.screenHeight}"
                      @change="${(e: Event) => {
                        this.screenHeight = parseInt(
                          (e.target as HTMLInputElement).value,
                          10
                        );
                      }}"
                    />
                  </div>
                  <div>
                    <label for="showgrid">Show grid</label>
                    <input
                      id="showgrid"
                      type="checkbox"
                      .checked="${this.showGrid}"
                      @change="${(e: Event) =>
                        (this.showGrid = (
                          e.target as HTMLInputElement
                        ).checked)}"
                    />
                  </div>
                  <div>
                    <label for="gridwidth">Grid Width</label>
                    <input
                      id="gridwidth"
                      type="number"
                      min="1"
                      value="${this.canvasGridWidth}"
                      @change="${(e: Event) => {
                        this.canvasGridWidth = parseInt(
                          (e.target as HTMLInputElement).value,
                          10
                        );
                      }}"
                    />
                  </div>
                  <div>
                    <label for="displayscale">Display Scale</label>
                    <input
                      id="displayscale"
                      type="number"
                      min="1"
                      value="${this.canvasScale}"
                      @change="${(e: Event) => {
                        this.canvasScale = parseInt(
                          (e.target as HTMLInputElement).value,
                          10
                        );
                      }}"
                    />
                  </div>
                  <div>
                    <label for="guiscale">GUI Scale</label>
                    <input
                      id="guiscale"
                      type="number"
                      min="1"
                      min="5"
                      value="${this.toolboxScale}"
                      @change="${(e: Event) => {
                        this.toolboxScale = parseInt(
                          (e.target as HTMLInputElement).value,
                          10
                        );
                      }}"
                    />
                  </div>
                </my-section>
              </div>
              <div class="element-settings-container">
                <my-element-settings
                  .selectedElement="${this.selectedElement}"
                ></my-element-settings>
              </div>
            </div>
            <div class="col2 second-col-container two-rows-col">
              <div class="row1 screen-container">
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
              <div class="row2 toolbox-container">
                <my-tabs>
                  <h2 slot="tab">TOOLBOX</h2>
                  <section slot="panel">
                    <my-toolbox
                      .displayScale="${this.toolboxScale}"
                      @toolbox-loaded="${this.handleToolboxLoaded}"
                    ></my-toolbox>
                  </section>
                  <h2 slot="tab">YAML</h2>
                  <section slot="panel">//TODO: yaml content</section>
                  <h2 slot="tab">CODE</h2>
                  <section slot="panel">//TODO: code exemple</section>
                </my-tabs>
              </div>
            </div>
            <div class="col3">
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
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-app": MyApp;
  }
}
