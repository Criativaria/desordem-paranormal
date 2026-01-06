import express from "express";
import { appRoutes } from "./src/routes/routes.js";
import "./src/utils/cron-job.js";

async function main() {
  const app = express();
  const port = process.env.ENV_PORT;
  const cors = require("cors");

  const corsOptions = {
    origin: "*",
    methods: "GET",
    preflightContinue: false,
    optionSuccessStatus: 204,
  };

  app.use(express.json());
  app.use(appRoutes);
  app.use(cors(corsOptions));

  app.listen(port, () => {
    console.log(`a porta ${port} ta abrida !`);
  });
}
main();
