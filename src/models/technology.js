const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "Technology",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    category: { type: DataTypes.STRING(80), allowNull: true },
  },
  { tableName: "technologies", underscored: true },
);
