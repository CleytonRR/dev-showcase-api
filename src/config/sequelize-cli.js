require("dotenv").config();
const postgresOptions = require("./postgres-options");

module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: postgresOptions(),
  },
  test: { dialect: "sqlite", storage: ":memory:" },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: postgresOptions(),
  },
};
