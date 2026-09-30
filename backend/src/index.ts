import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import express from "express";
import { createServer } from "node:http";
import { AppDataSource } from "./config/DataSource";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/schema";

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

  const app = express();
  const apolloServer = new ApolloServer({ typeDefs, resolvers });

  try {
    await apolloServer.start();
  } catch (error) {
    console.error("Failed to start the GraphQL server:", error);
    process.exit(1);
  }

  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  app.use("/graphql", cors(), express.json(), expressMiddleware(apolloServer));

  app.use((_request, response) => {
    response.status(404).json({ error: "Not found" });
  });

  const server = createServer(app);

  server.on("error", (error) => {
    console.error("HTTP server error:", error);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
  });
}

main();
