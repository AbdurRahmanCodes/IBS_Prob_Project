import { Task } from "../entities/Task";
import { TaskStatus, TaskPriority } from "../entities/Task";
import { AppDataSource } from "../config/DataSource";
import { publicUserSelect } from "./UserRepository";

export interface CreateTaskData {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  project: { id: string };
}

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

  async create(data: CreateTaskData): Promise<Task> {
    const repo = AppDataSource.getRepository(Task);
    const task = repo.create({
      title: data.title,
      description: data.description ?? null,
      status: data.status,
      priority: data.priority,
      project: data.project,
    });
    const saved = await repo.save(task);

    // Re-fetch with full relations so resolvers get project { name, owner } etc.
    const full = await repo.findOne({
      where: { id: saved.id },
      relations: { project: { owner: true }, assignee: true },
    });

    return full!;
  }
}
