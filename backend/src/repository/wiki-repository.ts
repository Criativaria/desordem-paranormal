import { arrayContains, cosineDistance, desc, ilike, sql } from "drizzle-orm";
import { connection, page } from "../database/schemas";
import { Connection, Page } from "../services/wiki-service";
import { db } from "../database";
import * as stringSimilarity from "string-similarity";
import { normalize } from "path";
export class WikiRepository {
  public static async getPages() {
    const pages = await db
      .select({
        id: page.id,
        name: page.name,
        link: page.link,
        categories: page.categories,
      })
      .from(page);

    return pages;
  }
  public static async getConnections() {
    const connections = await db.select().from(connection);

    return connections;
  }

  public static async updatePage(Pages: Page[]) {
    await db
      .insert(page)
      .values(Pages)
      .onConflictDoUpdate({
        target: page.id,
        set: {
          name: sql`excluded.name`,
          link: sql`excluded.link`,
          categories: sql`excluded.categories`,
        },
      });
  }

  public static async updateConnection(Connections: Connection[]) {
    await db
      .insert(connection)
      .values(Connections)
      .onConflictDoNothing({
        target: [connection.targetPage, connection.originPage],
      });
  }

  public static async getFilteredPages(search: string) {
    const normalizedSearch = normalize(search);

    const pages = await db
      .select({
        id: page.id,
        name: page.name,
        link: page.link,
        categories: page.categories,
      })
      .from(page)
      .where(ilike(page.name, `%${search[0]}%`));

    const result = pages
      .map((page) => ({
        ...page,
        score: stringSimilarity.compareTwoStrings(
          normalize(page.name),
          normalizedSearch
        ),
      }))
      .filter((p) => p.score > 0.4)
      .sort((a, b) => b.score - a.score);

    return result;
  }
}
