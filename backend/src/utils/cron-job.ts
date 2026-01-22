import { CronJob } from "cron";
import { WikiService } from "../services/wiki-service";

export const job = new CronJob(
  "0 0 * * *",
  async function () {
    console.log("Iniciando cronjob de conexões...");
    try {
      await WikiService.updatePageConnections();
      console.log("Cronjob finalizado com sucesso.");
    } catch (error) {
      console.error("Erro no cronjob:", error);
    }
  },
  null,
  true,
  undefined,
  undefined,
);
