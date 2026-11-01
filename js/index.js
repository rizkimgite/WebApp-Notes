import "../css/style.css";

import { getNotes, createNote, deleteNote } from "./data/notes.js";

import "./components/app-bar.js";
import "./components/note-form.js";
import "./components/note-item.js";

let notes = [];
let activeRequests = 0;
let isSubmitting = false;
const deletingNoteIds = new Set();

const notesListElement = document.querySelector("#notes-list");
const noteCountElement = document.querySelector("#note-count");
const emptyStateElement = document.querySelector("#empty-state");
const loadingElement = document.querySelector("#loading-indicator");
const errorElement = document.querySelector("#error-message");
const noteFormElement = document.querySelector("note-form");

function renderNotes() {
  notesListElement.innerHTML = "";
  const sortedNotes = [...notes].sort(
    (firstNote, secondNote) =>
      new Date(secondNote.createdAt) - new Date(firstNote.createdAt),
  );

  for (const note of sortedNotes) {
    const noteElement = document.createElement("note-item");
    noteElement.note = note;
    notesListElement.appendChild(noteElement);
  }

  noteCountElement.textContent = notes.length;
  emptyStateElement.hidden = notes.length !== 0;
}

function startLoading() {
  activeRequests += 1;
  loadingElement.hidden = false;
}

function stopLoading() {
  activeRequests -= 1;
  loadingElement.hidden = activeRequests === 0;
}

function showError(message) {
  errorElement.textContent = message;
  errorElement.hidden = message === "";
}

async function loadNotes() {
  startLoading();

  try {
    showError("");
    notes = await getNotes();
    renderNotes();
  } catch (error) {
    showError(error.message || "Terjadi kesalahan saat mengambil catatan.");
  } finally {
    stopLoading();
  }
}

document.addEventListener("note-submit", async function (event) {
  if (isSubmitting) {
    return;
  }

  const title = event.detail.title;
  const body = event.detail.body;

  isSubmitting = true;
  startLoading();

  try {
    showError("");
    noteFormElement.setLoading(true);
    await createNote({ title, body });
    noteFormElement.resetForm();
    await loadNotes();
  } catch (error) {
    showError(error.message || "Terjadi kesalahan saat membuat catatan.");
  } finally {
    stopLoading();
    isSubmitting = false;
    noteFormElement.setLoading(false);
  }
});

document.addEventListener("note-delete", async function (event) {
  const noteId = event.detail.id;

  if (deletingNoteIds.has(noteId)) {
    return;
  }

  deletingNoteIds.add(noteId);
  startLoading();

  try {
    showError("");
    await deleteNote(noteId);
    await loadNotes();
  } catch (error) {
    showError(error.message || "Terjadi kesalahan saat menghapus catatan.");
  } finally {
    stopLoading();
    deletingNoteIds.delete(noteId);
  }
});

loadNotes();
