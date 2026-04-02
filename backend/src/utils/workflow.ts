import { WikiService } from "../services/wiki-service";

export async function Workflow() {
  console.log("Starting database connection update...");
  await WikiService.updatePageConnections();
  console.log("Update completed!");
}

// Call the function if the script is run directly
Workflow().catch((err) => {
  console.error("Workflow failed:", err);
  process.exit(1);
});
