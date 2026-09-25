require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const errorHandler = require("./middlewares/error-handler");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", routes);
app.use((_req, res) => res.status(404).json({ error: "Rota não encontrada" }));
app.use(errorHandler);

module.exports = app;
