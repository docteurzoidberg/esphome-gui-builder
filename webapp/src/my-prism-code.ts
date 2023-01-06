import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement, property, query } from "lit/decorators.js";

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

  render() {
    return html`
      <link
        href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-twilight.css"
        rel="stylesheet"
      />
      <div>
        <pre><code id="codeblock" class="language-${this
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

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-prism-code": MyPrismCode;
  }
}
