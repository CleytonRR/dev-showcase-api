const { Op } = require("sequelize");
const { sequelize, Feedback, Project } = require("../models");

module.exports = {
  create: (values) => Feedback.create(values),
  findByProject: (projectId) =>
    Feedback.findAll({ where: { projectId }, order: [["createdAt", "DESC"]] }),
  findRatedByProject: (projectId) =>
    Feedback.findAll({
      where: { projectId, rating: { [Op.not]: null } },
      order: [["createdAt", "DESC"]],
    }),
  createRated: async (projectId, { rating, comment }) =>
    sequelize.transaction(async (transaction) => {
      const project = await Project.findByPk(projectId, {
        transaction,
        lock: transaction.LOCK?.UPDATE,
      });
      if (!project) return null;

      const feedback = await Feedback.create(
        { projectId, rating, comment },
        { transaction },
      );
      const aggregate = await Feedback.findOne({
        attributes: [
          [sequelize.fn("AVG", sequelize.col("rating")), "averageRating"],
          [sequelize.fn("COUNT", sequelize.col("rating")), "ratingCount"],
        ],
        where: { projectId, rating: { [Op.not]: null } },
        raw: true,
        transaction,
      });
      const averageRating =
        Math.round(Number(aggregate.averageRating) * 100) / 100;
      const ratingCount = Number(aggregate.ratingCount);
      await project.update({ averageRating, ratingCount }, { transaction });
      return { feedback, averageRating, ratingCount };
    }),
};
