import { type GraphQLContext } from "../auth/context";
import { unauthenticated } from "../auth/errors";
import { TaskStatus, TaskPriority } from "../entities/Task";
import { Project } from "../entities/Project";
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { AuthService } from "../services/AuthService";
import { ProjectService } from "../services/ProjectService";
import { TaskService } from "../services/TaskService";
import { UserService } from "../services/UserService";
import type { CreateProjectInput } from "../services/ProjectService";
import type { CreateTaskInput, UpdateTaskInput } from "../services/TaskService";

const authService = new AuthService();
const projectService = new ProjectService();
const taskService = new TaskService();
const userService = new UserService();

function requireUserId(context: GraphQLContext): string {
  if (!context.userId) {
    throw unauthenticated("Login required");
  }

  return context.userId;
}

export const resolvers = {
  Query: {
    health: () => "ok",
    me: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
      authService.findCurrentUser(requireUserId(context)),
    users: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      requireUserId(context);
      return userService.listUsers();
    },
    projects: (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      requireUserId(context);
      return projectService.listProjects();
    },
    tasks: (
      _parent: unknown,
      { page, pageSize }: { page?: number | null; pageSize?: number | null },
      context: GraphQLContext,
    ) => {
      requireUserId(context);
      return taskService.listTasks({ page, pageSize });
    },
  },
  Mutation: {
    register: (
      _parent: unknown,
      { input }: { input: { email: string; name: string; password: string } },
    ) => authService.register(input.email, input.name, input.password),
    login: (_parent: unknown, { input }: { input: { email: string; password: string } }) =>
      authService.login(input.email, input.password),
    createTask: (
      _parent: unknown,
      { input }: { input: CreateTaskInput },
      context: GraphQLContext,
    ) => {
      const userId = requireUserId(context);
      return taskService.createTask(input, userId);
    },
    updateTask: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateTaskInput },
      context: GraphQLContext,
    ) => {
      const userId = requireUserId(context);
      return taskService.updateTask(id, input, userId);
    },
    createProject: (
      _parent: unknown,
      { input }: { input: CreateProjectInput },
      context: GraphQLContext,
    ) => {
      const userId = requireUserId(context);
      return projectService.createProject(input, userId);
    },
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
