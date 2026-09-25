require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const port = Number(process.env.PORT) || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    const server = app.listen(port, () =>
      console.log(`API disponível na porta ${port}`),
    );
    const shutdown = async () => {
      server.close(async () => {
        await sequelize.close();
        process.exit(0);
      });
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error(
      "Não foi possível conectar ao banco de dados:",
      error.message,
    );
    process.exit(1);
  }
}

if (require.main === module) start();

module.exports = { start };
