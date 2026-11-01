const BASE_URL = "https://notes-api.dicoding.dev/v2";

// Mengambil daftar catatan dari server.
export async function getNotes() {
  const response = await fetch(`${BASE_URL}/notes`);
  const responseJson = await response.json();

  if (!response.ok || responseJson.status !== "success") {
    throw new Error(responseJson.message || "Gagal mengambil catatan.");
  }

  return responseJson.data;
}

// Mengirim catatan baru ke server.
export async function createNote({ title, body }) {
  const response = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body }),
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.status !== "success") {
    throw new Error(responseJson.message || "Gagal membuat catatan.");
  }

  return responseJson.data;
}

// Menghapus catatan berdasarkan ID.
export async function deleteNote(noteId) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
    method: "DELETE",
  });

  const responseJson = await response.json();

  if (!response.ok || responseJson.status !== "success") {
    throw new Error(responseJson.message || "Gagal menghapus catatan.");
  }

  return responseJson;
}
