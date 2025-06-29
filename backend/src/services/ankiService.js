// backend/src/services/cardService.js
import Card from "../models/cardModel.js";

export async function addCard(data) {
  // data: { videoId, timeSec, frontText, backText, thumbnail }
  const card = await Card.create(data);
  return card;
}

export async function getAllCards() {
  return await Card.findAll();
}
