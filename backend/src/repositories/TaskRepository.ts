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

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
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

  async findById(id: string): Promise<Task | null> {
    return AppDataSource.getRepository(Task).findOne({
      where: { id },
      relations: { project: { owner: true }, assignee: true },
    });
  }

  async update(id: string, data: UpdateTaskData): Promise<Task> {
    const repo = AppDataSource.getRepository(Task);
    const updatePayload: Partial<Task> = {};
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.priority !== undefined) updatePayload.priority = data.priority;

    await repo.update(id, updatePayload);
    const updated = await this.findById(id);
    return updated!;
  }
}
