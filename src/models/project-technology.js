const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "ProjectTechnology",
  {
    projectId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "project_id",
    },
    technologyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "technology_id",
    },
  },
  { tableName: "project_technologies", underscored: true },
);
