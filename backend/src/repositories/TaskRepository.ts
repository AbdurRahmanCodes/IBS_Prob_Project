import { Task } from "../entities/Task";
import { AppDataSource } from "../config/DataSource";
import { publicUserSelect } from "./UserRepository";

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
          owner: publicUserSelect,
        },
        assignee: publicUserSelect,
      },
      relations: { project: { owner: true }, assignee: true },
      take: 100,
      order: { createdAt: "ASC" },
    });
  }
}
