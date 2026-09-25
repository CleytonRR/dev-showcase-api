const { Profile, Project, Technology, Feedback } = require("../models");

module.exports = {
  create: (values) => Profile.create(values),
  findById: (id) =>
    Profile.findByPk(id, {
      include: [
        {
          model: Project,
          as: "projects",
          include: [
            {
              model: Technology,
              as: "technologies",
              through: { attributes: [] },
            },
            { model: Feedback, as: "feedback" },
          ],
        },
      ],
    }),
};
