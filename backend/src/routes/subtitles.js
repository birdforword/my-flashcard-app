import express from 'express';
import multer from 'multer';
import SrtParser from 'srt-parser-2';
import vttToJson from 'vtt-to-json';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/subtitles/upload
// フロントから .srt か .vtt ファイルを multipart/form-data で受け取る
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const buf = req.file.buffer;
    let captions = [];

    if (req.file.originalname.endsWith('.srt')) {
      const parser = new SrtParser();
      const srt = buf.toString('utf8');
      captions = parser.fromSrt(srt).map(item => ({
        offset:   item.startTime.split(':').reduce((acc,v,i) => acc + parseFloat(v) * (i===0?3600:i===1?60:1), 0),
        duration: item.endTime.split(':').reduce((acc,v,i) => acc + parseFloat(v) * (i===0?3600:i===1?60:1), 0)
                  - item.startTime.split(':').reduce((acc,v,i) => acc + parseFloat(v) * (i===0?3600:i===1?60:1), 0),
        text:     item.text.replace(/\r\n|\n/g, ' ').trim(),
      }));
    } else if (req.file.originalname.endsWith('.vtt')) {
      const vtt = buf.toString('utf8');
      const json = await vttToJson(vtt);
      captions = json.map(item => ({
        offset:   item.startTime / 1000,
        duration: (item.endTime - item.startTime) / 1000,
        text:     item.text.replace(/\r\n|\n/g, ' ').trim(),
      }));
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    return res.json(captions);
  } catch (err) {
    console.error('Subtitle upload error:', err);
    return res.status(500).json({ error: 'Failed to parse subtitles' });
  }
});

export default router;
