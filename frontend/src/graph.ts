import * as d3 from "d3";
import { database, Nodes, type Link, type Node } from "./nodes-treatment";
import { useEffect, useRef } from "react";

export function useGraph() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    async function init() {
      await Nodes();
      if (svgRef.current) {
        Graph(svgRef.current);
      }
    }
    init();
  }, []);

  return svgRef;
}

export function Graph(SVGElement: SVGSVGElement) {
  const width = 800;
  const height = 600;

  const svg = d3
    .select<SVGSVGElement, undefined>(SVGElement) //selecionando o svg
    .attr("height", height)
    .attr("width", width)
    .attr("viewBox", [0, 0, width, height]);

  if (svg.attr("data-graph")) {
    return;
  }

  svg.attr("data-graph", true);
  const g = svg.append("g").attr("cursor", "grab");

  const simulation = d3 //criando a simulação
    .forceSimulation(database.nodes) //definindo o dataset da simulação
    .force("center", d3.forceCenter(400, 300)) //puxando tudo pro centro do svg
    .force("body", d3.forceManyBody()) //faz com que as bolinhas se afastem
    .force(
      "link",
      d3.forceLink<Node, Link>(database.links).id((node) => node.id) //faz elas se aproximarem
    )
    .alphaTarget(0.4); //nao sabemos nao faz sentido.......,,..,.

  const links = g
    .append("g")
    .selectAll<SVGAElement, Link>("line")
    .data(database.links)
    .join("line")
    .attr("stroke", "white");

  const nodes = g
    .append("g") //elemento que agrupa todos os nodes
    .selectAll<SVGElement, Node>("circle") //selectAll deixa sub-intendido que tu vai add algo ali
    .data(database.nodes) //define a dataset que vai ser utilizada
    .join("circle") //cria um elemento pra cada item do data
    .attr("r", 5) //raio do circulo
    .attr("fill", "hotpink"); //cria um elemento pra cada node do dataset
  //todas essas propriedades são do elemento circle, nao do D3 :)

  svg.call(d3.zoom<SVGSVGElement, undefined>().on("zoom", zoomed));

  simulation.on("tick", () => {
    //função chamada a cara interação na simulação
    nodes.attr("cx", (node) => node.x!);
    nodes.attr("cy", (node) => node.y!);

    links.attr("x1", (link) => (link.source as unknown as Node).x!);
    links.attr("y1", (link) => (link.source as unknown as Node).y!);
    links.attr("x2", (link) => (link.target as unknown as Node).x!);
    links.attr("y2", (link) => (link.target as unknown as Node).y!);
  });

  nodes.call(
    // faz com que eu possa arrastar os nodes
    d3
      .drag<SVGElement, Node>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
  );

  function dragstarted(event: d3.D3DragEvent<SVGElement, undefined, Node>) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: d3.D3DragEvent<SVGElement, undefined, Node>) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event: d3.D3DragEvent<SVGElement, undefined, Node>) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, undefined>) {
    g.attr("transform", event.transform.toString());
  }

  return document.body.appendChild(svg.node()!); //ultima linha | add o svg no html
}
