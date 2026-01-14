import * as d3 from "d3";
import { WikiAPI } from "./api/wiki-api";

export interface Node extends d3.SimulationNodeDatum {
  //cada bolinha
  id: string;
  group: number;
}
export interface Link extends d3.SimulationLinkDatum<Node> {
  //cada conexão
  value: number;
}

interface Database {
  nodes: Node[];
  links: Link[];
}

export const database: Database = {
  nodes: [
    { id: "Myriel", group: 1 },
    { id: "Napoleon", group: 1 },
  ],
  links: [{ source: "Napoleon", target: "Myriel", value: 1 }],
};

export async function Nodes() {
  const pages = await WikiAPI.getAllPages();
}
