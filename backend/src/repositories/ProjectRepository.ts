import { Project } from "../entities/Project";
import { AppDataSource } from "../config/DataSource";

export class ProjectRepository {
  async findAll(): Promise<Project[]> {
    return AppDataSource.getRepository(Project).find({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        owner: { id: true, email: true, name: true, createdAt: true },
      },
      relations: { owner: true },
      order: { createdAt: "ASC" },
    });
  }
}
