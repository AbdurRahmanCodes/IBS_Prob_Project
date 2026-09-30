// Load .env here so the TypeORM CLI (migrations) also gets the DB settings
import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Project } from "../entities/Project";
import { Task } from "../entities/Task";
import { CreateUser1790748664766 } from "../migrations/1790748664766-CreateUser";
import { CreateProjectAndTask1790761146960 } from "../migrations/1790761146960-CreateProjectAndTask";
import { UpdateTaskProjectRelations1790762541316 } from "../migrations/1790762541316-UpdateTaskProjectRelations";
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
  entities: [User, Project, Task],
  migrations: [
    CreateUser1790748664766,
    CreateProjectAndTask1790761146960,
    UpdateTaskProjectRelations1790762541316,
  ],
});
