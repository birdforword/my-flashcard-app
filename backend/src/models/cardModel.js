import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Card = sequelize.define(
  "Card",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    videoId: DataTypes.STRING,
    startSec: DataTypes.FLOAT,
    endSec: DataTypes.FLOAT,
    frontText: DataTypes.TEXT,
    backText: DataTypes.TEXT,
    thumbnail: DataTypes.STRING,
    hash: { type: DataTypes.STRING, allowNull: false, unique: true },
    deckId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "cards",
    timestamps: true,
  },
);

export default Card;
