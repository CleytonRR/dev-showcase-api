const { Sequelize } = require("sequelize");

const options =
  process.env.NODE_ENV === "test"
    ? { dialect: "sqlite", storage: ":memory:", logging: false }
    : {
        dialect: "postgres",
        logging: process.env.NODE_ENV === "development" ? console.log : false,
        ...(process.env.DATABASE_SSL === "true"
          ? {
              dialectOptions: {
                ssl: { require: true, rejectUnauthorized: false },
              },
            }
          : {}),
      };

const sequelize =
  process.env.NODE_ENV === "test"
    ? new Sequelize(options)
    : new Sequelize(process.env.DATABASE_URL, options);

module.exports = sequelize;
