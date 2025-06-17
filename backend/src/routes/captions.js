// backend/src/routes/captions.js
import express from 'express';
import { fetchCaptions } from '../services/youtubeService.js';

const router = express.Router();

router.get('/:videoId', async (req, res) => {
  const caps = await fetchCaptions(req.params.videoId);
  res.json(caps);
});

export default router;
