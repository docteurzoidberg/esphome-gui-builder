import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-loading-screen")
export class MyLoadingScreen extends LitElement {
  @property({ type: Boolean }) open = false;
  @property({ type: Array }) loadingMessages = [
    "Generating matrices...",
    "Searching for side quests...",
    "Launching rocket...",
    "Loading virtual reality...",
    "Initializing matter replication...",
    "Loading laser weapons...",
    "Searching for ultimate answer...",
    "Loading universe simulation...",
    "Building robots...",
    "Loading Force data...",
    "Loading time travel technology...",
    "Searching for habitable planets...",
    "Initializing extraterrestrial contact protocols...",
    "Loading Star Wars data...",
    "Creating RPG characters...",
    "Loading combat armor...",
    "Searching for dimensional portals...",
    "Loading Matrix trilogy data...",
    "Loading Star Trek data...",
    "Initializing holodeck simulation...",
    "Hacking the mainframe...",
    "Overclocking the CPU...",
    "Searching for wormholes...",
    "Loading data from the future...",
    "Initializing time loop simulation...",
  ];
  @property({ type: Number }) currentMessage = 0;
  private messageInterval: any;

  connectedCallback() {
    super.connectedCallback();
    //random first message
    this.currentMessage = Math.ceil(
      Math.random() * this.loadingMessages.length
    );
    this.messageInterval = setInterval(() => {
      this.currentMessage =
        (this.currentMessage + 1) % this.loadingMessages.length;
      this.requestUpdate();
    }, 3000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.messageInterval);
  }

  render() {
    return this.open
      ? html`
          <div class="loading-overlay">
            <div class="loading-container">
              <div class="loading-header">
                <h2>Gui Helper for</h2>
                <sl-icon
                  src="svg/esphome.svg"
                  style="font-size: 8rem;"
                ></sl-icon>
              </div>
              <div class="loading-spinner"></div>
              <p class="loading-message">
                ${this.loadingMessages[this.currentMessage]}
              </p>
            </div>
          </div>
        `
      : html``;
  }
  static styles = css`
    /* Ajoutez ici vos styles CSS pour l'animation de chargement */
    /* ex: */
    .loading-spinner {
      border: 16px solid var(--dracula-color-foreground-600);
      border-top: 16px solid var(--dracula-color-purple-600);
      border-radius: 50%;
      width: 120px;
      height: 120px;
      animation: spin 2s linear infinite;
      margin-bottom: 10px;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    /* Styles pour le composant de chargement en plein écran */
    .loading-overlay {
      position: fixed; /* pour occuper tout l'écran */
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999; /* pour être au dessus des autres éléments */
      background-color: rgba(36, 38, 49, 0.9); /* overlay bleu foncé*/
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      padding: 40px;
      border-radius: 6px;
      width: 480;
      background-color: var(--dracula-color-background-900);
    }

    /* Styles pour le header */
    .loading-header {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Teko";
    }
    .loading-header h2 {
      font-size: 4rem;
      color: #fff;
      padding: 15px;
    }
    .loading-message {
      font-family: "Roboto";
      font-size: 1rem;
      padding: 20px;
      color: var(--dracula-color-foreground-200);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-loading-screen": MyLoadingScreen;
  }
}
