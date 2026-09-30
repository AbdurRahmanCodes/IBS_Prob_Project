import "reflect-metadata";
import { AppDataSource } from "./config/DataSource";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

main();
