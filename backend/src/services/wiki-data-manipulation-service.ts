import * as cheerio from "cheerio";
import { WikiOp } from "../api/wiki-op";
import type { Page } from "wikijs";

export class WikiDataManipulationService {
  public static async getPages() {
    const pageNames = await WikiOp.getPageNames();

    const allPagesRecord: Record<number, Page> = {};

    if (!pageNames) {
      return console.log("não tem pageNames");
    }

    const allPages = pageNames.map((name: string) => WikiOp.getPage(name));
    const promisseAllPages = await Promise.all(allPages);

    for (const pages of promisseAllPages) {
      if (!pages) {
        continue;
      }

      allPagesRecord[pages.raw.pageid] = pages;
    }
    return Object.entries(allPagesRecord);
  }

  public static async getPageLinks(htmlPage: string) {
    const cheerioPage = cheerio.load(htmlPage ?? "");
    const links = cheerioPage("a").toArray();
    const allPagesRecord: Record<string, string> = {};

    for (const element of links) {
      const attr = element.attribs;
      if (
        !attr.href?.startsWith("/") ||
        attr.href.startsWith("/wiki/Arquivo:")
      ) {
        continue;
      }
      allPagesRecord[attr.href] = attr.title!;
    }

    return Object.entries(allPagesRecord);
  }
}
