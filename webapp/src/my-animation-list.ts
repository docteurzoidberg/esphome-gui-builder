import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { EspHomeAnimation } from "esphome/animation/EspHomeAnimation";
import { EspHomeAnimationJSON } from "esphome/animation/EspHomeAnimationJSON";
import { GuiElementJSON } from "gui/GuiElementJSON";

@customElement("my-animation-list")
export class MyAnimationList extends LitElement {
  @property({ type: Array })
  animations: Array<EspHomeAnimation> = [];

  @property({ type: Boolean })
  animationsLoaded = false;

  @property({ type: Number })
  displayScale = 1;

  dragImg = new Image();

  haveLocalData(): boolean {
    const localAnimationsStr = localStorage.getItem("animations.json");
    if (!localAnimationsStr || localAnimationsStr == "") return false;
    return true;
  }

  raiseAnimationsLoaded() {
    const event = new CustomEvent("animations-loaded", {
      detail: this.animations,
    });
    this.dispatchEvent(event);
  }

  handleDragStart(ev: DragEvent, animation: EspHomeAnimation) {
    const elem: GuiElementJSON = {
      id: "id_" + animation.name, //TODO: generate uniques ids !
      name: animation.name,
      x: 0, //overwriten when dropped
      y: 0, //overwriten when dropped
      zorder: 0,
      type: "animation",
      jsonData: animation.originalData,
    };

    ev.dataTransfer!.setData(
      "application/gui-element-json",
      JSON.stringify(elem)
    );
    ev.dataTransfer!.setDragImage(this.dragImg, 0, 0);
    ev.dataTransfer!.effectAllowed = "move";
  }

  connectedCallback() {
    super.connectedCallback();
    this.dragImg.src = "drag_gif.png";
    fetch("./animations.json")
      .then((response) => response.json())
      .then((json: Array<EspHomeAnimationJSON>) => {
        this.animations = json.map((animation) => {
          return new EspHomeAnimation(animation);
        });
        this.raiseAnimationsLoaded();
        //console.dir(json);
      });
  }

  renderAnimations() {
    if (!this.animations) return;
    return this.animations.map((animation: EspHomeAnimation) => {
      return html`
        <img
          @dragstart="${(ev: DragEvent) => this.handleDragStart(ev, animation)}"
          class="image"
          width=${animation.width * this.displayScale}
          height=${animation.height * this.displayScale}
          src="${animation.previewDataUrl}"
        />
      `;
    });
  }

  render() {
    return html`<div class="animations">${this.renderAnimations()}</div> `;
  }

  static styles = css`
    :host {
      background-color: pink;
    }
    .image {
      border: 5px solid blue;
    }
    img {
      image-rendering: pixelated;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-animation-list": MyAnimationList;
  }
}
