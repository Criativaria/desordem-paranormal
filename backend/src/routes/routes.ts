import { Router } from "express";
import { WikiController } from "../controller/get-wiki-controller.js";

export const appRoutes = Router();

appRoutes.get("/pages", (req, res) => WikiController.getPages(req, res));
appRoutes.get("/connections", WikiController.getConnections);
