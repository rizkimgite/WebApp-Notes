class AppBar extends HTMLElement {
  static get observedAttributes() {
    return ["app-title", "tagline"];
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="app-bar__inner">

        <div class="app-bar__mark" aria-hidden="true">
          ✦
        </div>

        <div>
          <p class="app-bar__title"></p>
          <p class="app-bar__tagline"></p>
        </div>

      </div>
    `;

    this.updateContent();
  }

  attributeChangedCallback() {
    this.updateContent();
  }

  updateContent() {
    const title = this.querySelector(".app-bar__title");
    const tagline = this.querySelector(".app-bar__tagline");

    const appTitle = this.getAttribute("app-title");
    const appTagline = this.getAttribute("tagline");

    if (title) {
      title.textContent = appTitle || "Notes App";
    }

    if (tagline) {
      tagline.textContent = appTagline || "Catatan pribadi";
    }
  }
}

customElements.define("app-bar", AppBar);
