const repository = require("../repositories/technology-repository");
const { technologyDto } = require("../dtos");

exports.create = async (req, res, next) => {
  try {
    const technology = await repository.create(req.body);
    res.status(201).json(technologyDto(technology));
  } catch (error) {
    next(error);
  }
};

exports.list = async (_req, res, next) => {
  try {
    res.json((await repository.findAll()).map(technologyDto));
  } catch (error) {
    next(error);
  }
};
