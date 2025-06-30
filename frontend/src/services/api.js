// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:4000/api" });

// ----- Card / Deck APIs -----
export const fetchHealth = () => api.get("/health").then((r) => r.data);
export const fetchCards = (deckId) =>
  api.get(`/cards?deckId=${deckId}`).then((r) => r.data);
export const createCard = (data) =>
  api.post("/cards", data).then((r) => r.data);
export const exportDeck = (deckId) =>
  api
    .get(`/export?deckId=${deckId}`, { responseType: "blob" })
    .then((r) => r.data);

// Captions
export const fetchCaptions = (videoId, lang = "en") =>
  api.get(`/captions/${videoId}?lang=${lang}`).then((r) => r.data);

export const fetchVideoTitle = (videoId) =>
  api.get(`/videos/${videoId}/title`).then((r) => r.data.title);

// Deck management
export const fetchDecks = () => api.get("/decks").then((r) => r.data);
export const createDeck = (name) =>
  api.post("/decks", { name }).then((r) => r.data);
export const deleteDeck = (id) => api.delete(`/decks/${id}`);
export const deleteCardsByDeck = (id) => api.delete(`/cards?deckId=${id}`);
export const deleteCard = (id) => api.delete(`/cards/${id}`);
