import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@shoelace-style/shoelace/dist/components/tree/tree";
import "@shoelace-style/shoelace/dist/components/tree-item/tree-item";

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { registerIconLibrary } from "@shoelace-style/shoelace/dist/utilities/icon-library.js";
import "@shoelace-style/shoelace/dist/themes/dark.css"; //shoelace css

import "my-image-list";
import "my-animation-list";
import "my-font-list";
import "my-section";

registerIconLibrary("boxicons", {
  resolver: (name) => {
    let folder = "regular";
    if (name.substring(0, 4) === "bxs-") folder = "solid";
    if (name.substring(0, 4) === "bxl-") folder = "logos";
    return `https://cdn.jsdelivr.net/npm/boxicons@2.0.5/svg/${folder}/${name}.svg`;
  },
  mutator: (svg) => svg.setAttribute("fill", "currentColor"),
});

setBasePath("/assets/shoelace"); // Set the base path to the folder you copied Shoelace's assets to
//-

@customElement("my-toolbox-tree")
export class MyToolboxTree extends LitElement {
  @property()
  dataLoaded = false;

  @property()
  displayScale = 3;

  fontsLoaded = false;
  animationsLoaded = false;
  imagesLoaded = false;

  handleFontsLoaded() {
    this.fontsLoaded = true;
    this.checkRaiseLoaded();
  }
  handleAnimationsLoaded() {
    this.animationsLoaded = true;
    this.checkRaiseLoaded();
  }
  handleImagesLoaded() {
    this.imagesLoaded = true;
    this.checkRaiseLoaded();
  }

  checkRaiseLoaded() {
    if (this.dataLoaded) return;
    if (this.fontsLoaded && this.imagesLoaded && this.animationsLoaded) {
      this.dataLoaded = true;
      const event = new CustomEvent("toolbox-loaded", { detail: null });
      this.dispatchEvent(event);
    }
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <div class="tools">
        <sl-tree class="tree-with-icons" selection="leaf">
          <sl-tree-item>
            <sl-icon library="boxicons" name="bx-text"></sl-icon>
            Fonts
            <sl-tree-item>
              Stock
              <sl-tree-item>
                Font1
                <!-- TODO: insert render of the font here -->
              </sl-tree-item>
              <sl-tree-item>
                Font2
                <!-- TODO: insert render of the font here -->
              </sl-tree-item>
              <sl-tree-item>
                Font3
                <!-- TODO: insert render of the font here -->
              </sl-tree-item>
            </sl-tree-item>
            <sl-tree-item>
              Bigs screens
              <sl-tree-item>
                Font1
                <!-- TODO: insert render of the font here -->
              </sl-tree-item>
              <sl-tree-item>
                Font2
                <!-- TODO: insert render of the font here -->
              </sl-tree-item>
            </sl-tree-item>
          </sl-tree-item>

          <sl-tree-item>
            <sl-icon library="boxicons" name="bx-image"></sl-icon>
            Images
            <sl-tree-item>
              Stock
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder1
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder2
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder3
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
            </sl-tree-item>
            <sl-tree-item>
              Bigs screens
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder1
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder2
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder3
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
            </sl-tree-item>
            <sl-tree-item>
              Niel's switchplate sample
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder1
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder2
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder3
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
            </sl-tree-item>
          </sl-tree-item>
          <sl-tree-item>
            <sl-icon library="boxicons" name="bx-movie"></sl-icon>
            Animations
            <sl-tree-item>
              Stock
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder1
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder2
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder3
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
            </sl-tree-item>
            <sl-tree-item>
              Bigs screens
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder1
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder2
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
              <sl-tree-item>
                <sl-icon library="boxicons" name="bx-folder"></sl-icon>
                Folder3
                <!-- TODO: insert render of the folder here -->
              </sl-tree-item>
            </sl-tree-item>
          </sl-tree-item>
        </sl-tree>
      </div>
    `;
  }

  static styles = css`
    .tools {
      //border: 2px solid;
      max-height: 345px;
      overflow: auto;
      background-color: #333;
      padding: 10px;
    }
    .tree-with-lines {
      --indent-guide-width: 1px;
      --indent-guide-color: lightgray;
    }
    h2 {
      margin-top: 0;
    }

    h2,
    h3 {
      text-decoration: underline;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-toolbox-tree": MyToolboxTree;
  }
}
