import { Router, type Response } from "express";
import { WikiController } from "../controller/get-wiki-controller.js";

export const appRoutes = Router();

appRoutes.get("/pages", WikiController.GetPages);
appRoutes.get("/connections", WikiController.GetConnections);
