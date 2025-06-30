// backend/src/routes/export.js
import express from "express";
import AnkiExportPkg from "anki-apkg-export";
const AnkiExport = AnkiExportPkg.default; // CommonJS の default export を受け取る

import Card from "../models/cardModel.js";
import Deck from "../models/deckModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const deckId = req.query.deckId ? parseInt(req.query.deckId, 10) : null;
    const where = deckId ? { deckId } : {};
  const cards = await Card.findAll({ where, order: [["startSec", "ASC"]] });
    let deckName = "Video Flashcards Deck";
    if (deckId) {
      const deck = await Deck.findByPk(deckId);
      if (!deck) {
        return res.status(404).json({ error: "Deck not found" });
      }
      deckName = deck.name;
    }

    // Deck を作成（第一引数はファイル名になり、スペースは大丈夫）
    const apkg = new AnkiExport(deckName, {
      fields: ["Start", "End"],
    });

    // 各カードを追加
    cards.forEach((c) => {
      apkg.addCard(
        c.frontText,
        c.backText,
        // オプションでタグやメディアを渡せます
        // { tags: ['video'], media: [ /* Buffer やファイルパス */ ] }
      );
    });

    // .save() が Buffer を返すので、そのまま送信
    const buffer = await apkg.save();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(deckName)}.apkg"`,
    );
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(buffer);
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: "Failed to export deck" });
  }
});

export default router;
