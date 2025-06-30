// backend/src/controllers/cardController.js
import * as cardService from "../services/cardService.js";

/**
 * Handle POST /api/cards
 * Create a new flashcard
 */
export async function createCard(req, res) {
  try {
    const { deckId, videoId, timeSec, frontText, backText, thumbnail } = req.body;
    const card = await cardService.addCard({
      deckId,
      videoId,
      timeSec,
      frontText,
      backText,
      thumbnail,
    });
    return res.status(201).json(card);
  } catch (error) {
    console.error("Card creation error:", error);
    return res.status(500).json({ error: "Failed to create card" });
  }
}

/**
 * Handle GET /api/cards
 * Retrieve all flashcards
 */
export async function listCards(req, res) {
  try {
    const where = req.query.deckId ? { deckId: req.query.deckId } : {};
    const cards = await cardService.getAllCards(where);
    return res.status(200).json(cards);
  } catch (error) {
    console.error("List cards error:", error);
    return res.status(500).json({ error: "Failed to retrieve cards" });
  }
}

export async function deleteCard(req, res) {
  try {
    const { id } = req.params;
    await cardService.deleteCard(id);
    return res.status(204).end();
  } catch (error) {
    console.error("Delete card error:", error);
    return res.status(500).json({ error: "Failed to delete card" });
  }
}
