import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { EspHomeAnimation } from "esphome/animation/EspHomeAnimation";
import { EspHomeAnimationJSON } from "esphome/animation/EspHomeAnimationJSON";

const imageScale = 5;

@customElement("my-animation-list")
export class MyAnimationList extends LitElement {
  @property({ type: Array })
  animations: Array<EspHomeAnimation> = [];

  @property({ type: Boolean })
  animationsLoaded = false;

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
    //TODO: generate uniques ids !
    /*
    const newGuiElement: GuiElement = {
      id: animation.data!.name,
      type: "animation",
      name: animation.data!.name,
      x: 0,
      y: 0,
      zorder: 1,
      data: animation.data!,
    };
    ev.dataTransfer!.setData(
      "application/my-app",
      JSON.stringify(newGuiElement)
    );
    */

    //TODO
    const img = new Image();
    img.src = "drag_gif.png";
    ev.dataTransfer!.setDragImage(img, 0, 0);
    ev.dataTransfer!.effectAllowed = "move";
  }

  connectedCallback() {
    super.connectedCallback();
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
          width=${animation.width * imageScale}
          height=${animation.height * imageScale}
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
