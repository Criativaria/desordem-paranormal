import express from "express";
import { appRoutes } from "./src/routes/routes.js";
import "./src/utils/cron-job.js";
import cors from "cors";

async function main() {
  const app = express();
  const port = process.env.ENV_PORT;

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(appRoutes);

  app.use((req, res, next) => {
    const headers = req.headers["x-api-key"];
    console.log(headers);
  });

  app.listen(port, () => {
    console.log(`a porta ${port} ta abrida !`);
  });
}
main();
