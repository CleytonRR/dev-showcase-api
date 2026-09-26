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

exports.list = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const { projects, total } = await repository.findAll({
      technologyId: req.query.technologyId,
      page,
      limit,
    });
    res.json({
      data: projects.map(projectDto),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.upvote = async (req, res, next) => {
  try {
    const project = await repository.incrementUpvote(req.params.id);
    if (!project) {
      const error = new Error("Projeto não encontrado");
      error.status = 404;
      return next(error);
    }
    res.json(projectDto(project));
  } catch (error) {
    next(error);
  }
};
