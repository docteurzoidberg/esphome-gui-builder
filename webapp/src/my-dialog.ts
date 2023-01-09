import { html, css, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-dialog")
export class MyDialog extends LitElement {
  @property()
  show = false;

  open(): void {
    this.show = true;
  }

  close(): void {
    this.show = false;
  }

  render() {
    return this.show
      ? html`
          <div class="dialog">
            <div class="dialog__content">
              <header>
                <slot name="header"></slot>
              </header>
              <main>
                <slot name="main"></slot>
              </main>
              <footer>
                <slot name="footer"></slot>
              </footer>
              <div
                class="dialog__close-btn"
                @click="${() => {
                  this.close();
                  this.dispatchEvent(
                    new CustomEvent("close", { detail: null })
                  );
                }}"
              ></div>
            </div>
          </div>
          <div class="overlay"></div>
        `
      : nothing;
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
}
