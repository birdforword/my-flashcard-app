import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Deck = sequelize.define(
  "Deck",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "decks",
    timestamps: true,
  },
);

export default Deck;
