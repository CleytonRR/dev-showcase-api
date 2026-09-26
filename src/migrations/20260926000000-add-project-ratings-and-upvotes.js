"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("projects", "likes", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("projects", "average_rating", {
      type: Sequelize.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("projects", "rating_count", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("feedback", "rating", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("feedback", "comment", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("feedback", "author", {
      type: Sequelize.STRING(120),
      allowNull: true,
    });
    await queryInterface.changeColumn("feedback", "content", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addConstraint("projects", {
      fields: ["likes"],
      type: "check",
      where: { likes: { [Sequelize.Op.gte]: 0 } },
      name: "projects_likes_nonnegative",
    });
    await queryInterface.addConstraint("projects", {
      fields: ["rating_count"],
      type: "check",
      where: { rating_count: { [Sequelize.Op.gte]: 0 } },
      name: "projects_rating_count_nonnegative",
    });
    await queryInterface.addConstraint("projects", {
      fields: ["average_rating"],
      type: "check",
      where: {
        average_rating: { [Sequelize.Op.gte]: 0, [Sequelize.Op.lte]: 5 },
      },
      name: "projects_average_rating_range",
    });
    await queryInterface.addConstraint("feedback", {
      fields: ["rating"],
      type: "check",
      where: Sequelize.literal(
        "rating IS NULL OR (rating >= 1 AND rating <= 5)",
      ),
      name: "feedback_rating_range",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint("feedback", "feedback_rating_range");
    await queryInterface.removeConstraint(
      "projects",
      "projects_average_rating_range",
    );
    await queryInterface.removeConstraint(
      "projects",
      "projects_rating_count_nonnegative",
    );
    await queryInterface.removeConstraint(
      "projects",
      "projects_likes_nonnegative",
    );
    await queryInterface.sequelize.query(
      "UPDATE feedback SET author = COALESCE(author, 'Anônimo'), content = COALESCE(content, comment, 'Avaliação')",
    );
    await queryInterface.changeColumn("feedback", "author", {
      type: require("sequelize").STRING(120),
      allowNull: false,
    });
    await queryInterface.changeColumn("feedback", "content", {
      type: require("sequelize").TEXT,
      allowNull: false,
    });
    await queryInterface.removeColumn("feedback", "comment");
    await queryInterface.removeColumn("feedback", "rating");
    await queryInterface.removeColumn("projects", "rating_count");
    await queryInterface.removeColumn("projects", "average_rating");
    await queryInterface.removeColumn("projects", "likes");
  },
};
