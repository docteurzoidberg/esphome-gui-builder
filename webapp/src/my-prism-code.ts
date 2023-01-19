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

      <div class="">
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

  static styles = css`
    pre {
      max-height: 275px;
      overflow: auto;
    }
    /**
 * Dracula Theme originally by Zeno Rocha [@zenorocha]
 * https://draculatheme.com/
 *
 * Ported for PrismJS by Albert Vallverdu [@byverdu]
 */

    code[class*="language-"],
    pre[class*="language-"] {
      font-size: 0.9em;
      color: #f8f8f2;
      background: none;
      text-shadow: 0 1px rgba(0, 0, 0, 0.3);
      font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
      text-align: left;
      white-space: pre;
      word-spacing: normal;
      word-break: normal;
      word-wrap: normal;
      line-height: 1.5;
      -moz-tab-size: 2;
      -o-tab-size: 2;
      tab-size: 2;
      -webkit-hyphens: none;
      -moz-hyphens: none;
      -ms-hyphens: none;
      hyphens: none;
    }

    /* Code blocks */
    pre[class*="language-"] {
      padding: 1em;
      margin: 0.5em 0;
      overflow: auto;
      border-radius: 0.3em;
    }

    :not(pre) > code[class*="language-"],
    pre[class*="language-"] {
      background: #282a36;
    }

    /* Inline code */
    :not(pre) > code[class*="language-"] {
      padding: 0.1em;
      border-radius: 0.3em;
      white-space: normal;
    }

    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
      color: #6272a4;
    }

    .token.punctuation {
      color: #f8f8f2;
    }

    .namespace {
      opacity: 0.7;
    }

    .token.property,
    .token.tag,
    .token.constant,
    .token.symbol,
    .token.deleted {
      color: #ff79c6;
    }

    .token.boolean,
    .token.number {
      color: #bd93f9;
    }

    .token.selector,
    .token.attr-name,
    .token.string,
    .token.char,
    .token.builtin,
    .token.inserted {
      color: #50fa7b;
    }

    .token.operator,
    .token.entity,
    .token.url,
    .language-css .token.string,
    .style .token.string,
    .token.variable {
      color: #f8f8f2;
    }

    .token.atrule,
    .token.attr-value,
    .token.function,
    .token.class-name {
      color: #f1fa8c;
    }

    .token.keyword {
      color: #8be9fd;
    }

    .token.regex,
    .token.important {
      color: #ffb86c;
    }

    .token.important,
    .token.bold {
      font-weight: bold;
    }

    .token.italic {
      font-style: italic;
    }

    .token.entity {
      cursor: help;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-prism-code": MyPrismCode;
  }
}
