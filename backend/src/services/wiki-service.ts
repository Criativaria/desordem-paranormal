import { Page as wikiPage } from "wikijs";
import { WikiDataManipulationService } from "./wiki-data-manipulation-service";
import { WikiRepository } from "../repository/wiki-repository";

export interface Page {
  id: number;
  name: string;
  link: string;
  html: string;
  categories: string[];
  connections?: number[];
}

export interface Connection {
  originPage: number;
  targetPage: number;
}

export class WikiService {
  public static async getPages() {
    const pageRecords = await WikiDataManipulationService.getPages();

    if (!pageRecords) {
      throw new Error("deu erro no GetAllPages da service");
    }

    const allPagesObjects: Page[] = [];

    while (pageRecords.length > 0) {
      console.log("processing pages", pageRecords.length);
      const pageBatch = pageRecords.splice(0, 20);

      const pageBatchPromisse = pageBatch.map((page) => {
        return WikiService.formatPage(page[1]);
      });

      const formatedPages = await Promise.all(pageBatchPromisse);

      const filteredPages = formatedPages.filter((page) => !!page);

      await WikiRepository.updatePage(filteredPages);

      allPagesObjects.push(...filteredPages);
    }

    return allPagesObjects;
  }

  private static async formatPage(page: wikiPage) {
    try {
      const [html, categories] = await Promise.all([
        page.html(),
        page.categories(),
      ]);

      const pageObj: Page = {
        id: page.raw.pageid,
        name: page.raw.title,
        link: page.raw.fullurl,
        categories,
        html,
      };

      return pageObj;
    } catch (error) {
      console.log("erro no formatPage: ", error);
    }
  }

  public static async updatePageConnections() {
    const allPages = await this.getPages();

    console.log("processing connections", allPages.length);

    for (const page of allPages) {
      const getPageConnections = await WikiDataManipulationService.getPageLinks(
        page.html
      );

      const connections: Connection[] = [];

      for (const entrie of getPageConnections) {
        const connection = allPages.find((page) => {
          return page.name == entrie[1];
        });

        if (!connection) {
          continue;
        }
        connections.push({
          originPage: Math.max(page.id, connection.id),
          targetPage: Math.min(page.id, connection.id),
        });
      }
      await WikiRepository.updateConnection(connections);
    }
    console.log("processei tudo");
  }

  public static async getWikiPages() {
    const pages = await WikiRepository.getPages();
    return pages;
  }

  public static async getWikiConnections() {
    const connection = await WikiRepository.getConnections();
    return connection;
  }

  public static async getFilteredPages(search: string) {
    const pages = await WikiRepository.getFilteredPages(search);
    return pages;
  }
}
