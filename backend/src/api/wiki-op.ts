import axios from "axios";

export class WikiOp {
  public static async GetPageNames() {
    try {
      const response = await axios.get(
        `https://ordemparanormal.fandom.com/api.php`,
        {
          params: {
            action: "query",
            format: "json",
            list: "allpages",
            formatversion: "2",
            aplimit: "max",
          },
        }
      );

      console.log(response.data.query.allpages);
    } catch (error) {
      console.log(error, " na GetPageNames");
    }
  }

  public static async getPage(pageName: string) {
    try {
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

      return response.data.query.pages;
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
