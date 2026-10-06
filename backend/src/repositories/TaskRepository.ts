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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
    return (await this.findById(saved.id))!;
  }

  async findById(id: string): Promise<Task | null> {
    if (!UUID_REGEX.test(id)) {
      return null;
    }
    return AppDataSource.getRepository(Task).findOne({
      where: { id },
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
    });
  }

  async update(id: string, data: UpdateTaskData): Promise<Task> {
    await AppDataSource.getRepository(Task).update(id, data);
    const updated = await this.findById(id);
    return updated!;
  }
}
