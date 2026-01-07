import { WikiAPI } from "./api/wiki-api";
import { useGraph } from "./graph";

export function App() {
  WikiAPI.getAllPages();

  const svgRef = useGraph();

  return <svg ref={svgRef}></svg>;
}
