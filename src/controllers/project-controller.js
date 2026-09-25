const repository = require("../repositories/project-repository");
const { projectDto } = require("../dtos");

exports.create = async (req, res, next) => {
  try {
    const project = await repository.create(req.body);
    res.status(201).json(projectDto(project));
  } catch (error) {
    next(error);
  }
};

exports.list = async (_req, res, next) => {
  try {
    res.json((await repository.findAll()).map(projectDto));
  } catch (error) {
    next(error);
  }
};
