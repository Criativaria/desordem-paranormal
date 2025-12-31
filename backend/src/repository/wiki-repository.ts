import { cosineDistance, desc, sql } from "drizzle-orm";
import { connection, page } from "../database/schemas";
import { Connection, Page } from "../services/wiki-service";
import { db } from "../database";

export class WikiRepository {
  public static async GetPages() {
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
  public static async GetConnections() {
    const connections = await db.select().from(connection);

    return connections;
  }

  public static async UpdatePage(Pages: Page[]) {
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

  public static async UpdateConnection(Connections: Connection[]) {
    await db
      .insert(connection)
      .values(Connections)
      .onConflictDoNothing({
        target: [connection.targetPage, connection.originPage],
      });
  }
}
