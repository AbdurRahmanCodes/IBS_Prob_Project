import type { Request } from "express";
import { verifyAccessToken } from "./jwt";
import { InvalidAccessTokenError } from "./errors";

export type GraphQLContext = {
  userId?: string;
};

export function createContext(request: Request): GraphQLContext {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return {};
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return {};
  }

  try {
    return { userId: verifyAccessToken(token) };
  } catch (error) {
    if (error instanceof InvalidAccessTokenError) {
      return {};
    }

    throw error;
  }
}
