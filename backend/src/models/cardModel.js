// backend/src/models/cardModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Deck from './deckModel.js';

const Card = sequelize.define('Card', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  videoId:   { type: DataTypes.STRING, allowNull: false },
  timeSec:   { type: DataTypes.FLOAT,  allowNull: true  },
  frontText: { type: DataTypes.TEXT,   allowNull: false },
  backText:  { type: DataTypes.TEXT,   allowNull: false },
  thumbnail: { type: DataTypes.STRING, allowNull: true  },
  deckId:    { type: DataTypes.INTEGER,
    references: { model: Deck, key: 'id' },
    allowNull: false,
  },
}, {
  tableName: 'cards',
  timestamps: true,
});

export default Card;
