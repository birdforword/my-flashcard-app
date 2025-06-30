// backend/src/controllers/deckController.js
import Deck from "../models/deckModel.js";
import Card from "../models/cardModel.js";

export async function listDecks(req, res) {
  try {
    const decks = await Deck.findAll({
      include: [
        {
          model: Card,
          attributes: ["id"], // カードの id だけ取る
        },
      ],
    });
    res.json(decks);
  } catch (err) {
    console.error("❌ デッキ一覧取得エラー:", err);
    res.status(500).json({ error: "デッキ一覧の取得に失敗しました" });
  }
}

export async function createDeck(req, res) {
  const { name } = req.body;
  try {
    // Check if a deck with the same name already exists
    let deck = await Deck.findOne({ where: { name } });
    if (deck) {
      // Return existing deck without creating a new one
      return res.status(200).json(deck);
    }

    deck = await Deck.create({ name });
    return res.status(201).json(deck);
  } catch (err) {
    console.error("Deck creation error:", err);
    return res.status(500).json({ error: "Failed to create deck" });
  }
}

export async function deleteDeck(req, res) {
  const { id } = req.params;
  await Deck.destroy({ where: { id } });
  res.status(204).end();
}
