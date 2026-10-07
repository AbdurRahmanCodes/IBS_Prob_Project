export const typeDefs = `#graphql
  enum TaskStatus {
    TODO
    IN_PROGRESS
    DONE
  }

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
  }

  input CreateTaskInput {
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    projectId: ID!
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
    priority: TaskPriority
  }

  input CreateProjectInput {
    name: String!
    description: String
  }

  input RegisterInput {
    email: String!
    name: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type User {
    id: ID!
    name: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Project {
    id: ID!
    name: String!
    description: String
    owner: User!
    createdAt: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    dueDate: String
    project: Project!
    assignee: User
    createdAt: String!
  }

  type PaginatedTasks {
    items: [Task!]!
    totalCount: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  type Query {
    health: String!
    me: User
    users: [User!]!
    projects: [Project!]!
    tasks(page: Int, pageSize: Int): PaginatedTasks!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): ID!
    createProject(input: CreateProjectInput!): Project!
  }
`;
