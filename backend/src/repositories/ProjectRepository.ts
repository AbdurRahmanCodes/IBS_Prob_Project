import { Project } from "../entities/Project";
import { AppDataSource } from "../config/DataSource";
import { publicUserSelect } from "./UserRepository";

export interface CreateProjectData {
  name: string;
  description?: string | null;
  owner: { id: string };
}

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

  async findByIdAndOwner(id: string, ownerId: string): Promise<Project | null> {
    return AppDataSource.getRepository(Project).findOne({
      where: { id, owner: { id: ownerId } },
      relations: { owner: true },
    });
  }

  async create(data: CreateProjectData): Promise<Project> {
    const repo = AppDataSource.getRepository(Project);
    const project = repo.create({
      name: data.name,
      description: data.description ?? null,
      owner: data.owner,
    });
    return repo.save(project);
  }
}
