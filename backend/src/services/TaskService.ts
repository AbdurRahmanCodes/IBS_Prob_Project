import { Task } from "../entities/Task";
import { TaskStatus, TaskPriority } from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";
import { ProjectRepository } from "../repositories/ProjectRepository";
import { badInput } from "../auth/errors";

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

export class TaskService {
  constructor(
    private readonly repository = new TaskRepository(),
    private readonly projects = new ProjectRepository(),
  ) {}

  async listTasks(): Promise<Task[]> {
    return this.repository.findAll();
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
      throw badInput("You do not have permission to modify this task");
    }

    const updateData: UpdateTaskInput = {};

    if (input.title !== undefined) {
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
      updateData.status = input.status;
    }

    if (input.priority !== undefined) {
      updateData.priority = input.priority;
    }

    return this.repository.update(id, updateData);
  }
}
