import express from "express";
import { appRoutes } from "./src/routes/routes.js";
import "./src/utils/cron-job.js";
import cors from "cors";

async function main() {
  const app = express();
  const port = process.env.ENV_PORT;

  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Private-Network", "true");
    res.setHeader("Access-Control-Max-Age", 7200);

    next();
  });

  app.use(express.json());

  app.use(appRoutes);

  app.listen(port, () => {
    console.log(`a porta ${port} ta abrida !`);
  });
}
main();
