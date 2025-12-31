import express from "express";
import "dotenv/config";
import { appRoutes } from "./src/routes/routes.js";
import "./src/utils/cron-job.js";
import { WikiOp } from "./src/api/wiki-op.js";

async function main() {
  const app = express();
  const port = process.env.ENV_PORT;

  app.use(express.json());
  app.use(appRoutes);

  app.listen(port, () => {
    console.log(`a porta ${port} ta abrida !`);
  });
}
main();
