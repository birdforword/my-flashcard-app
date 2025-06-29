// backend/src/controllers/deckController.js
import Deck from '../models/deckModel.js';
import Card from '../models/cardModel.js';

export async function listDecks(req, res) {
  try {
    const decks = await Deck.findAll({
      include: [{
        model: Card,
        separate: true,
        order: [['timeSec', 'ASC']],
      }],
    });
    res.json(decks);
  } catch (err) {
    console.error('❌ デッキ一覧取得エラー:', err);
    res.status(500).json({ error: 'デッキ一覧の取得に失敗しました' });
  }
}

export async function createDeck(req, res) {
  const { name } = req.body;
  const deck = await Deck.create({ name });
  res.status(201).json(deck);
}

export async function deleteDeck(req, res) {
  const { id } = req.params;
  await Deck.destroy({ where: { id } });
  res.status(204).end();
}
