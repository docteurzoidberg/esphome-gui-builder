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
import { LibraryManager } from "classes/LibraryManager";
import { EspHomeFontJSON } from "interfaces/esphome/EspHomeFontJSON";
import { EspHomeImageJSON } from "interfaces/esphome/EspHomeImageJSON";
import { EspHomeAnimationJSON } from "interfaces/esphome/EspHomeAnimationJSON";

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

  tree: any;

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

  async connectedCallback() {
    super.connectedCallback();
    LibraryManager.loadConfig().then(() => {
      console.log("LibraryManager: config loaded", LibraryManager.getConfig());
      LibraryManager.loadLibraries().then(() => {
        console.log(
          "LibraryManager: libraries loaded",
          LibraryManager.getLibraries()
        );

        //construct tree from folders with library name as root
        const tree = Object.create(null);

        const types = ["images", "animations", "fonts"];
        types.forEach((type) => {
          const libs = LibraryManager.getLibraries(type);
          libs.forEach((lib) => {
            if (!lib.files) return;
            if (!lib.manifest) return;
            const files = lib.files;
            files.forEach((_file) => {
              if (_file.type !== type) return;
              //split folder and file name
              const folder = _file.path.split("/").slice(0, -1).join("/");
              const json = _file.data;
              const libname = lib.manifest!.name;
              tree[_file.type] = tree[_file.type] || Object.create(null);
              tree[_file.type][libname] =
                tree[_file.type][libname] || Object.create(null);
              tree[_file.type][libname][folder] = json;
              console.log(type + " file", json);
            });
          });
        });

        console.dir(tree);
        this.tree = tree;
        this.dataLoaded = true;
        this.fontsLoaded = true;
        this.animationsLoaded = true;
        this.imagesLoaded = true;
        this.checkRaiseLoaded();
      });
    });
  }

  renderFonts(libname: string, foldername: string, fonts: EspHomeFontJSON[]) {
    return fonts.map((font) => {
      console.log("font/" + libname + "/" + foldername + "/" + font.name);
      return html`<sl-tree-item>${font.name}</sl-tree-item>`;
    });
  }

  renderImages(
    libname: string,
    foldername: string,
    images: EspHomeImageJSON[]
  ) {
    return images.map((image) => {
      console.log("image/" + libname + "/" + foldername + "/" + image.name);
      return html`
        <img
          src="${image.dataurl}"
          width="${image.width * this.displayScale}"
          height="${image.height * this.displayScale}"
          alt="${image.name}"
        />
      `;
    });
  }

  renderAnimations(
    libname: string,
    foldername: string,
    animations: EspHomeAnimationJSON[]
  ) {
    return animations.map((animation) => {
      console.log(
        "animation/" + libname + "/" + foldername + "/" + animation.name
      );
      return html`<sl-tree-item>${animation.name}</sl-tree-item>`;
    });
  }

  renderAnimationLib(libname: string, lib: any) {
    if (!lib) return html`no lib`;
    return Object.keys(lib).map((folder) => {
      console.log("font/" + libname + "/" + folder);
      const json = lib[folder];
      return html`
        <sl-tree-item>
          <sl-icon library="boxicons" name="bx-folder"></sl-icon>
          ${folder} ${this.renderAnimations(libname, folder, json)}
        </sl-tree-item>
      `;
    });
  }

  renderImageLib(libname: string, lib: any) {
    if (!lib) return html`no lib`;
    return Object.keys(lib).map((folder) => {
      console.log("font/" + libname + "/" + folder);
      const json = lib[folder];
      return html`
        <sl-tree-item>
          <sl-icon library="boxicons" name="bx-folder"></sl-icon>
          ${folder}
          <sl-tree-item>
            <div class="image-container">
              ${this.renderImages(libname, folder, json)}
            </div>
          </sl-tree-item>
        </sl-tree-item>
      `;
    });
  }

  renderFontLib(libname: string, lib: any) {
    if (!lib) return html`no lib`;
    return Object.keys(lib).map((folder) => {
      console.log("font/" + libname + "/" + folder);
      const json = lib[folder];
      return html`
        <sl-tree-item>
          <sl-icon library="boxicons" name="bx-folder"></sl-icon>
          ${folder} ${this.renderFonts(libname, folder, json)}
        </sl-tree-item>
      `;
    });
  }

  renderTreeFonts() {
    if (!this.tree) return html`no tree`;
    if (!this.tree.fonts) return html`no tree fonts`;
    console.log("renderTree", this.tree.fonts);
    return Object.keys(this.tree.fonts).map((libname) => {
      console.log("font/" + libname);
      const lib = this.tree.fonts[libname];
      return html`
        <sl-tree-item>
          ${libname} ${this.renderFontLib(libname, lib)}
        </sl-tree-item>
      `;
    });
  }

  renderTreeImages() {
    if (!this.tree) return html`no tree`;
    if (!this.tree.images) return html`no tree images`;
    console.log("renderTree", this.tree.images);
    return Object.keys(this.tree.images).map((libname) => {
      console.log("image/" + libname);
      const lib = this.tree.images[libname];
      return html`
        <sl-tree-item>
          ${libname} ${this.renderImageLib(libname, lib)}
        </sl-tree-item>
      `;
    });
  }

  renderTreeAnimations() {
    if (!this.tree) return html`no tree`;
    if (!this.tree.images) return html`no tree animations`;
    console.log("renderTree", this.tree.images);
    return Object.keys(this.tree.images).map((libname) => {
      console.log("animation/" + libname);
      const lib = this.tree.animations[libname];
      return html`
        <sl-tree-item>
          ${libname} ${this.renderAnimationLib(libname, lib)}
        </sl-tree-item>
      `;
    });
  }

  renderTree() {
    if (!this.tree) return html`no tree`;
    return html`
      <sl-tree class="tree-with-icons" selection="leaf">
        <sl-tree-item>
          <sl-icon library="boxicons" name="bx-text"></sl-icon>
          Fonts ${this.renderTreeFonts()}
        </sl-tree-item>
        <sl-tree-item>
          <sl-icon library="boxicons" name="bx-image"></sl-icon>
          Images ${this.renderTreeImages()}
        </sl-tree-item>
        <sl-tree-item>
          <sl-icon library="boxicons" name="bx-movie"></sl-icon>
          Animations ${this.renderTreeAnimations()}
        </sl-tree-item>
      </sl-tree>
    `;
  }

  render() {
    return html`<div class="tools">${this.renderTree()}</div>`;
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

    .image-container img {
      display: inline-block;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-toolbox-tree": MyToolboxTree;
  }
}
