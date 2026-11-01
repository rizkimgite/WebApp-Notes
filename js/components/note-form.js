class NoteForm extends HTMLElement {
  connectedCallback() {
    this.render();

    const form = this.querySelector("form");

    const titleInput = this.querySelector("#note-title");
    const bodyInput = this.querySelector("#note-body");

    const titleHint = this.querySelector("#title-hint");
    const bodyHint = this.querySelector("#body-hint");

    const minTitleLength = Number(this.getAttribute("min-title-length")) || 3;
    const minBodyLength = Number(this.getAttribute("min-body-length")) || 5;

    titleInput.addEventListener("input", () => {
      this.validateInput(titleInput, titleHint, minTitleLength, "Judul");
    });

    bodyInput.addEventListener("input", () => {
      this.validateInput(bodyInput, bodyHint, minBodyLength, "Isi catatan");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const titleIsValid = this.validateInput(
        titleInput,
        titleHint,
        minTitleLength,
        "Judul",
      );

      const bodyIsValid = this.validateInput(
        bodyInput,
        bodyHint,
        minBodyLength,
        "Isi catatan",
      );

      if (!titleIsValid || !bodyIsValid) {
        if (!titleIsValid) {
          titleInput.focus();
        } else {
          bodyInput.focus();
        }

        return;
      }

      this.dispatchEvent(
        new CustomEvent("note-submit", {
          detail: {
            title: titleInput.value.trim(),
            body: bodyInput.value.trim(),
          },
          bubbles: true,
        }),
      );

    });

    form.addEventListener("reset", () => {
      titleInput.setCustomValidity("");
      bodyInput.setCustomValidity("");

      titleInput.classList.remove("is-invalid");
      bodyInput.classList.remove("is-invalid");

      titleHint.classList.remove("is-error");
      bodyHint.classList.remove("is-error");

      titleHint.textContent = `Minimal ${minTitleLength} karakter.`;
      bodyHint.textContent = `Minimal ${minBodyLength} karakter.`;
    });
  }

  resetForm() {
    const form = this.querySelector("form");
    form.reset();
  }

  setLoading(isLoading) {
    const submitButton = this.querySelector(".submit-button");
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? "Menyimpan..." : "＋ Simpan catatan";
  }

  render() {
    const minTitleLength = this.getAttribute("min-title-length") || 3;
    const minBodyLength = this.getAttribute("min-body-length") || 5;

    this.innerHTML = `
      <form class="note-form" novalidate>

        <div class="form-field">

          <label for="note-title">
            Judul catatan
          </label>

          <input
            id="note-title"
            name="title"
            type="text"
            placeholder="Contoh: Belajar di Dicoding"
            autocomplete="off"
            minlength="${minTitleLength}"
            required
          />

          <p
            class="form-field__hint"
            id="title-hint"
            aria-live="polite"
          >
            Minimal ${minTitleLength} karakter.
          </p>

        </div>

        <div class="form-field form-field--body">

          <label for="note-body">
            Isi catatan
          </label>

          <textarea
            id="note-body"
            name="body"
            placeholder="Tulis detail catatan di sini..."
            minlength="${minBodyLength}"
            required
          ></textarea>

          <p
            class="form-field__hint"
            id="body-hint"
            aria-live="polite"
          >
            Minimal ${minBodyLength} karakter.
          </p>

        </div>

        <button class="submit-button" type="submit">
          <span aria-hidden="true">＋</span>
          Simpan catatan
        </button>

      </form>
    `;
  }

  validateInput(input, hint, minLength, fieldName) {
    const value = input.value.trim();

    let errorMessage = "";

    if (value.length === 0) {
      errorMessage = `${fieldName} wajib diisi.`;
    } else if (value.length < minLength) {
      errorMessage = `${fieldName} minimal ${minLength} karakter.`;
    }

    input.setCustomValidity(errorMessage);

    if (errorMessage !== "") {
      input.classList.add("is-invalid");
      hint.classList.add("is-error");
      hint.textContent = errorMessage;
    } else {
      input.classList.remove("is-invalid");
      hint.classList.remove("is-error");
      hint.textContent = "Sudah bagus.";
    }

    return errorMessage === "";
  }
}

customElements.define("note-form", NoteForm);
