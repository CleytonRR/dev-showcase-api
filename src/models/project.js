const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "Project",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: DataTypes.STRING(160),
      allowNull: false,
      validate: { notEmpty: true },
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      validate: { isUrl: true },
    },
  },
  { tableName: "projects", underscored: true },
);
