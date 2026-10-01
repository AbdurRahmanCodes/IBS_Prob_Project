import { Project } from "../entities/Project";
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { ProjectService } from "../services/ProjectService";
import { TaskService } from "../services/TaskService";
import { UserService } from "../services/UserService";

const projectService = new ProjectService();
const taskService = new TaskService();
const userService = new UserService();

export const resolvers = {
  Query: {
    health: () => "ok",
    users: () => userService.listUsers(),
    projects: () => projectService.listProjects(),
    tasks: () => taskService.listTasks(),
  },
  User: {
    createdAt: (user: User) => user.createdAt.toISOString(),
  },
  Project: {
    createdAt: (project: Project) => project.createdAt.toISOString(),
  },
  Task: {
    dueDate: (task: Task) => task.dueDate?.toISOString() ?? null,
    createdAt: (task: Task) => task.createdAt.toISOString(),
  },
};
