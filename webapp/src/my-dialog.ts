import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-dialog")
export class MyDialog extends LitElement {
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
      background-color: white;
      padding: 30px;
      color: #344a5e;
      border-radius: 5px;
      box-shadow: 0 30px 30px 0 rgba(52, 74, 94, 0.8);
    }
    .dialog h2 {
      margin: 0;
      margin-bottom: 10px;
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
  `;

  @property()
  header = "";

  @property()
  show = false;

  private _close(detail: string): void {
    // Fire a custom event for others to listen to
    this.dispatchEvent(new CustomEvent("close", { detail }));
  }

  open(): void {
    this.show = true;
  }

  handleClick(): void {
    this.show = false;
    this._close("ok");
  }

  close(result: string): void {
    this.show = false;
    this._close(result);
  }

  render() {
    return html`
      ${this.show
        ? html`
            <div class="dialog">
              <div class="dialog__content">
                <header>
                  <h2>${this.header}</h2>
                </header>
                <main>
                  <slot></slot>
                </main>
                <footer>
                  <button
                    class="dialog__ok-btn"
                    @click="${() => this.handleClick()}"
                  >
                    OK
                  </button>
                  <button
                    class="dialog__cancel-btn"
                    @click="${() => this.close("cancel")}"
                  >
                    CANCEL
                  </button>
                </footer>
                <div
                  class="dialog__close-btn"
                  @click="${() => this.close("close")}"
                ></div>
              </div>
            </div>
            <div class="overlay"></div>
          `
        : ""}
    `;
  }
}
