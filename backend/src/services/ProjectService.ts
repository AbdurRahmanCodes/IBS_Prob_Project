import { Project } from "../entities/Project";
import { ProjectRepository } from "../repositories/ProjectRepository";

export class ProjectService {
  constructor(private readonly repository = new ProjectRepository()) {}

  async listProjects(): Promise<Project[]> {
    return this.repository.findAll();
  }
}
