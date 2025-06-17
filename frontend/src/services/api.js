// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:4000/api' });

// 既存メソッド…
export const fetchHealth = () => api.get('/health').then(r => r.data);
export const fetchCards  = () => api.get('/cards').then(r => r.data);
export const createCard  = data => api.post('/cards', data).then(r => r.data);
export const exportDeck  = () => api.get('/export', { responseType: 'blob' }).then(r => r.data);
export const fetchCaptions = (videoId, lang = 'en') =>
  api.get(`/captions/${videoId}?lang=${lang}`)
     .then(r => r.data);