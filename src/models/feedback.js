const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "Feedback",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    author: {
      type: DataTypes.STRING(120),
      allowNull: true,
      validate: { notEmpty: true },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { notEmpty: true },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1, max: 5, isInt: true },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { notEmpty: true },
    },
  },
  { tableName: "feedback", underscored: true },
);
