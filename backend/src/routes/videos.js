// backend/src/routes/videos.js
import express from "express";
import { fetchVideoDescription } from "../services/youtubeInfoService.js";

const router = express.Router();

router.get("/:videoId/description", async (req, res) => {
  try {
    const desc = await fetchVideoDescription(req.params.videoId);
    res.json({ description: desc });
  } catch (err) {
    console.error("Video info error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
