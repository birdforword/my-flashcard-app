// backend/src/routes/export.js
import express from 'express';
import AnkiExportPkg from 'anki-apkg-export'; 
const AnkiExport = AnkiExportPkg.default;  // CommonJS の default export を受け取る

import Card from '../models/cardModel.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const cards = await Card.findAll();

    // Deck を作成（第一引数はファイル名になり、スペースは大丈夫）
    const apkg = new AnkiExport('Video Flashcards Deck');

    // 各カードを追加
    cards.forEach(c => {
      apkg.addCard(
        c.frontText,
        c.backText,
        // オプションでタグやメディアを渡せます
        // { tags: ['video'], media: [ /* Buffer やファイルパス */ ] }
      );
    });

    // .save() が Buffer を返すので、そのまま送信
    const buffer = await apkg.save();  // :contentReference[oaicite:0]{index=0}

    res.setHeader('Content-Disposition', 'attachment; filename="video_deck.apkg"');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: 'Failed to export deck' });
  }
});

export default router;
