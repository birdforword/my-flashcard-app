// backend/src/controllers/cardController.js
import * as cardService from "../services/cardService.js";

/**
 * Handle POST /api/cards
 * Create a new flashcard
 */
export async function createCard(req, res) {
  try {
    const { videoId, timeSec, frontText, backText, thumbnail } = req.body;
    const card = await cardService.addCard({
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
    const cards = await cardService.getAllCards();
    return res.status(200).json(cards);
  } catch (error) {
    console.error("List cards error:", error);
    return res.status(500).json({ error: "Failed to retrieve cards" });
  }
}
