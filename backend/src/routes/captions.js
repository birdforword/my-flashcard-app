// backend/src/routes/captions.js
import express from 'express';
import { fetchCaptions } from '../services/youtubeService.js';

const router = express.Router();

router.get('/:videoId', async (req, res) => {
  const lang = req.query.lang || 'en';
  const caps = await fetchCaptions(req.params.videoId, lang);
  res.json(caps);
});

export default router;
