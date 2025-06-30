import { Router } from "express";
import { createCard, listCards, deleteCard } from "../controllers/cardController.js";

const router = Router();
router.post("/", createCard);
router.get("/", listCards);
router.delete("/:id", deleteCard);

export default router;
