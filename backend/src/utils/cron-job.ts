import { CronJob } from "cron";
import { WikiService } from "../services/wiki-service";

new CronJob(
  "0 0 * * *",
  function () {
    WikiService.updatePageConnections();
  },
  null,
  true,
  undefined,
  undefined
);
