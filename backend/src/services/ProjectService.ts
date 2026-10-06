import { Project } from "../entities/Project";
import { ProjectRepository } from "../repositories/ProjectRepository";

export interface CreateProjectInput {
  name: string;
  description?: string | null;
}

export class ProjectService {
  constructor(private readonly repository = new ProjectRepository()) {}

  async listProjects(): Promise<Project[]> {
    return this.repository.findAll();
  }

  async createProject(input: CreateProjectInput, ownerId: string): Promise<Project> {
    return this.repository.create({
      name: input.name,
      description: input.description,
      owner: { id: ownerId },
    });
  }
}
