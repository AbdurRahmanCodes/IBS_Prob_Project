import { type GraphQLContext } from "../auth/context";
import { Project } from "../entities/Project";
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { AuthService } from "../services/AuthService";
import { ProjectService } from "../services/ProjectService";
import { TaskService } from "../services/TaskService";
import { UserService } from "../services/UserService";

const authService = new AuthService();
const projectService = new ProjectService();
const taskService = new TaskService();
const userService = new UserService();

export const resolvers = {
  Query: {
    health: () => "ok",
    me: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
      context.userId ? authService.findCurrentUser(context.userId) : null,
    users: () => userService.listUsers(),
    projects: () => projectService.listProjects(),
    tasks: () => taskService.listTasks(),
  },
  Mutation: {
    register: (
      _parent: unknown,
      { input }: { input: { email: string; name: string; password: string } },
    ) => authService.register(input.email, input.name, input.password),
    login: (_parent: unknown, { input }: { input: { email: string; password: string } }) =>
      authService.login(input.email, input.password),
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
