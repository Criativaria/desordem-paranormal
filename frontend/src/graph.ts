import * as d3 from "d3";
import { database, Nodes, type Link, type Node } from "./nodes-treatment";
import { useEffect, useRef } from "react";

export function useGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function init() {
      await Nodes();
      if (canvasRef.current) {
        Graph(canvasRef.current);
      }
    }
    init();
  }, []);

  return canvasRef;
}

export function Graph(canvasElement: HTMLCanvasElement) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const mousePosition = { x: 0, y: 0 };

  const canvas = d3
    .select(canvasElement) //selecionando o canvas
    .attr("height", height)
    .attr("width", width)
    .attr("viewBox", [0, 0, width, height]);

  if (canvas.attr("data-graph")) {
    return;
  }

  canvas.attr("data-graph", true);

  const context = canvasElement.getContext("2d")!;
  let transform = d3.zoomIdentity;

  const centerX = width / 2;
  const centerY = height / 2;

  const simulation = d3 //criando a simulação
    .forceSimulation(database.nodes) //definindo o dataset da simulação
    .force("charge", d3.forceManyBody().strength(-50)) //repulsão entre os nós
    .force("center", d3.forceCenter(centerX, centerY).strength(0.1)) //atração para o centro
    .force(
      "link",
      d3
        .forceLink<Node, Link>(database.links)
        .id((n) => n.id)
        .distance(30),
    )
    .force("mouse", forceMouse)
    .force("radial", d3.forceRadial(0, centerX, centerY).strength(0.09))
    .alphaTarget(0.05); //nao sabemos nao faz sentido.......,,..,.

  let hoverNode: Node | null = null;

  function draw() {
    context.save();
    context.clearRect(0, 0, width, height); // Limpa a tela
    context.translate(transform.x, transform.y); // Aplica Zoom (X e Y)
    context.scale(transform.k, transform.k); // Aplica Zoom (Escala)

    // 1. Desenha todas as Linhas (Links) com opacidade baixa
    context.beginPath();
    context.strokeStyle = "#ffffff";
    context.lineWidth = 0.5; // Linhas mais finas
    context.globalAlpha = 0.1; // Opacidade base bem baixa
    database.links.forEach((link) => {
      const source = link.source as unknown as Node;
      const target = link.target as unknown as Node;
      context.moveTo(source.x!, source.y!);
      context.lineTo(target.x!, target.y!);
    });
    context.stroke();

    // 2. Se tiver hover, destaca as conexões
    if (hoverNode) {
      context.beginPath();
      context.strokeStyle = "#ffffff";
      context.lineWidth = 1.5;
      context.globalAlpha = 1; // Opacidade total para destaque
      database.links.forEach((link) => {
        const source = link.source as unknown as Node;
        const target = link.target as unknown as Node;
        if (source.id === hoverNode!.id || target.id === hoverNode!.id) {
          context.moveTo(source.x!, source.y!);
          context.lineTo(target.x!, target.y!);
        }
      });
      context.stroke();
    }

    context.globalAlpha = 1; // Restaura opacidade para os nós

    // 3. Desenha as Bolinhas (Nodes)
    database.nodes.forEach((node) => {
      context.beginPath();
      // Destaca o nó com hover
      if (hoverNode && node.id === hoverNode.id) {
        context.fillStyle = "#ff0000"; // Cor de destaque no hover
        context.arc(node.x!, node.y!, 8, 0, 2 * Math.PI); // Maior
      } else {
        context.fillStyle = "hotpink";
        context.arc(node.x!, node.y!, 5, 0, 2 * Math.PI);
      }
      context.fill();
    });

    context.restore();
  }

  function forceMouse(alpha: number) {
    const mouseX = mousePosition.x;
    const mouseY = mousePosition.y;
    database.nodes.forEach((node) => {
      const dx = node.x! - mouseX;
      const dy = node.y! - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = ((150 - distance) / 150) * alpha * 2; // Força de repulsão
        node.vx! += (dx / distance) * force;
        node.vy! += (dy / distance) * force;
      }
    });
  }

  canvas.call(
    d3
      .drag<HTMLCanvasElement, unknown>()
      .container(canvasElement)
      .subject((event) => {
        // Como não existem elementos individuais, o D3 busca o nó mais próximo do clique
        const x = transform.invertX(event.x);
        const y = transform.invertY(event.y);
        return simulation.find(x, y, 40); // Increased radius to 40
      })
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended),
  );

  canvas.call(
    d3
      .zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.1, 10])
      .on("zoom", (event) => {
        transform = event.transform;
        draw(); // Redesenha ao dar zoom
      }),
  );

  canvas.on("mousemove", mousemove);
  canvas.on("mouseout", mouseout);

  function mousemove(event: MouseEvent) {
    const [x, y] = d3.pointer(event);
    const tx = transform.invertX(x);
    const ty = transform.invertY(y);

    mousePosition.x = tx;
    mousePosition.y = ty;

    // Check for hover
    const newHover = simulation.find(tx, ty, 20);
    if (hoverNode !== newHover) {
      hoverNode = newHover || null;
      draw();
    }

    // Restart simulation to make sure the force applies if it has cooled down
    simulation.alphaTarget(0.3).restart();
  }

  function mouseout() {
    // Move mouse position far away so force doesn't apply
    mousePosition.x = -10000;
    mousePosition.y = -10000;

    if (hoverNode) {
      hoverNode = null;
      draw();
    }

    simulation.alphaTarget(0.05); // Return to low alpha target
  }

  function dragstarted(
    event: d3.D3DragEvent<HTMLCanvasElement, undefined, Node>,
  ) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: d3.D3DragEvent<HTMLCanvasElement, undefined, Node>) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(
    event: d3.D3DragEvent<HTMLCanvasElement, undefined, Node>,
  ) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return simulation.on("tick", draw);
}
