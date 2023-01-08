import { FontGuiElementJSON } from "interfaces/gui/FontGuiElementJSON";
import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/components/input/input"; // https://shoelace.style/components/input
import "@shoelace-style/shoelace/dist/components/color-picker/color-picker"; // https://shoelace.style/components/color-picke
import "@shoelace-style/shoelace/dist/themes/dark.css"; //shoelace css
import { EspHomeFont } from "classes/esphome/EspHomeFont";
import { RGB24 } from "types/RGB";

import "my-dialog";
import "my-section";

import { MyDialog } from "my-dialog";

@customElement("dialog-add-text")
export class DialogAddText extends LitElement {
  fontJson: FontGuiElementJSON | null = null;

  @query("#dialog")
  dialog?: MyDialog;

  @property()
  newText: string = "TEST";

  @property({ type: Object })
  color: RGB24 = { r: 255, g: 255, b: 255 };

  open(fontguielementjson: FontGuiElementJSON) {
    this.fontJson = fontguielementjson;
    this.dialog?.open();
    this.dispatchEvent(new CustomEvent("open", { detail: fontguielementjson }));
  }

  close(text?: string) {
    this.dialog?.close();
    if (text && this.fontJson) {
      const font = new EspHomeFont(this.fontJson.font);
      this.fontJson.text = text;
      this.fontJson.color = this.color;
      this.fontJson.bounds = font.getBoundingBox(text);
    }
    this.dispatchEvent(
      new CustomEvent("close", { detail: text ? this.fontJson : null })
    );
  }

  render() {
    return html`
      <my-dialog id="dialog" @close="${(_e: Event) => this.close()}">
        <div slot="header">
          <h2>Add text</h2>
        </div>
        <div slot="main">
          <div>
            <h3>Text</h3>
            <sl-input
              placeholder="Enter text"
              value="${this.newText}"
              @sl-change="${(e: any) => {
                this.newText = e.target.value;
              }}"
            ></sl-input>
          </div>
          <sl-color-picker inline label="Select a color"></sl-color-picker>
        </div>
        <div slot="footer">
          <button
            class="dialog__ok-btn"
            @click="${() => {
              this.close(this.newText);
            }}"
          >
            OK
          </button>
          <button
            class="dialog__cancel-btn"
            @click="${() => {
              this.close();
            }}"
          >
            CANCEL
          </button>
        </div>
      </my-dialog>
    `;
  }

  static styles = css``;

  /*
  render() {
    if (!this.show) return html``;
    return html`
      <div class="dialog">
        <div class="dialog__content">
          <header>
            <h2>Add text</h2>
          </header>
          <main>
            <div>
              <sl-input
                label="Text"
                placeholder="Enter text"
                value="${this.newText}"
                @sl-change="${(e: any) => {
                  this.newText = e.target.value;
                }}"
              ></sl-input>
            </div>
            <div></div>
          </main>
          <footer>
            <button
              class="dialog__ok-btn"
              @click="${() => {
                this.close(this.newText);
              }}"
            >
              OK
            </button>
            <button
              class="dialog__cancel-btn"
              @click="${() => {
                this.close();
              }}"
            >
              CANCEL
            </button>
          </footer>
          <div
            class="dialog__close-btn"
            @click="${() => {
              this.close();
            }}"
          ></div>
        </div>
      </div>
      <div class="overlay"></div>
    `;
  }

  static styles = css`
    .overlay {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: fixed;
      background-color: rgba(52, 74, 94, 0.8);
      z-index: 999;
      overflow-x: hidden;
      overflow-y: auto;
      outline: none;
    }
    .dialog {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: fixed;
      z-index: 1000;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dialog__content {
      position: relative;
      max-width: 520px;
      margin-bottom: 5%;
      //background-color: white;
      padding: 30px;
      background-color: #1a242c;
      border-radius: 5px;
      box-shadow: 0 30px 30px 0 rgba(52, 74, 94, 0.8);
    }
    .dialog h2 {
      margin: 0;
      margin-bottom: 10px;
      border-bottom: solid 2px #0279c0;
    }

    .dialog__ok-btn {
      cursor: pointer;
      height: 30px;
      padding: 6px 15px;
      margin-right: 15px;
      min-width: 60px;
      transition-duration: 0.25s;
      transition-property: background-color, color;
      text-align: center;
      border-width: 1px;
      border-style: solid;
      border-radius: 3px;
      box-shadow: 0 1px 2px 0 rgba(64, 61, 4, 0.44);
      font-size: 14px;
      color: white;
      border-color: transparent;
      background-color: #0279c0;
    }
    .dialog__cancel-btn {
      cursor: pointer;
      color: #0279c0;
      background-color: transparent;
      border-color: transparent;
      box-shadow: none;
      font-family: -apple-system, BlinkMacSystemFont, Ubuntu, "Segoe UI", Roboto,
        Oxygen, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }
    .dialog__cancel-btn:hover {
      text-decoration: underline;
    }
    .dialog__close-btn {
      border: 0;
      background: none;
      position: absolute;
      top: 20px;
      right: 20px;
      width: 15px;
      height: 15px;
      cursor: pointer;
    }
    .dialog__close-btn::before,
    .dialog__close-btn::after {
      position: absolute;
      top: -2px;
      right: 6px;
      display: block;
      width: 2px;
      height: 19px;
      content: "";
      border-radius: 3px;
      background-color: #d9d9d9;
    }
    .dialog__close-btn::before {
      transform: rotate(45deg);
    }
    .dialog__close-btn::after {
      transform: rotate(-45deg);
    }
    main {
      margin-bottom: 15px;
    }
    .warning {
      color: lightgray;
      font-size: 14pt;
    }
    .warn {
      color: red;
      font-family: Wendy;
      font-size: 18pt;
      font-weight: bold;
    }
    .presetname {
      font-size: 1.2em;
      cursor: pointer;
    }
    .presetinfo {
      color: lightgray;
    }
  `;
*/
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-add-text": DialogAddText;
  }
}
