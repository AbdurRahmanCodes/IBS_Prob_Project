import { Task } from "../entities/Task";
import { AppDataSource } from "../config/DataSource";

export class TaskRepository {
  async findAll(): Promise<Task[]> {
    return AppDataSource.getRepository(Task).find({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        project: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          owner: { id: true, email: true, name: true, createdAt: true },
        },
        assignee: { id: true, email: true, name: true, createdAt: true },
      },
      relations: { project: { owner: true }, assignee: true },
      order: { createdAt: "ASC" },
    });
  }
}
