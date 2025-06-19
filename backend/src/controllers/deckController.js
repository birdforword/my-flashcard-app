// backend/src/controllers/deckController.js
import Deck from '../models/deckModel.js';
import Card from '../models/cardModel.js';

export async function listDecks(req, res) {
  const decks = await Deck.findAll({
    include: [{ model: Card, attributes: ['id'] }],
  });
  res.json(decks);
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
