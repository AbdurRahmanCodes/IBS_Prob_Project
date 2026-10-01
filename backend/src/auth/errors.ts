import { GraphQLError } from "graphql";

export class InvalidAccessTokenError extends Error {}

export function unauthenticated(message: string): GraphQLError {
  return new GraphQLError(message, {
    extensions: { code: "UNAUTHENTICATED" },
  });
}

export function badInput(message: string): GraphQLError {
  return new GraphQLError(message, {
    extensions: { code: "BAD_USER_INPUT" },
  });
}
