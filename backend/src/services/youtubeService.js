// backend/src/services/youtubeService.js
import { getSubtitles } from 'youtube-captions-scraper';

/**
 * youtube-captions-scraper で字幕を取得
 * @param {string} videoId
 * @param {string} lang    // 言語コード (例: 'en', 'ja')
 * @returns {Promise<{ start: number; dur: number; text: string }[]>}
 */
export async function fetchCaptions(videoId, lang = 'en') {
  try {
    // getSubtitles は [{ start, dur, text }, …] を返します
    const list = await getSubtitles({ videoID: videoId, lang });
    // フォーマット変換
    return list.map(item => ({
      offset:   item.start,
      duration: item.dur,
      text:     item.text.trim(),
    }));
  } catch (err) {
    console.error('Caption fetch error:', err);
    return [];
  }
}
