module.exports = (error, _req, res, _next) => {
  let status = error.status || error.statusCode || 500;
  let code = error.code || "INTERNAL_SERVER_ERROR";
  let message = error.message;
  let details = error.details;

  if (
    error.type === "entity.parse.failed" ||
    (error instanceof SyntaxError && error.status === 400)
  ) {
    status = 400;
    code = "MALFORMED_JSON";
    message = "O corpo da requisição contém JSON inválido";
  }
  if (error.name === "SequelizeUniqueConstraintError") {
    status = 409;
    code = "DUPLICATE_RESOURCE";
    message = "Já existe um registro com esses dados";
  }
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeForeignKeyConstraintError"
  ) {
    status = 400;
    code = "INVALID_DATA";
    message = "Os dados informados são inválidos";
    details = error.errors?.map(({ path, message: reason }) => ({
      field: path,
      message: reason,
    }));
  }
  if (status >= 500) {
    console.error(error);
    code = "INTERNAL_SERVER_ERROR";
    message = "Erro interno do servidor";
    details = undefined;
  }
  if (status === 404 && !error.code) code = "NOT_FOUND";
  return res.status(status).json({
    error: {
      status,
      code,
      message: status >= 500 ? "Erro interno do servidor" : message,
      ...(details ? { details } : {}),
    },
  });
};
