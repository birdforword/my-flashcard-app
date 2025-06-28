// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:4000/api' });

export const fetchDecks     = () => api.get('/decks').then(r => r.data);
export const createDeck     = name => api.post('/decks', { name }).then(r => r.data);
export const deleteDeck     = id   => api.delete(`/decks/${id}`);
export const deleteCardsByDeck = id => api.delete(`/cards?deckId=${id}`);