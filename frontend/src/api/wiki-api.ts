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
      return await instance.get("/pages?");
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  public static async getSearch(search: string) {
    try {
      const instance = await this.WikiInstance();
      return await instance.get(`/pages?name=${search}`);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  public static async getConnections() {
    try {
      const instance = await this.WikiInstance();
      console.log(await instance.get("/connections"));
      return await instance.get("/connections");
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
