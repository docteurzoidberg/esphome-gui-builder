import {
  LitElement,
  css,
  html,
  PropertyValueMap,
  CSSResult,
  unsafeCSS,
} from "lit";
import { customElement, property, query } from "lit/decorators.js";

import prismShoelaceTheme from "styles/prism-shoelace.css?inline";
import prismDraculaTheme from "styles/prism-dracula.css?inline";
//import prismOneDarkTheme from "styles/prism-onedark.css?inline";
import prismGruvboxTheme from "styles/prism-gruvbox.css?inline";
//import prismNordTheme from "styles/prism-nord.css?inline";

//Prism.js
import Prism from "prismjs";
import "prismjs/components/prism-yaml"; // Language
import "prismjs/components/prism-c"; // Language
import "prismjs/components/prism-cpp"; // Language
Prism.manual = true;

@customElement("my-prism-code")
export class MyPrismCode extends LitElement {
  @property({ type: String })
  code: string = "";

  @property({ type: String })
  lang: string = "js";

  @query("#codeblock")
  codeblock?: HTMLElement;

  @property()
  theme: string = "sl-dark";

  render() {
    return html`
      <div class="app-theme-${this.theme}">
        <pre><code id="codeblock" class="container language-${this
          .lang}">&nbsp;</code></pre>
      </div>
    `;
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.updated(_changedProperties);
    if (_changedProperties.has("code")) {
      //console.log("code changed", this.code);
      if (this.codeblock && this.code != "" && this.lang != "") {
        /*
        const result = Prism.highlight(
          this.code,
          Prism.languages[this.lang],
          this.lang
        );
        //console.log("result", result);
        this.codeblock.innerHTML = result;
        */
        this.codeblock.innerHTML = this.code;
        Prism.highlightAllUnder(this.shadowRoot!);
      }
    }
  }

  static styles: CSSResult[] = [
    css`
      pre {
        max-height: 275px;
        overflow: auto;
      }
    `,
    unsafeCSS(prismShoelaceTheme),
    //unsafeCSS(prismNordTheme),
    unsafeCSS(prismGruvboxTheme),
    //unsafeCSS(prismOneDarkTheme),
    unsafeCSS(prismDraculaTheme),
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "my-prism-code": MyPrismCode;
  }
}
