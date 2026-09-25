const { Technology } = require("../models");

module.exports = {
  create: (values) => Technology.create(values),
  findAll: () => Technology.findAll({ order: [["name", "ASC"]] }),
};
