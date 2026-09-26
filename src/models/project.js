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
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    averageRating: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: 0,
      field: "average_rating",
      validate: { min: 0, max: 5 },
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "rating_count",
      validate: { min: 0 },
    },
  },
  { tableName: "projects", underscored: true },
);
