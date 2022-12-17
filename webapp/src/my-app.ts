import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { GuiElement } from "interfaces/GuiElement";

import "./my-element-list";
import "./my-element-settings";
import "./my-canvas-display";
import "./my-toolbox";

@customElement("my-app")
export class MyApp extends LitElement {
  static styles = [
    css`
      :host {
        background-color: cyan;
      }
    `,
  ];

  @property({ type: Number })
  screenWidth: number = 128;

  @property({ type: Number })
  screenHeight: number = 64;

  @property({ type: Boolean })
  showGrid: boolean = true;

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
      <div class="container">
        <div class="flex-auto">
          <my-canvas-display
            displayWidth="${this.screenWidth}"
            displayHeight="${this.screenHeight}"
            showGrid="${this.showGrid}"
            .elements="${this.guiElements}"
            .selectedElement="${this.selectedElement}"
            @init-canvas="${this.handleInitCanvas}"
            @drawing-update="${this.handleDrawingUpdate}"
            @element-selected="${this.handleElementSelected}"
          ></my-canvas-display>
        </div>
        <div class="flex-auto">
          <my-element-settings
            .selectedElement="${this.selectedElement}"
          ></my-element-settings>
        </div>
        <div class="flex-auto">
          <my-element-list
            .guiElements="${this.guiElements}"
            .selectedElement="${this.selectedElement}"
            @element-selected="${this.handleElementSelected}"
          ></my-element-list>
        </div>
        <div class="flex-auto">
          <my-toolbox></my-toolbox>
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
