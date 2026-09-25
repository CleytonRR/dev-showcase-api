const sequelize = require("../config/database");
const Profile = require("./profile");
const Project = require("./project");
const Technology = require("./technology");
const Feedback = require("./feedback");
const ProjectTechnology = require("./project-technology");

Profile.hasMany(Project, {
  as: "projects",
  foreignKey: { name: "profileId", allowNull: false },
  onDelete: "CASCADE",
});
Project.belongsTo(Profile, {
  as: "profile",
  foreignKey: { name: "profileId", allowNull: false },
});
Project.belongsToMany(Technology, {
  as: "technologies",
  through: ProjectTechnology,
  foreignKey: "projectId",
  otherKey: "technologyId",
});
Technology.belongsToMany(Project, {
  as: "projects",
  through: ProjectTechnology,
  foreignKey: "technologyId",
  otherKey: "projectId",
});
Project.hasMany(Feedback, {
  as: "feedback",
  foreignKey: { name: "projectId", allowNull: false },
  onDelete: "CASCADE",
});
Feedback.belongsTo(Project, {
  as: "project",
  foreignKey: { name: "projectId", allowNull: false },
});

module.exports = {
  sequelize,
  Profile,
  Project,
  Technology,
  Feedback,
  ProjectTechnology,
};
