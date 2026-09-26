const { body, param, query, validationResult } = require("express-validator");

const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Um ou mais campos são inválidos");
      error.status = 400;
      error.code = "VALIDATION_ERROR";
      error.details = errors.array();
      return next(error);
    }
    next();
  },
];

const profileInput = validate([
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ max: 120 }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email é obrigatório")
    .isEmail()
    .normalizeEmail(),
  body("bio").optional({ nullable: true }).isString(),
  body("avatarUrl")
    .optional({ nullable: true })
    .isURL()
    .withMessage("avatarUrl deve ser uma URL válida"),
]);

const technologyInput = validate([
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ max: 80 }),
  body("category").optional({ nullable: true }).isString().trim(),
]);

const projectInput = validate([
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Título é obrigatório")
    .isLength({ max: 160 }),
  body("description").optional({ nullable: true }).isString(),
  body("url")
    .optional({ nullable: true })
    .isURL()
    .withMessage("url deve ser uma URL válida"),
  body("profileId")
    .isInt({ min: 1 })
    .withMessage("profileId deve ser um inteiro positivo")
    .toInt(),
  body("technologyIds")
    .optional()
    .isArray()
    .withMessage("technologyIds deve ser uma lista"),
  body("technologyIds.*").optional().isInt({ min: 1 }).toInt(),
]);

const feedbackInput = validate([
  body("author")
    .trim()
    .notEmpty()
    .withMessage("Autor é obrigatório")
    .isLength({ max: 120 }),
  body("content").trim().notEmpty().withMessage("Conteúdo é obrigatório"),
]);

const idParam = validate([
  param("id").isInt({ min: 1 }).withMessage("id inválido").toInt(),
]);
const projectIdParam = validate([
  param("projectId")
    .isInt({ min: 1 })
    .withMessage("projectId inválido")
    .toInt(),
]);

const ratedFeedbackInput = validate([
  body("rating")
    .custom(
      (value) =>
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 1 &&
        value <= 5,
    )
    .withMessage("rating deve ser um inteiro entre 1 e 5"),
  body("comment").trim().notEmpty().withMessage("Comentário é obrigatório"),
]);

const projectListQuery = validate([
  query("technologyId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("technologyId deve ser um inteiro positivo")
    .toInt(),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page deve ser um inteiro positivo")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit deve ser um inteiro entre 1 e 100")
    .toInt(),
]);

module.exports = {
  profileInput,
  technologyInput,
  projectInput,
  feedbackInput,
  idParam,
  projectIdParam,
  ratedFeedbackInput,
  projectListQuery,
};
