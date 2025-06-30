// backend/src/services/cardService.js

import Card from "../models/cardModel.js"; // ← モデルをインポート

/**
 * 新しいカードを追加
 * @param {{ videoId:string, timeSec:number|null, frontText:string, backText:string, thumbnail:string|null }} data
 * @returns {Promise<Card>}
 */
export async function addCard(data) {
  return await Card.create(data);
}

/**
 * すべてのカードを取得
 * @returns {Promise<Card[]>}
 */
export async function getAllCards(where = {}) {
  return await Card.findAll({ where, order: [["timeSec", "ASC"]] });
}

export async function deleteCard(id) {
  return await Card.destroy({ where: { id } });
}

export async function deleteCardsByDeck(deckId) {
  return await Card.destroy({ where: { deckId } });
}
