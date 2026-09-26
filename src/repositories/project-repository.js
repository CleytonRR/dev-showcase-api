const {
  sequelize,
  Project,
  Profile,
  Technology,
  Feedback,
} = require("../models");

module.exports = {
  create: async ({ technologyIds = [], ...values }) =>
    sequelize.transaction(async (transaction) => {
      const project = await Project.create(values, { transaction });
      if (technologyIds.length) {
        const technologies = await Technology.findAll({
          where: { id: technologyIds },
          transaction,
        });
        if (technologies.length !== new Set(technologyIds).size) {
          const error = new Error(
            "Uma ou mais tecnologias não foram encontradas",
          );
          error.status = 400;
          throw error;
        }
        await project.setTechnologies(technologies, { transaction });
      }
      return Project.findByPk(project.id, {
        include: [
          { model: Profile, as: "profile" },
          {
            model: Technology,
            as: "technologies",
            through: { attributes: [] },
          },
        ],
        transaction,
      });
    }),
  findAll: async ({ technologyId, page = 1, limit = 10 } = {}) => {
    const technologyFilter = technologyId
      ? [
          {
            model: Technology,
            as: "technologies",
            where: { id: technologyId },
            through: { attributes: [] },
            required: true,
          },
        ]
      : [];
    const total = await Project.count({
      distinct: true,
      col: "id",
      ...(technologyFilter.length ? { include: technologyFilter } : {}),
    });
    const projects = await Project.findAll({
      include: [
        { model: Profile, as: "profile" },
        {
          model: Technology,
          as: "technologies",
          ...(technologyId
            ? { where: { id: technologyId }, required: true }
            : {}),
          through: { attributes: [] },
        },
        {
          model: Feedback,
          as: "feedback",
          separate: true,
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });
    return { projects, total };
  },
  findById: (id) => Project.findByPk(id),
  incrementUpvote: async (id) =>
    sequelize.transaction(async (transaction) => {
      const project = await Project.findByPk(id, {
        transaction,
        lock: transaction.LOCK?.UPDATE,
      });
      if (!project) return null;
      await Project.increment("likes", { by: 1, where: { id }, transaction });
      return Project.findByPk(id, {
        transaction,
        include: [
          { model: Profile, as: "profile" },
          {
            model: Technology,
            as: "technologies",
            through: { attributes: [] },
          },
          { model: Feedback, as: "feedback", separate: true },
        ],
      });
    }),
};
