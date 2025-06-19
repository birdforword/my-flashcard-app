// backend/src/models/deckModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Card from './cardModel.js';

const Deck = sequelize.define('Deck', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'decks',
  timestamps: true,
});

// Card モデルに外部キーを紐付け
Card.belongsTo(Deck, { foreignKey: 'deckId', onDelete: 'CASCADE' });
Deck.hasMany(Card, { foreignKey: 'deckId' });

export default Deck;
