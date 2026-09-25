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
    if (!profile)
      return res.status(404).json({ error: "Perfil não encontrado" });
    res.json(profileDto(profile));
  } catch (error) {
    next(error);
  }
};
