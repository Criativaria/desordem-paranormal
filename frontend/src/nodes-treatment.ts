import * as d3 from "d3";
import { WikiAPI } from "./api/wiki-api";
import type { connections, page } from "./dtos/wiki-types";

export interface Node extends d3.SimulationNodeDatum {
  //cada bolinha
  id: number;
}
export interface Link extends d3.SimulationLinkDatum<Node> {
  //cada conexão
  source: number;
  target: number;
}

interface Database {
  nodes: Node[];
  links: Link[];
}

export const database: Database = {
  nodes: [],
  links: [],
};

export async function Nodes() {
  const pages: page[] = await WikiAPI.getAllPages();
  pages.map((page) => {
    database.nodes.push({ id: page.id });
  });

  const connections: connections[] = await WikiAPI.getConnections();
  connections.map((connection) => {
    database.links.push({
      target: connection.targetPage,
      source: connection.originPage,
    });
  });
}
