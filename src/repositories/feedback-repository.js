const { Feedback } = require("../models");

module.exports = {
  create: (values) => Feedback.create(values),
  findByProject: (projectId) =>
    Feedback.findAll({ where: { projectId }, order: [["createdAt", "DESC"]] }),
};
