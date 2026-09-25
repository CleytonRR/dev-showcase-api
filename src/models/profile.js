const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "Profile",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING(254),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    bio: { type: DataTypes.TEXT, allowNull: true },
    avatarUrl: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      field: "avatar_url",
      validate: { isUrl: true },
    },
  },
  { tableName: "profiles", underscored: true },
);
