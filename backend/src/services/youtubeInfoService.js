// backend/src/services/youtubeInfoService.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const KEY = process.env.YOUTUBE_API_KEY;
if (!KEY) throw new Error('YOUTUBE_API_KEY is not set');

export async function fetchVideoDescription(videoId) {
  const url = 'https://www.googleapis.com/youtube/v3/videos';
  const res = await axios.get(url, {
    params: {
      part: 'snippet',
      id: videoId,
      key: KEY,
    }
  });
  const items = res.data.items || [];
  if (!items.length) throw new Error('Video not found');
  return items[0].snippet.description;
}
