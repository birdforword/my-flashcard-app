import { Router } from "express";
import { createCard, listCards } from "../controllers/cardController.js";

const router = Router();
router.post("/", createCard);
router.get("/", listCards);

export default router;
