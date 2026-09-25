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
  findAll: () =>
    Project.findAll({
      include: [
        { model: Profile, as: "profile" },
        { model: Technology, as: "technologies", through: { attributes: [] } },
        { model: Feedback, as: "feedback" },
      ],
      order: [["createdAt", "DESC"]],
    }),
  findById: (id) => Project.findByPk(id),
};
