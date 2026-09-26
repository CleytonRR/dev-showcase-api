const { Project } = require("../models");
const repository = require("../repositories/feedback-repository");
const { feedbackDto } = require("../dtos");

exports.create = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    if (!(await Project.findByPk(projectId))) {
      const error = new Error("Projeto não encontrado");
      error.status = 404;
      return next(error);
    }
    const feedback = await repository.create({ ...req.body, projectId });
    res.status(201).json(feedbackDto(feedback));
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    if (!(await Project.findByPk(req.params.projectId))) {
      const error = new Error("Projeto não encontrado");
      error.status = 404;
      return next(error);
    }
    res.json(
      (await repository.findByProject(req.params.projectId)).map(feedbackDto),
    );
  } catch (error) {
    next(error);
  }
};

exports.createRated = async (req, res, next) => {
  try {
    const result = await repository.createRated(req.params.id, req.body);
    if (!result) {
      const error = new Error("Projeto não encontrado");
      error.status = 404;
      return next(error);
    }
    res.status(201).json({
      id: result.feedback.id,
      rating: result.feedback.rating,
      comment: result.feedback.comment,
      projectId: result.feedback.projectId,
      createdAt: result.feedback.createdAt,
      averageRating: result.averageRating,
      ratingCount: result.ratingCount,
    });
  } catch (error) {
    next(error);
  }
};

exports.listRated = async (req, res, next) => {
  try {
    if (!(await Project.findByPk(req.params.id))) {
      const error = new Error("Projeto não encontrado");
      error.status = 404;
      return next(error);
    }
    res.json(
      (await repository.findRatedByProject(req.params.id)).map(feedbackDto),
    );
  } catch (error) {
    next(error);
  }
};
