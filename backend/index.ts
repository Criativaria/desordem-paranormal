import express from "express";
import { appRoutes } from "./src/routes/routes.js";
import "./src/utils/cron-job.js";

async function main() {
  const app = express();
  const port = process.env.ENV_PORT;
  const cors = require("cors");

  const corsOptions = {
    origin: "http://localhost:5173/",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    preflightContinue: false,
    optionSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(express.json());
  app.use(appRoutes);
  app.use(cors(corsOptions));
  app.use((req, res) => {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PUT, PATCH, POST, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  });

  app.listen(port, () => {
    console.log(`a porta ${port} ta abrida !`);
  });
}
main();
