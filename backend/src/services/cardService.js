// backend/src/services/cardService.js

import Card from "../models/cardModel.js"; // ← モデルをインポート
import Deck from "../models/deckModel.js";
import crypto from "crypto";

/**
 * 新しいカードを追加
<<<<<<< ours
 * @param {{ videoId:string, timeSec:number|null, endSec:number|null, frontText:string, backText:string, thumbnail:string|null }} data
=======
 * @param {{ videoId:string, startSec:number|null, endSec:number|null, frontText:string, backText:string, thumbnail:string|null }} data
>>>>>>> theirs
 * @returns {Promise<Card>}
 */
export async function addCard(data) {
  const deck = await Deck.findByPk(data.deckId);
  if (!deck) {
    throw new Error("Deck not found");
  }
  const hash = crypto
    .createHash("sha256")
    .update(`${Date.now()}-${data.deckId}-${Math.random()}`)
    .digest("hex");
  return await Card.create({ ...data, hash });
}

/**
 * すべてのカードを取得
 * @returns {Promise<Card[]>}
 */
export async function getAllCards(where = {}) {
  return await Card.findAll({ where, order: [["startSec", "ASC"]] });
}

export async function deleteCard(id) {
  return await Card.destroy({ where: { id } });
}

export async function deleteCardsByDeck(deckId) {
  return await Card.destroy({ where: { deckId } });
}
