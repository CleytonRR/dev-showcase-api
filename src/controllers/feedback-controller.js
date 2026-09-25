const { Project } = require("../models");
const repository = require("../repositories/feedback-repository");
const { feedbackDto } = require("../dtos");

exports.create = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    if (!(await Project.findByPk(projectId)))
      return res.status(404).json({ error: "Projeto não encontrado" });
    const feedback = await repository.create({ ...req.body, projectId });
    res.status(201).json(feedbackDto(feedback));
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    if (!(await Project.findByPk(req.params.projectId)))
      return res.status(404).json({ error: "Projeto não encontrado" });
    res.json(
      (await repository.findByProject(req.params.projectId)).map(feedbackDto),
    );
  } catch (error) {
    next(error);
  }
};
