import { useGraph } from "../graph";

export function Graph() {
  const canvasRef = useGraph();

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
        backgroundColor: "#1a1a1a",
      }}
    />
  );
}
