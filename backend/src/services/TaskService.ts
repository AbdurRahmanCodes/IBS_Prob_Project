import { Task } from "../entities/Task";
import { TaskStatus, TaskPriority } from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";
import { ProjectRepository } from "../repositories/ProjectRepository";
import { badInput, forbidden } from "../auth/errors";

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface ListTasksInput {
  page?: number | null;
  pageSize?: number | null;
}

export interface PaginatedTasksResponse {
  items: Task[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class TaskService {
  constructor(
    private readonly repository = new TaskRepository(),
    private readonly projects = new ProjectRepository(),
  ) {}

  async listTasks(input?: ListTasksInput): Promise<PaginatedTasksResponse> {
    const rawPage = input?.page ?? 1;
    const rawPageSize = input?.pageSize ?? 6;

    if (rawPage < 1 || !Number.isInteger(rawPage)) {
      throw badInput("Page must be an integer greater than or equal to 1");
    }

    if (rawPageSize < 1 || rawPageSize > 100 || !Number.isInteger(rawPageSize)) {
      throw badInput("PageSize must be an integer between 1 and 100");
    }

    const skip = (rawPage - 1) * rawPageSize;
    const { items, totalCount } = await this.repository.findPaginated({
      skip,
      take: rawPageSize,
    });

    const totalPages = Math.ceil(totalCount / rawPageSize) || 1;

    return {
      items,
      totalCount,
      page: rawPage,
      pageSize: rawPageSize,
      totalPages,
    };
  }

  async createTask(input: CreateTaskInput, userId: string): Promise<Task> {
    const normalizedTitle = input.title.trim();

    if (!normalizedTitle) {
      throw badInput("Task title must not be empty");
    }

    const project = await this.projects.findByIdAndOwner(input.projectId, userId);

    if (!project) {
      throw badInput("Project not found or does not belong to you");
    }

    return this.repository.create({
      title: normalizedTitle,
      description: input.description,
      status: input.status,
      priority: input.priority,
      project: { id: project.id },
    });
  }

  async updateTask(id: string, input: UpdateTaskInput, userId: string): Promise<Task> {
    const task = await this.repository.findById(id);

    if (!task) {
      throw badInput("Task not found");
    }

    if (task.project.owner.id !== userId) {
      throw forbidden("You do not have permission to modify this task");
    }

    if (
      input.title === undefined &&
      input.description === undefined &&
      input.status === undefined &&
      input.priority === undefined
    ) {
      return task;
    }

    const updateData: UpdateTaskInput = {};

    if (input.title !== undefined) {
      if (input.title === null) {
        throw badInput("Task title must not be null");
      }
      const normalizedTitle = input.title.trim();
      if (!normalizedTitle) {
        throw badInput("Task title must not be empty");
      }
      updateData.title = normalizedTitle;
    }

    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    if (input.status !== undefined) {
      if (input.status === null) {
        throw badInput("Task status must not be null");
      }
      updateData.status = input.status;
    }

    if (input.priority !== undefined) {
      if (input.priority === null) {
        throw badInput("Task priority must not be null");
      }
      updateData.priority = input.priority;
    }

    return this.repository.update(id, updateData);
  }
}
