// backend/src/services/cardService.js

import Card from "../models/cardModel.js"; // ← モデルをインポート
import Deck from "../models/deckModel.js";

/**
 * 新しいカードを追加
 * @param {{ videoId:string, startSec:number|null, endSec:number|null, frontText:string, backText:string, thumbnail:string|null }} data
 * @returns {Promise<Card>}
 */
export async function addCard(data) {
  const deck = await Deck.findByPk(data.deckId);
  if (!deck) {
    throw new Error("Deck not found");
  }
  return await Card.create(data);
}

/**
 * すべてのカードを取得
 * @returns {Promise<Card[]>}
 */
export async function getAllCards(where = {}) {
  return await Card.findAll({ where, order: [["startSec", "ASC"]] });
}

/**
 * 単一カードを削除
 * @param {number|string} id
 */
export async function deleteCard(id) {
  return await Card.destroy({ where: { id } });
}

/**
 * デッキ内のカードを一括削除
 * @param {number|string} deckId
 */
export async function deleteCardsByDeck(deckId) {
  return await Card.destroy({ where: { deckId } });
}

/**
 * 指定デッキのカードを取得
 * @param {number|string} deckId
 * @returns {Promise<Card[]>}
 */
export async function getCardsByDeck(deckId) {
  return await Card.findAll({ where: { deckId } });
}

