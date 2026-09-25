const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "Feedback",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    author: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: { notEmpty: true },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  { tableName: "feedback", underscored: true },
);
