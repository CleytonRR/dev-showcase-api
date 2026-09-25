require("dotenv").config();

module.exports = {
  development: { use_env_variable: "DATABASE_URL", dialect: "postgres" },
  test: { dialect: "sqlite", storage: ":memory:" },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions:
      process.env.DATABASE_SSL === "true"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
  },
};
