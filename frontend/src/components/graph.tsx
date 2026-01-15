import { useGraph } from "../graph";

export function Graph() {
  const svgRef = useGraph();

  return <svg ref={svgRef}></svg>;
}
