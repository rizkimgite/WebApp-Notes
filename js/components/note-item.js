class NoteItem extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const note = this.note;

    if (!note) {
      return;
    }

    const noteCard = document.createElement("article");
    noteCard.className = "note-card";
    noteCard.dataset.noteId = note.id;
    noteCard.dataset.archived = String(note.archived);

    const noteTop = document.createElement("div");
    noteTop.className = "note-card__top";

    const noteTitle = document.createElement("h3");
    noteTitle.className = "note-card__title";
    noteTitle.textContent = note.title;

    const noteDate = document.createElement("time");
    noteDate.className = "note-card__date";
    noteDate.setAttribute("datetime", note.createdAt);

    const date = new Date(note.createdAt);

    noteDate.textContent = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const noteBody = document.createElement("p");
    noteBody.className = "note-card__body";
    noteBody.textContent = note.body;

    noteTop.appendChild(noteTitle);
    noteTop.appendChild(noteDate);

    const noteActions = document.createElement("div");
    noteActions.className = "note-card__actions";

    const deleteButton = document.createElement("button");
    deleteButton.className = "note-card__delete";
    deleteButton.type = "button";
    deleteButton.textContent = "Hapus";

    deleteButton.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("note-delete", {
          detail: { id: note.id },
          bubbles: true,
        }),
      );
    });

    noteActions.appendChild(deleteButton);
    noteCard.appendChild(noteTop);
    noteCard.appendChild(noteBody);
    noteCard.appendChild(noteActions);

    this.appendChild(noteCard);
  }
}

customElements.define("note-item", NoteItem);
