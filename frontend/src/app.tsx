import { WikiAPI } from "./api/wiki-api";
import { useGraph } from "./graph";

export function App() {
  WikiAPI.getConnections();

  const svgRef = useGraph();

  return <svg ref={svgRef}></svg>;
}
