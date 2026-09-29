// Load .env here so the TypeORM CLI (migrations) also gets the DB settings
import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

const requiredEnvVars = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const port = Number(process.env.DB_PORT);
if (!Number.isInteger(port)) {
  throw new Error("DB_PORT must be a number");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.NODE_ENV !== "production",
  entities: [],
  migrations: [],
});
