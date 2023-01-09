import { StorageManager } from "classes/StorageManager";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ScreenPreset } from "types/ScreenPreset";

@customElement("dialog-load-preset")
export class DialogLoadPreset extends LitElement {
  presets: ScreenPreset[] = [];
  selectedPreset?: ScreenPreset;

  @property()
  show: boolean = false;

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
      height: 34px;
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
      font-size: 18px;
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
      font-size: 18px;
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
    h2,
    button {
      font-family: Wendy;
    }
  `;

  open() {
    this.show = true;
    this.dispatchEvent(new CustomEvent("open"));
  }

  close(preset?: ScreenPreset) {
    this.show = false;
    this.dispatchEvent(new CustomEvent("close", { detail: preset }));
  }

  selectPreset(e: Event) {
    const index = (e.target as HTMLInputElement).value;
    this.selectedPreset = this.presets[parseInt(index)];
  }

  renderPresets() {
    return this.presets.map((preset, index) => {
      return this.renderPreset(preset, index);
    });
  }

  renderPreset(preset: ScreenPreset, index: number) {
    return html`
      <div>
        <input
          type="radio"
          name="preset"
          id="preset${index}"
          value=${index}
          .checked=${this.selectedPreset?.name === preset.name || index === 0}
          @change=${this.selectPreset}
        />
        <label class="presetname" for="preset${index}">${preset.name}</label>
        <span class="presetinfo">
           (${preset.width}x${preset.height}, ${preset.colormode}</span>)
        </span>

      </div>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    StorageManager.loadScreenPresets().then((presets) => {
      this.presets = presets;
      if (this.presets.length > 0) this.selectedPreset = this.presets[0];
      this.requestUpdate();
    });
  }

  render() {
    if (!this.show) return html``;
    return html`
      <div class="dialog">
        <div class="dialog__content">
          <header>
            <h2>Load preset</h2>
          </header>
          <main>
            ${this.renderPresets()}
            <hr />
            <div class="warning">
              <div class="warn">WARNING:</div>
              loading screen preset will change the screensettings and will
              reset the scene to an empty one.
            </div>
          </main>
          <footer>
            <button
              class="dialog__ok-btn"
              @click="${() => {
                this.close(this.selectedPreset);
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
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-load-preset": DialogLoadPreset;
  }
}
