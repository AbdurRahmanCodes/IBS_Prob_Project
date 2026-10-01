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

  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
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

  type Query {
    health: String!
    users: [User!]!
    projects: [Project!]!
    tasks: [Task!]!
  }
`;
