import type { Request, Response } from "express";
import { WikiService } from "../services/wiki-service";

export class WikiController {
  public static async getPages(req: Request, res: Response) {
    const filteredPages = req.query.name;

    let pages;

    if (filteredPages) {
      pages = await WikiService.getFilteredPages(filteredPages.toString());
      return res.json(pages);
    }

    pages = await WikiService.getWikiPages();

    return res.json(pages);
  }
  public static async getConnections(req: Request, res: Response) {
    const connections = await WikiService.getWikiConnections();
    res.json(connections);
  }
}
