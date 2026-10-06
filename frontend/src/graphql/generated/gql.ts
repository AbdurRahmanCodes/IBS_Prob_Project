/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    token\n    user {\n      id\n      name\n    }\n  }\n}": typeof types.LoginDocument;
  "mutation CreateTask($input: CreateTaskInput!) {\n  createTask(input: $input) {\n    id\n    title\n    description\n    status\n    priority\n    createdAt\n  }\n}\n\nmutation CreateProject($input: CreateProjectInput!) {\n  createProject(input: $input) {\n    id\n    name\n  }\n}\n\nmutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {\n  updateTask(id: $id, input: $input) {\n    id\n    title\n    description\n    status\n    priority\n    createdAt\n  }\n}": typeof types.CreateTaskDocument;
  "query DomainData {\n  users {\n    id\n    name\n    createdAt\n  }\n  projects {\n    id\n    name\n    description\n    owner {\n      id\n      name\n    }\n  }\n  tasks {\n    id\n    title\n    status\n    priority\n    project {\n      id\n      name\n    }\n    assignee {\n      id\n      name\n    }\n  }\n}": typeof types.DomainDataDocument;
  "query GetTasks {\n  tasks {\n    id\n    title\n    description\n    status\n    priority\n    createdAt\n  }\n}\n\nquery GetProjects {\n  projects {\n    id\n    name\n  }\n}": typeof types.GetTasksDocument;
};
const documents: Documents = {
  "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    token\n    user {\n      id\n      name\n    }\n  }\n}":
    types.LoginDocument,
  "mutation CreateTask($input: CreateTaskInput!) {\n  createTask(input: $input) {\n    id\n    title\n    description\n    status\n    priority\n    createdAt\n  }\n}\n\nmutation CreateProject($input: CreateProjectInput!) {\n  createProject(input: $input) {\n    id\n    name\n  }\n}\n\nmutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {\n  updateTask(id: $id, input: $input) {\n    id\n    title\n    description\n    status\n    priority\n    createdAt\n  }\n}":
    types.CreateTaskDocument,
  "query DomainData {\n  users {\n    id\n    name\n    createdAt\n  }\n  projects {\n    id\n    name\n    description\n    owner {\n      id\n      name\n    }\n  }\n  tasks {\n    id\n    title\n    status\n    priority\n    project {\n      id\n      name\n    }\n    assignee {\n      id\n      name\n    }\n  }\n}":
    types.DomainDataDocument,
  "query GetTasks {\n  tasks {\n    id\n    title\n    description\n    status\n    priority\n    createdAt\n  }\n}\n\nquery GetProjects {\n  projects {\n    id\n    name\n  }\n}":
    types.GetTasksDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    token\n    user {\n      id\n      name\n    }\n  }\n}",
): (typeof documents)["mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    token\n    user {\n      id\n      name\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation CreateTask($input: CreateTaskInput!) {\n  createTask(input: $input) {\n    id\n    title\n    description\n    status\n    priority\n    createdAt\n  }\n}\n\nmutation CreateProject($input: CreateProjectInput!) {\n  createProject(input: $input) {\n    id\n    name\n  }\n}\n\nmutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {\n  updateTask(id: $id, input: $input) {\n    id\n    title\n    description\n    status\n    priority\n    createdAt\n  }\n}",
): (typeof documents)["mutation CreateTask($input: CreateTaskInput!) {\n  createTask(input: $input) {\n    id\n    title\n    description\n    status\n    priority\n    createdAt\n  }\n}\n\nmutation CreateProject($input: CreateProjectInput!) {\n  createProject(input: $input) {\n    id\n    name\n  }\n}\n\nmutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {\n  updateTask(id: $id, input: $input) {\n    id\n    title\n    description\n    status\n    priority\n    createdAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query DomainData {\n  users {\n    id\n    name\n    createdAt\n  }\n  projects {\n    id\n    name\n    description\n    owner {\n      id\n      name\n    }\n  }\n  tasks {\n    id\n    title\n    status\n    priority\n    project {\n      id\n      name\n    }\n    assignee {\n      id\n      name\n    }\n  }\n}",
): (typeof documents)["query DomainData {\n  users {\n    id\n    name\n    createdAt\n  }\n  projects {\n    id\n    name\n    description\n    owner {\n      id\n      name\n    }\n  }\n  tasks {\n    id\n    title\n    status\n    priority\n    project {\n      id\n      name\n    }\n    assignee {\n      id\n      name\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetTasks {\n  tasks {\n    id\n    title\n    description\n    status\n    priority\n    createdAt\n  }\n}\n\nquery GetProjects {\n  projects {\n    id\n    name\n  }\n}",
): (typeof documents)["query GetTasks {\n  tasks {\n    id\n    title\n    description\n    status\n    priority\n    createdAt\n  }\n}\n\nquery GetProjects {\n  projects {\n    id\n    name\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
