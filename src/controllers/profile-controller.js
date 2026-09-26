const repository = require("../repositories/profile-repository");
const { profileDto } = require("../dtos");

exports.create = async (req, res, next) => {
  try {
    const profile = await repository.create(req.body);
    res.status(201).json(profileDto(profile));
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const profile = await repository.findById(req.params.id);
    if (!profile) {
      const error = new Error("Perfil não encontrado");
      error.status = 404;
      return next(error);
    }
    res.json(profileDto(profile));
  } catch (error) {
    next(error);
  }
};
