import { Task } from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";

export class TaskService {
  constructor(private readonly repository = new TaskRepository()) {}

  async listTasks(): Promise<Task[]> {
    return this.repository.findAll();
  }
}
