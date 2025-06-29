// backend/src/services/cardService.js

import Card from '../models/cardModel.js';  // ← モデルをインポート

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
export async function getAllCards() {
  return await Card.findAll();
}

/**
 * 指定デッキのカードを取得
 * @param {number|string} deckId
 * @returns {Promise<Card[]>}
 */
export async function getCardsByDeck(deckId) {
  return await Card.findAll({ where: { deckId } });
}

/**
 * 単一カードを削除
 * @param {number|string} id
 */
export async function deleteCard(id) {
  await Card.destroy({ where: { id } });
}

/**
 * デッキ内のカードを一括削除
 * @param {number|string} deckId
 */
export async function deleteCardsByDeck(deckId) {
  await Card.destroy({ where: { deckId } });
}

