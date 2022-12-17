import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { GuiElement } from "interfaces/GuiElement";

import "./my-element-list";
import "./my-element-settings";
import "./my-canvas-display";
import "./my-toolbox";

import { resetStyles } from "./resetCss";

@customElement("my-app")
export class MyApp extends LitElement {
  static styles = [
    resetStyles(),
    css`
      :host {
        display: block;
        height: 100vh;
      }

      .first-row-container {
        display: flex;
        height: 100%;
      }
      .col1 {
        /* flex:0 1 auto; */
        flex-grow: 0;
        align-self: auto;
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
        flex-grow: 1;
        align-self: auto;
      }

      .second-col-container .row2 {
        /* flex:0 1 auto; */
        flex-grow: 0;
        align-self: stretch;
      }
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

  @property()
  guiElements: Array<GuiElement> = [];

  @property()
  selectedElement?: GuiElement;

  connectedCallback(): void {
    super.connectedCallback();

    this.guiElements.push({
      id: "icon1",
      name: "data/images/1.PNG",
      type: "image",
      x: 0,
      y: 0,
      zorder: 9,
      data: {
        name: "data/images/1.PNG",
        width: 16,
        height: 16,
        dataurl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAALJJREFUOE+tk9ENgzAMRG2pA8B23aSMwgh0i27UBSq5uqALxhga2vqLoPjlnLvo1InJD6UAXJ8zYerbSH7/CsB2ExMVLUt8o7j2R+DAAsBPUtnkGzyQAKo9DaCiez8rrIDH8JLxdqkK4xhQ5MfZKAAAlUHYSDpgTQB/idGfjyN4R8qsqmK2OLJ7iVHuXjI2CmhjZpmH0t5DBVloIngFiCGKycsUMPr/eQttTyjfVZP4LeQNrUFugXTpubMAAAAASUVORK5CYII=",
      },
    });
    this.guiElements.push({
      id: "icon2",
      name: "data/images/2.PNG",
      type: "image",
      x: 0,
      y: 0,
      zorder: 1,
      data: {
        name: "data/images/2.PNG",
        width: 16,
        height: 16,
        dataurl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIlJREFUOE/NkzsSgCAMRE3nUT0CR/AIHpUOZ3HiLIuRgkJpgHzeZEmwI+WyTCz7B2Db11DEkfKrwCoBgFL6pzCzIfgGeCRAmshw9qG65hG9Eg9iWHQOAZ4w2jsAi36SAz/bwzngznAn1P7dIKGS2gVIwsENuusgqL8BeLADcVe4Aitg4jNeEmYAJw3Nh1EDECkvAAAAAElFTkSuQmCC",
      },
    });
    this.guiElements.sort((a, b) => a.zorder - b.zorder);
    //this.requestUpdate();
  }

  handleInitCanvas() {
    console.log("init-canvas");
  }

  handleDrawingUpdate() {
    console.log("drawing-update");
  }

  handleElementSelected(e: CustomEvent) {
    const element = e.detail;
    this.selectedElement = element;
    this.requestUpdate();
    //console.log("Element selected:");
    //console.dir(element);
  }

  render() {
    return html`
      <div class="first-row-container three-cols-row">
        <div class="col1">
          <div class="screen-settings-container">
            <div class="settings">
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
            </div>
            <div class="controls">
              <div>
                <label for="showgrid">Show grid</label>
                <input
                  id="showgrid"
                  type="checkbox"
                  .checked="${this.showGrid}"
                  @change="${(e: Event) =>
                    (this.showGrid = (e.target as HTMLInputElement).checked)}"
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
                <label for="gridwidth">Pixel Scale</label>
                <input
                  id="pixelscale"
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
            </div>
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
            ></my-canvas-display>
          </div>
          <div class="row2 toolbox-container">
            <my-toolbox></my-toolbox>
          </div>
        </div>
        <div class="col3">
          <div class="element-list-container">
            <my-element-list
              .guiElements="${this.guiElements}"
              .selectedElement="${this.selectedElement}"
              @element-selected="${this.handleElementSelected}"
            ></my-element-list>
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
