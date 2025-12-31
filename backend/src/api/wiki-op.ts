import axios from "axios";
import wiki from "wikijs";

export class WikiOp {
  public static async GetPageNames() {
    try {
      const pageNames = await wiki({
        apiUrl: "https://ordemparanormal.fandom.com/api.php",
      }).allPages();

      return pageNames;
    } catch (error) {
      console.log(error, " na GetPageNames");
    }
  }

  public static async getPage(pageName: string) {
    try {
      const page = await wiki({
        apiUrl: "https://ordemparanormal.fandom.com/api.php",
      }).page(pageName);

      return page;
    } catch (error) {
      console.log(error, " na GetPage");
    }
  }

  public static async getWikiText(
    pageName: string
  ): Promise<string | undefined> {
    const response = await axios.get(
      `https://ordemparanormal.fandom.com/api.php`,
      {
        params: {
          action: "query",
          prop: "revisions",
          titles: pageName,
          rvslots: "*",
          rvprop: "content",
          format: "json",
        },
      }
    );

    const pages = response.data.query.pages;
    const firstPage: any = Object.values(pages)[0];

    if (!firstPage) return;

    const pageWikiText = firstPage?.revisions[0]?.slots?.main["*"];
    return pageWikiText;
  }
}
