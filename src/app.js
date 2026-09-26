require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const errorHandler = require("./middlewares/error-handler");
const swaggerUi = require("swagger-ui-express");
const openapi = require("./docs/openapi");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/api-docs.json", (_req, res) => res.json(openapi));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.use("/api", routes);
app.use((_req, _res, next) => {
  const error = new Error("Rota não encontrada");
  error.status = 404;
  next(error);
});
app.use(errorHandler);

module.exports = app;
