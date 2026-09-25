module.exports = (error, _req, res, _next) => {
  if (error.name === "SequelizeUniqueConstraintError") {
    return res
      .status(409)
      .json({ error: "Já existe um registro com esses dados" });
  }
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeForeignKeyConstraintError"
  ) {
    return res.status(400).json({ error: "Dados inválidos" });
  }
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  return res
    .status(status)
    .json({
      error: status >= 500 ? "Erro interno do servidor" : error.message,
    });
};
