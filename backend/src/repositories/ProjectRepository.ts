import { Project } from "../entities/Project";
import { AppDataSource } from "../config/DataSource";
import { publicUserSelect } from "./UserRepository";

export class ProjectRepository {
  async findAll(): Promise<Project[]> {
    return AppDataSource.getRepository(Project).find({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        owner: publicUserSelect,
      },
      relations: { owner: true },
      take: 100,
      order: { createdAt: "ASC" },
    });
  }
}
