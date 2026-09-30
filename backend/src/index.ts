import "reflect-metadata";
import { createServer } from "node:http";
import { AppDataSource } from "./config/DataSource";

const port = Number(process.env.PORT ?? 4000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }

  const server = createServer((request, response) => {
    const pathname = (request.url ?? "/").split("?")[0];

    if (request.method === "GET" && pathname === "/health") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }

    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Not found" }));
  });

  server.on("error", (error) => {
    console.error("HTTP server error:", error);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
  });
}

main();
