import axios from "axios";

export class WikiAPI {
  public static async WikiInstance() {
    return axios.create({
      baseURL: "https://desordem-paranormal.onrender.com",
      timeout: 180000,
    });
  }

  public static async getAllPages() {
    try {
      const instance = await this.WikiInstance();
      const pages = await instance.get("/pages");
      console.log(pages.data);
      return pages.data;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  public static async getSearch(search: string) {
    try {
      const instance = await this.WikiInstance();
      const pages = await instance.get(`/pages?name=${search}`);
      return pages.data;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  public static async getConnections() {
    try {
      const instance = await this.WikiInstance();
      const connections = await instance.get("/connections");
      return connections.data;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
