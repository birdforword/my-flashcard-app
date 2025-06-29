// backend/src/routes/deckRoutes.js
import express from "express";
import {
  listDecks,
  createDeck,
  deleteDeck,
} from "../controllers/deckController.js";

const router = express.Router();

router.get("/", listDecks); // GET /api/decks
router.post("/", createDeck); // POST /api/decks
router.delete("/:id", deleteDeck); // DELETE /api/decks/:id

export default router;
