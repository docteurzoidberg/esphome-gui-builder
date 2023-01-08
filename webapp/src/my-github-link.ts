import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-github-link")
export class MyGithubLink extends LitElement {
  render() {
    return html`<div class="githublink">
      <a
        target="new"
        title="Goto github's repo"
        href="https://github.com/docteurzoidberg/esphome-gui-builder"
        ><img class="githublogo" src="githubw.png" alt="github" height="32"
      /></a>
    </div> `;
  }

  static styles = css`
    .githublogo {
      vertical-align: middle;
      image-rendering: pixelated;
    }
    .githublink {
      vertical-align: middle;
      float: right;
      margin-right: 15px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-github-link": MyGithubLink;
  }
}
