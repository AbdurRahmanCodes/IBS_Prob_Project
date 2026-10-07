import { In, LessThanOrEqual } from "typeorm";
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

export interface FindPaginatedTasksOptions {
  skip: number;
  take: number;
}

export interface PaginatedTasksResult {
  items: Task[];
  totalCount: number;
}

export interface TaskStatsResult {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  dueSoon: number;
}

export const taskSelect = {
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
} as const;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class TaskRepository {
  async findPaginated(options: FindPaginatedTasksOptions): Promise<PaginatedTasksResult> {
    const [items, totalCount] = await AppDataSource.getRepository(Task).findAndCount({
      select: taskSelect,
      relations: { project: { owner: true }, assignee: true },
      skip: options.skip,
      take: options.take,
      order: { createdAt: "DESC", id: "DESC" },
    });

    return { items, totalCount };
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
      select: taskSelect,
      relations: { project: { owner: true }, assignee: true },
    });
  }

  async update(id: string, data: UpdateTaskData): Promise<Task> {
    await AppDataSource.getRepository(Task).update(id, data);
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    if (!UUID_REGEX.test(id)) {
      return;
    }
    await AppDataSource.getRepository(Task).delete(id);
  }

  async getStats(): Promise<TaskStatsResult> {
    const repo = AppDataSource.getRepository(Task);

    const [total, todo, inProgress, done] = await Promise.all([
      repo.count(),
      repo.count({ where: { status: TaskStatus.TODO } }),
      repo.count({ where: { status: TaskStatus.IN_PROGRESS } }),
      repo.count({ where: { status: TaskStatus.DONE } }),
    ]);

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const dueSoon = await repo.count({
      where: {
        status: In([TaskStatus.TODO, TaskStatus.IN_PROGRESS]),
        dueDate: LessThanOrEqual(sevenDaysFromNow),
      },
    });

    return { total, todo, inProgress, done, dueSoon };
  }

  async findDueSoon(limit = 5): Promise<Task[]> {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    return AppDataSource.getRepository(Task).find({
      select: taskSelect,
      relations: { project: { owner: true }, assignee: true },
      where: {
        status: In([TaskStatus.TODO, TaskStatus.IN_PROGRESS]),
        dueDate: LessThanOrEqual(sevenDaysFromNow),
      },
      order: { dueDate: "ASC" },
      take: limit,
    });
  }
}
